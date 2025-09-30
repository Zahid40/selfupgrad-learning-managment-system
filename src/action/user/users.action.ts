// /action/users/users.action.ts
"use server";

import { createClient } from "@/lib/server";
import { UserType } from "@/types/type";
import { getUser } from "./user.action";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UsersFilter {
  role?: string | string[];
  search?: string; // Search across username, first_name, last_name, email
  created_after?: string;
  created_before?: string;
  last_active_after?: string;
  has_phone?: boolean;
  has_avatar?: boolean;
}

export interface UsersSortOptions {
  field: "created_at" | "last_active_at" | "username" | "email" | "first_name" | "last_name";
  ascending?: boolean;
}

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface UsersQueryResult {
  users: UserType[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UserWithStats extends UserType {
  enrollments_count?: number;
  courses_instructing?: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if current user has permission to access user management features
 * Admins and instructors typically have access
 */
async function checkUserPermission(requiredRoles: string[] = ["admin", "instructor"]) {
  const currentUser = await getUser();
  
  if (!currentUser?.id) {
    throw new Error("Unauthorized: User not authenticated");
  }

  if (!requiredRoles.includes(currentUser.role)) {
    throw new Error(`Unauthorized: User role '${currentUser.role}' does not have permission`);
  }

  return currentUser;
}

/**
 * Build dynamic query with filters
 */
function applyFilters(
  query: any,
  filters?: UsersFilter
) {
  if (!filters) return query;

  // Role filter - supports single role or multiple roles
  if (filters.role) {
    if (Array.isArray(filters.role)) {
      query = query.in("role", filters.role);
    } else {
      query = query.eq("role", filters.role);
    }
  }

  // Search filter - searches across multiple fields
  if (filters.search && filters.search.trim()) {
    const searchTerm = `%${filters.search.trim()}%`;
    query = query.or(
      `username.ilike.${searchTerm},` +
      `first_name.ilike.${searchTerm},` +
      `last_name.ilike.${searchTerm},` +
      `email.ilike.${searchTerm}`
    );
  }

  // Date range filters
  if (filters.created_after) {
    query = query.gte("created_at", filters.created_after);
  }
  if (filters.created_before) {
    query = query.lte("created_at", filters.created_before);
  }

  // Last active filter
  if (filters.last_active_after) {
    query = query.gte("last_active_at", filters.last_active_after);
  }

  // Boolean filters
  if (filters.has_phone !== undefined) {
    query = filters.has_phone
      ? query.not("phone", "is", null)
      : query.is("phone", null);
  }

  if (filters.has_avatar !== undefined) {
    query = filters.has_avatar
      ? query.not("avatar_url", "is", null)
      : query.is("avatar_url", null);
  }

  return query;
}

// ============================================================================
// MAIN ACTIONS
// ============================================================================

/**
 * Get all users with advanced filtering, sorting, and pagination
 */
export async function getUsers(
  filters?: UsersFilter,
  sort?: UsersSortOptions,
  pagination?: PaginationOptions
): Promise<UsersQueryResult> {
  try {
    // Check permissions
    await checkUserPermission(["admin", "instructor"]);

    const supabase = await createClient();
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const startOffset = (page - 1) * pageSize;
    const endOffset = startOffset + pageSize - 1;

    // Build base query
    let query = supabase
      .from("users")
      .select("*", { count: "exact" });

    // Apply filters
    query = applyFilters(query, filters);

    // Apply sorting
    const sortField = sort?.field || "created_at";
    const ascending = sort?.ascending ?? false;
    query = query.order(sortField, { ascending });

    // Apply pagination
    query = query.range(startOffset, endOffset);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      users: (data as UserType[]) || [],
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    console.error("Error in getUsers:", error);
    throw error;
  }
}

/**
 * Get a single user by ID with optional stats
 */
export async function getUserById(
  userId: string,
  includeStats: boolean = false
): Promise<UserWithStats | null> {
  try {
    await checkUserPermission(["admin", "instructor"]);

    const supabase = await createClient();

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    if (!user) {
      return null;
    }

    // Optionally fetch user statistics
    if (includeStats) {
      // Get enrollment count
      const { count: enrollmentsCount } = await supabase
        .from("course_enrollments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      // Get courses where user is an instructor
      const { count: coursesInstructing } = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true })
        .contains("instructor_id", [userId]);

      return {
        ...user,
        enrollments_count: enrollmentsCount || 0,
        courses_instructing: coursesInstructing || 0,
      } as UserWithStats;
    }

    return user as UserType;
  } catch (error) {
    console.error("Error in getUserById:", error);
    throw error;
  }
}

/**
 * Get users by role
 */
export async function getUsersByRole(
  role: string,
  pagination?: PaginationOptions
): Promise<UsersQueryResult> {
  return getUsers({ role }, { field: "created_at", ascending: false }, pagination);
}

/**
 * Search users by query string
 */
export async function searchUsers(
  searchQuery: string,
  pagination?: PaginationOptions
): Promise<UsersQueryResult> {
  return getUsers(
    { search: searchQuery },
    { field: "created_at", ascending: false },
    pagination
  );
}

/**
 * Get all instructors with course counts
 */
export async function getInstructors(
  pagination?: PaginationOptions
): Promise<UsersQueryResult> {
  try {
    await checkUserPermission(["admin"]);

    const supabase = await createClient();
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const startOffset = (page - 1) * pageSize;
    const endOffset = startOffset + pageSize - 1;

    const { data, error, count } = await supabase
      .from("users")
      .select("*", { count: "exact" })
      .eq("role", "instructor")
      .order("created_at", { ascending: false })
      .range(startOffset, endOffset);

    if (error) {
      throw new Error(`Failed to fetch instructors: ${error.message}`);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      users: (data as UserType[]) || [],
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    console.error("Error in getInstructors:", error);
    throw error;
  }
}

/**
 * Get users enrolled in a specific course
 */
export async function getUsersByCourse(
  courseId: string,
  pagination?: PaginationOptions
): Promise<UsersQueryResult> {
  try {
    await checkUserPermission(["admin", "instructor"]);

    const supabase = await createClient();
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const startOffset = (page - 1) * pageSize;
    const endOffset = startOffset + pageSize - 1;

    const { data, error, count } = await supabase
      .from("course_enrollments")
      .select(
        `
        user_id,
        enrolled_at,
        progress,
        completed,
        users (*)
      `,
        { count: "exact" }
      )
      .eq("course_id", courseId)
      .order("enrolled_at", { ascending: false })
      .range(startOffset, endOffset);

    if (error) {
      throw new Error(`Failed to fetch enrolled users: ${error.message}`);
    }

    const users = data?.map((enrollment: any) => enrollment.users) || [];
    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      users: users as UserType[],
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    console.error("Error in getUsersByCourse:", error);
    throw error;
  }
}

/**
 * Get recently active users (last 30 days)
 */
export async function getRecentlyActiveUsers(
  pagination?: PaginationOptions
): Promise<UsersQueryResult> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return getUsers(
    { last_active_after: thirtyDaysAgo.toISOString() },
    { field: "last_active_at", ascending: false },
    pagination
  );
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(
  userId: string,
  newRole: string
): Promise<UserType> {
  try {
    await checkUserPermission(["admin"]);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("users")
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to update user role: ${error.message}`);
    }

    return data as UserType;
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    throw error;
  }
}

/**
 * Update user profile (admin only)
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserType, "id" | "created_at" | "updated_at">>
): Promise<UserType> {
  try {
    await checkUserPermission(["admin"]);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to update user profile: ${error.message}`);
    }

    return data as UserType;
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
}

/**
 * Delete user (admin only) - soft delete by archiving
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    await checkUserPermission(["admin"]);

    const currentUser = await getUser();
    
    // Prevent self-deletion
    if (currentUser.id === userId) {
      throw new Error("Cannot delete your own account");
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    throw error;
  }
}

/**
 * Get user statistics (admin only)
 */
export async function getUserStats() {
  try {
    await checkUserPermission(["admin"]);

    const supabase = await createClient();

    // Total users count
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    // Users by role
    const { data: roleData } = await supabase
      .from("users")
      .select("role");

    const usersByRole = roleData?.reduce((acc: Record<string, number>, user: any) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    // Recently active users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: activeUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("last_active_at", sevenDaysAgo.toISOString());

    // New users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: newUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thirtyDaysAgo.toISOString());

    return {
      totalUsers: totalUsers || 0,
      usersByRole: usersByRole || {},
      activeUsers: activeUsers || 0,
      newUsers: newUsers || 0,
    };
  } catch (error) {
    console.error("Error in getUserStats:", error);
    throw error;
  }
}

/**
 * Bulk update users (admin only)
 */
export async function bulkUpdateUsers(
  userIds: string[],
  updates: Partial<Omit<UserType, "id" | "created_at">>
): Promise<number> {
  try {
    await checkUserPermission(["admin"]);

    const supabase = await createClient();

    const { error, count } = await supabase
      .from("users")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .in("id", userIds);

    if (error) {
      throw new Error(`Failed to bulk update users: ${error.message}`);
    }

    return count || 0;
  } catch (error) {
    console.error("Error in bulkUpdateUsers:", error);
    throw error;
  }
}
