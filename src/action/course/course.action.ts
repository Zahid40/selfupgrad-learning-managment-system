'use server'

import { createClient } from '@/lib/server'
import { Tables, TablesInsert, TablesUpdate, Enums } from '@/types/db.types'
import { revalidatePath } from 'next/cache'

// Types for course filtering and sorting
export interface CourseFilters {
  course_id?: string
  instructor_id?: string
  category_id?: string
  status?: Enums<'course_status'>
  visibility?: Enums<'course_visibility'>
  level?: Enums<'course_level'>
  featured?: boolean
  language?: string[]
  tags?: string[]
  search?: string
  min_rating?: number
  max_rating?: number
  min_enrollments?: number
  max_enrollments?: number
  created_after?: string
  created_before?: string
  updated_after?: string
  updated_before?: string
}

export interface CourseSortOptions {
  field: 'title' | 'created_at' | 'updated_at' | 'rating' | 'enrollments_count' | 'featured'
  direction: 'asc' | 'desc'
}

export interface CourseQueryOptions {
  filters?: CourseFilters
  sort?: CourseSortOptions
  page?: number
  limit?: number
  include_relations?: boolean
}

export interface CourseListResponse {
  courses: Tables<'courses'>[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Get course by ID
export async function getCourseById(courseId: string): Promise<Tables<'courses'> | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()

    if (error) {
      console.error('Error fetching course:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getCourseById:', error)
    return null
  }
}

// Get course by slug
export async function getCourseBySlug(slug: string): Promise<Tables<'courses'> | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching course by slug:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getCourseBySlug:', error)
    return null
  }
}

// Get courses with comprehensive filtering and sorting
export async function getCourses(options: CourseQueryOptions = {}): Promise<CourseListResponse> {
  try {
    const supabase = await createClient()
    const {
      filters = {},
      sort = { field: 'created_at', direction: 'desc' },
      page = 1,
      limit = 10,
      include_relations = false
    } = options

    let query = supabase.from('courses').select('*', { count: 'exact' })

    // Apply filters
    if (filters.course_id) {
      query = query.eq('id', filters.course_id)
    }

    if (filters.instructor_id) {
      query = query.contains('instructor_id', [filters.instructor_id])
    }

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id)
    }

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.visibility) {
      query = query.eq('visibility', filters.visibility)
    }

    if (filters.level) {
      query = query.eq('level', filters.level)
    }

    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }

    if (filters.language && filters.language.length > 0) {
      query = query.overlaps('language', filters.language)
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tagline.ilike.%${filters.search}%`)
    }

    if (filters.min_rating !== undefined) {
      query = query.gte('rating', filters.min_rating)
    }

    if (filters.max_rating !== undefined) {
      query = query.lte('rating', filters.max_rating)
    }

    if (filters.min_enrollments !== undefined) {
      query = query.gte('enrollments_count', filters.min_enrollments)
    }

    if (filters.max_enrollments !== undefined) {
      query = query.lte('enrollments_count', filters.max_enrollments)
    }

    if (filters.created_after) {
      query = query.gte('created_at', filters.created_after)
    }

    if (filters.created_before) {
      query = query.lte('created_at', filters.created_before)
    }

    if (filters.updated_after) {
      query = query.gte('updated_at', filters.updated_after)
    }

    if (filters.updated_before) {
      query = query.lte('updated_at', filters.updated_before)
    }

    // Apply sorting
    query = query.order(sort.field, { ascending: sort.direction === 'asc' })

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching courses:', error)
      throw new Error('Failed to fetch courses')
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      courses: data || [],
      total,
      page,
      limit,
      totalPages
    }
  } catch (error) {
    console.error('Error in getCourses:', error)
    throw error
  }
}

// Get courses with relations (category, pricing, etc.)
export async function getCoursesWithRelations(options: CourseQueryOptions = {}): Promise<CourseListResponse> {
  try {
    const supabase = await createClient()
    const {
      filters = {},
      sort = { field: 'created_at', direction: 'desc' },
      page = 1,
      limit = 10
    } = options

    let query = supabase
      .from('courses')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          description
        ),
        pricing (
          id,
          price,
          currency,
          model
        )
      `, { count: 'exact' })

    // Apply filters (same as getCourses)
    if (filters.course_id) {
      query = query.eq('id', filters.course_id)
    }

    if (filters.instructor_id) {
      query = query.contains('instructor_id', [filters.instructor_id])
    }

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id)
    }

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.visibility) {
      query = query.eq('visibility', filters.visibility)
    }

    if (filters.level) {
      query = query.eq('level', filters.level)
    }

    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured)
    }

    if (filters.language && filters.language.length > 0) {
      query = query.overlaps('language', filters.language)
    }

    if (filters.tags && filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tagline.ilike.%${filters.search}%`)
    }

    if (filters.min_rating !== undefined) {
      query = query.gte('rating', filters.min_rating)
    }

    if (filters.max_rating !== undefined) {
      query = query.lte('rating', filters.max_rating)
    }

    if (filters.min_enrollments !== undefined) {
      query = query.gte('enrollments_count', filters.min_enrollments)
    }

    if (filters.max_enrollments !== undefined) {
      query = query.lte('enrollments_count', filters.max_enrollments)
    }

    if (filters.created_after) {
      query = query.gte('created_at', filters.created_after)
    }

    if (filters.created_before) {
      query = query.lte('created_at', filters.created_before)
    }

    if (filters.updated_after) {
      query = query.gte('updated_at', filters.updated_after)
    }

    if (filters.updated_before) {
      query = query.lte('updated_at', filters.updated_before)
    }

    // Apply sorting
    query = query.order(sort.field, { ascending: sort.direction === 'asc' })

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching courses with relations:', error)
      throw new Error('Failed to fetch courses with relations')
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      courses: data || [],
      total,
      page,
      limit,
      totalPages
    }
  } catch (error) {
    console.error('Error in getCoursesWithRelations:', error)
    throw error
  }
}

// Create a new course
export async function createCourse(courseData: TablesInsert<'courses'>, userId: string): Promise<{ success: boolean; course?: Tables<'courses'>; error?: string }> {
  try {
    const supabase = await createClient()

    // Validate required fields
    if (!courseData.title || !courseData.slug || !courseData.instructor_id) {
      return { success: false, error: 'Title, slug, and instructor_id are required' }
    }

    // Check if slug already exists
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', courseData.slug)
      .single()

    if (existingCourse) {
      return { success: false, error: 'Course with this slug already exists' }
    }

    // Prepare course data
    const newCourse: TablesInsert<'courses'> = {
      ...courseData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: userId,
      status: courseData.status || 'draft',
      visibility: courseData.visibility || 'private',
      enrollments_count: courseData.enrollments_count || 0,
      reviews_count: courseData.reviews_count || 0,
      rating: courseData.rating || 0
    }

    const { data, error } = await supabase
      .from('courses')
      .insert(newCourse)
      .select()
      .single()

    if (error) {
      console.error('Error creating course:', error)
      return { success: false, error: 'Failed to create course' }
    }

    revalidatePath('/dashboard/course')
    return { success: true, course: data }
  } catch (error) {
    console.error('Error in createCourse:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Update an existing course
export async function updateCourse(
  courseId: string, 
  courseData: Partial<TablesUpdate<'courses'>>, 
  userId: string
): Promise<{ success: boolean; course?: Tables<'courses'>; error?: string }> {
  try {
    const supabase = await createClient()

    // Check if course exists
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .single()

    if (!existingCourse) {
      return { success: false, error: 'Course not found' }
    }

    // If slug is being updated, check if it already exists
    if (courseData.slug) {
      const { data: slugExists } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', courseData.slug)
        .neq('id', courseId)
        .single()

      if (slugExists) {
        return { success: false, error: 'Course with this slug already exists' }
      }
    }

    // Prepare update data
    const updateData: TablesUpdate<'courses'> = {
      ...courseData,
      updated_at: new Date().toISOString(),
      updated_by: userId
    }

    const { data, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', courseId)
      .select()
      .single()

    if (error) {
      console.error('Error updating course:', error)
      return { success: false, error: 'Failed to update course' }
    }

    revalidatePath('/dashboard/course')
    revalidatePath(`/dashboard/course/${courseId}`)
    return { success: true, course: data }
  } catch (error) {
    console.error('Error in updateCourse:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Delete a course
export async function deleteCourse(courseId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Check if course exists
    const { data: existingCourse } = await supabase
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .single()

    if (!existingCourse) {
      return { success: false, error: 'Course not found' }
    }

    // Delete the course
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)

    if (error) {
      console.error('Error deleting course:', error)
      return { success: false, error: 'Failed to delete course' }
    }

    revalidatePath('/dashboard/course')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteCourse:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Bulk operations
export async function bulkUpdateCourses(
  courseIds: string[], 
  updateData: Partial<TablesUpdate<'courses'>>, 
  userId: string
): Promise<{ success: boolean; updatedCount: number; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('courses')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
        updated_by: userId
      })
      .in('id', courseIds)
      .select('id')

    if (error) {
      console.error('Error bulk updating courses:', error)
      return { success: false, updatedCount: 0, error: 'Failed to bulk update courses' }
    }

    revalidatePath('/dashboard/course')
    return { success: true, updatedCount: data?.length || 0 }
  } catch (error) {
    console.error('Error in bulkUpdateCourses:', error)
    return { success: false, updatedCount: 0, error: 'An unexpected error occurred' }
  }
}

export async function bulkDeleteCourses(courseIds: string[]): Promise<{ success: boolean; deletedCount: number; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('courses')
      .delete()
      .in('id', courseIds)
      .select('id')

    if (error) {
      console.error('Error bulk deleting courses:', error)
      return { success: false, deletedCount: 0, error: 'Failed to bulk delete courses' }
    }

    revalidatePath('/dashboard/course')
    return { success: true, deletedCount: data?.length || 0 }
  } catch (error) {
    console.error('Error in bulkDeleteCourses:', error)
    return { success: false, deletedCount: 0, error: 'An unexpected error occurred' }
  }
}

// Course statistics
export async function getCourseStats(): Promise<{
  total: number
  published: number
  draft: number
  archived: number
  featured: number
  averageRating: number
  totalEnrollments: number
}> {
  try {
    const supabase = await createClient()

    // Get total courses
    const { count: total } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })

    // Get courses by status
    const { count: published } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    const { count: draft } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft')

    const { count: archived } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'archived')

    const { count: featured } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('featured', true)

    // Get average rating and total enrollments
    const { data: stats } = await supabase
      .from('courses')
      .select('rating, enrollments_count')

    const averageRating = stats ? stats.reduce((sum, course) => sum + (course.rating || 0), 0) / stats.length : 0
    const totalEnrollments = stats ? stats.reduce((sum, course) => sum + (course.enrollments_count || 0), 0) : 0

    return {
      total: total || 0,
      published: published || 0,
      draft: draft || 0,
      archived: archived || 0,
      featured: featured || 0,
      averageRating: Math.round(averageRating * 100) / 100,
      totalEnrollments
    }
  } catch (error) {
    console.error('Error in getCourseStats:', error)
    throw error
  }
}

// Search courses
export async function searchCourses(
  searchTerm: string, 
  options: Omit<CourseQueryOptions, 'filters'> = {}
): Promise<CourseListResponse> {
  const searchFilters: CourseFilters = {
    search: searchTerm
  }

  return getCourses({
    ...options,
    filters: searchFilters
  })
}

// Get featured courses
export async function getFeaturedCourses(limit: number = 6): Promise<Tables<'courses'>[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('featured', true)
      .eq('status', 'published')
      .eq('visibility', 'public')
      .order('rating', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching featured courses:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getFeaturedCourses:', error)
    return []
  }
}

// Get courses by instructor
export async function getCoursesByInstructor(
  instructorId: string, 
  options: Omit<CourseQueryOptions, 'filters'> = {}
): Promise<CourseListResponse> {
  const instructorFilters: CourseFilters = {
    instructor_id: instructorId
  }

  return getCourses({
    ...options,
    filters: instructorFilters
  })
}

// Get courses by category
export async function getCoursesByCategory(
  categoryId: string, 
  options: Omit<CourseQueryOptions, 'filters'> = {}
): Promise<CourseListResponse> {
  const categoryFilters: CourseFilters = {
    category_id: categoryId
  }

  return getCourses({
    ...options,
    filters: categoryFilters
  })
}
