'use server'

import { createClient } from '@/lib/server'
import { Tables, TablesInsert, TablesUpdate, Enums } from '@/types/db.types'
import { revalidatePath } from 'next/cache'

// Types for chapter filtering and sorting
export interface ChapterFilters {
  chapter_id?: string
  course_id?: string
  is_free?: boolean
  search?: string
  created_after?: string
  created_before?: string
  updated_after?: string
  updated_before?: string
}

export interface ChapterSortOptions {
  field: 'title' | 'order_index' | 'created_at' | 'updated_at'
  direction: 'asc' | 'desc'
}

export interface ChapterQueryOptions {
  filters?: ChapterFilters
  sort?: ChapterSortOptions
  page?: number
  limit?: number
  include_lessons?: boolean
}

export interface ChapterListResponse {
  chapters: Tables<'chapters'>[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ChapterWithLessons extends Tables<'chapters'> {
  lessons?: Tables<'lessons'>[]
}

// Get chapter by ID
export async function getChapterById(chapterId: string): Promise<Tables<'chapters'> | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single()

    if (error) {
      console.error('Error fetching chapter:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getChapterById:', error)
    return null
  }
}

// Get chapter with lessons
export async function getChapterWithLessons(chapterId: string): Promise<ChapterWithLessons | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('chapters')
      .select(`
        *,
        lessons (*)
      `)
      .eq('id', chapterId)
      .single()

    if (error) {
      console.error('Error fetching chapter with lessons:', error)
      return null
    }

    // Sort lessons by order_index
    if (data && data.lessons) {
      data.lessons.sort((a: Tables<'lessons'>, b: Tables<'lessons'>) => a.order_index - b.order_index)
    }

    return data as ChapterWithLessons
  } catch (error) {
    console.error('Error in getChapterWithLessons:', error)
    return null
  }
}

// Get chapters with comprehensive filtering and sorting
export async function getChapters(options: ChapterQueryOptions = {}): Promise<ChapterListResponse> {
  try {
    const supabase = await createClient()
    const {
      filters = {},
      sort = { field: 'order_index', direction: 'asc' },
      page = 1,
      limit = 50,
      include_lessons = false
    } = options

    let query = supabase.from('chapters').select('*', { count: 'exact' })

    // Apply filters
    if (filters.chapter_id) {
      query = query.eq('id', filters.chapter_id)
    }

    if (filters.course_id) {
      query = query.eq('course_id', filters.course_id)
    }

    if (filters.is_free !== undefined) {
      query = query.eq('is_free', filters.is_free)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
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
      console.error('Error fetching chapters:', error)
      throw new Error('Failed to fetch chapters')
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      chapters: data || [],
      total,
      page,
      limit,
      totalPages
    }
  } catch (error) {
    console.error('Error in getChapters:', error)
    throw error
  }
}

// Get chapters with lessons
export async function getChaptersWithLessons(options: ChapterQueryOptions = {}): Promise<ChapterWithLessons[]> {
  try {
    const supabase = await createClient()
    const {
      filters = {},
      sort = { field: 'order_index', direction: 'asc' }
    } = options

    let query = supabase
      .from('chapters')
      .select(`
        *,
        lessons (*)
      `)

    // Apply filters
    if (filters.chapter_id) {
      query = query.eq('id', filters.chapter_id)
    }

    if (filters.course_id) {
      query = query.eq('course_id', filters.course_id)
    }

    if (filters.is_free !== undefined) {
      query = query.eq('is_free', filters.is_free)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    // Apply sorting
    query = query.order(sort.field, { ascending: sort.direction === 'asc' })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching chapters with lessons:', error)
      throw new Error('Failed to fetch chapters with lessons')
    }

    // Sort lessons within each chapter by order_index
    const chaptersWithSortedLessons = (data || []).map((chapter: any) => {
      if (chapter.lessons) {
        chapter.lessons.sort((a: Tables<'lessons'>, b: Tables<'lessons'>) => a.order_index - b.order_index)
      }
      return chapter as ChapterWithLessons
    })

    return chaptersWithSortedLessons
  } catch (error) {
    console.error('Error in getChaptersWithLessons:', error)
    throw error
  }
}

// Get chapters by course ID
// Get chapters by course ID
export async function getChaptersByCourse(
  courseId: string,
  includeLessons: boolean = false
): Promise<ChapterWithLessons[]> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('chapters')
      .select(includeLessons ? `*, lessons (*)` : '*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching chapters by course:', error)
      return []
    }

    // Sort lessons within each chapter if included
    if (includeLessons && data) {
      data.forEach((chapter: any) => {
        if (chapter.lessons) {
          chapter.lessons.sort((a: Tables<'lessons'>, b: Tables<'lessons'>) => a.order_index - b.order_index)
        }
      })
    }

    return data ? (data.map((chapter: any) => chapter as ChapterWithLessons) || []) : []
  } catch (error) {
    console.error('Error in getChaptersByCourse:', error)
    return []
  }
}

// Create a new chapter
export async function createChapter(
  chapterData: TablesInsert<'chapters'>
): Promise<{ success: boolean; chapter?: Tables<'chapters'>; error?: string }> {
  try {
    const supabase = await createClient()

    // Validate required fields
    if (!chapterData.title || !chapterData.course_id || chapterData.order_index === undefined) {
      return { success: false, error: 'Title, course_id, and order_index are required' }
    }

    // Verify course exists
    const { data: courseExists } = await supabase
      .from('courses')
      .select('id')
      .eq('id', chapterData.course_id)
      .single()

    if (!courseExists) {
      return { success: false, error: 'Course not found' }
    }

    // Prepare chapter data
    const newChapter: TablesInsert<'chapters'> = {
      ...chapterData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_free: chapterData.is_free ?? false
    }

    const { data, error } = await supabase
      .from('chapters')
      .insert(newChapter)
      .select()
      .single()

    if (error) {
      console.error('Error creating chapter:', error)
      return { success: false, error: 'Failed to create chapter' }
    }

    revalidatePath(`/dashboard/course/${chapterData.course_id}`)
    revalidatePath(`/course/${chapterData.course_id}`)
    return { success: true, chapter: data }
  } catch (error) {
    console.error('Error in createChapter:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Update an existing chapter
export async function updateChapter(
  chapterId: string,
  chapterData: Partial<TablesUpdate<'chapters'>>
): Promise<{ success: boolean; chapter?: Tables<'chapters'>; error?: string }> {
  try {
    const supabase = await createClient()

    // Check if chapter exists
    const { data: existingChapter } = await supabase
      .from('chapters')
      .select('course_id')
      .eq('id', chapterId)
      .single()

    if (!existingChapter) {
      return { success: false, error: 'Chapter not found' }
    }

    // Prepare update data
    const updateData: TablesUpdate<'chapters'> = {
      ...chapterData,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('chapters')
      .update(updateData)
      .eq('id', chapterId)
      .select()
      .single()

    if (error) {
      console.error('Error updating chapter:', error)
      return { success: false, error: 'Failed to update chapter' }
    }

    revalidatePath(`/dashboard/course/${existingChapter.course_id}`)
    revalidatePath(`/course/${existingChapter.course_id}`)
    return { success: true, chapter: data }
  } catch (error) {
    console.error('Error in updateChapter:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Delete a chapter
export async function deleteChapter(chapterId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Get chapter and course info
    const { data: chapter } = await supabase
      .from('chapters')
      .select('course_id')
      .eq('id', chapterId)
      .single()

    if (!chapter) {
      return { success: false, error: 'Chapter not found' }
    }

    // Delete associated lessons first (cascade should handle this, but explicit is safer)
    await supabase
      .from('lessons')
      .delete()
      .eq('chapter_id', chapterId)

    // Delete the chapter
    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', chapterId)

    if (error) {
      console.error('Error deleting chapter:', error)
      return { success: false, error: 'Failed to delete chapter' }
    }

    revalidatePath(`/dashboard/course/${chapter.course_id}`)
    revalidatePath(`/course/${chapter.course_id}`)
    return { success: true }
  } catch (error) {
    console.error('Error in deleteChapter:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Reorder chapters
export async function reorderChapters(
  courseId: string,
  chapterOrders: { id: string; order_index: number }[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Update each chapter's order_index
    const updates = chapterOrders.map(({ id, order_index }) =>
      supabase
        .from('chapters')
        .update({ order_index, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('course_id', courseId)
    )

    const results = await Promise.all(updates)
    const hasError = results.some(({ error }) => error)

    if (hasError) {
      console.error('Error reordering chapters')
      return { success: false, error: 'Failed to reorder chapters' }
    }

    revalidatePath(`/dashboard/course/${courseId}`)
    revalidatePath(`/course/${courseId}`)
    return { success: true }
  } catch (error) {
    console.error('Error in reorderChapters:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Duplicate chapter
export async function duplicateChapter(
  chapterId: string,
  includeLessons: boolean = true
): Promise<{ success: boolean; chapter?: Tables<'chapters'>; error?: string }> {
  try {
    const supabase = await createClient()

    // Get the original chapter
    const { data: originalChapter, error: fetchError } = await supabase
      .from('chapters')
      .select(includeLessons ? `*, lessons (*)` : '*')
      .eq('id', chapterId)
      .single()

    if (fetchError || !originalChapter) {
      return { success: false, error: 'Chapter not found' }
    }

    // Get the highest order_index for the course
    const { data: chapters } = await supabase
      .from('chapters')
      .select('order_index')
      //.eq('course_id', originalChapter.course_id)
      .order('order_index', { ascending: false })
      .limit(1)

    const newOrderIndex = (chapters?.[0]?.order_index ?? 0) + 1

    // Create new chapter
    const { id, created_at, updated_at, lessons, ...chapterToCopy } = originalChapter as any
    const newChapterData: TablesInsert<'chapters'> = {
      ...chapterToCopy,
      //title: `${originalChapter.title} (Copy)`,
      order_index: newOrderIndex
    }

    const { data: newChapter, error: createError } = await supabase
      .from('chapters')
      .insert(newChapterData)
      .select()
      .single()

    if (createError || !newChapter) {
      return { success: false, error: 'Failed to duplicate chapter' }
    }

    // Duplicate lessons if requested
    if (includeLessons && lessons && lessons.length > 0) {
      const lessonsToCopy = lessons.map((lesson: any) => {
        const { id, created_at, updated_at, ...lessonData } = lesson
        return {
          ...lessonData,
          chapter_id: newChapter.id
        }
      })

      await supabase.from('lessons').insert(lessonsToCopy)
    }

    //revalidatePath(`/dashboard/course/${originalChapter.course_id}`)
    //revalidatePath(`/course/${originalChapter.course_id}`)
    return { success: true, chapter: newChapter }
  } catch (error) {
    console.error('Error in duplicateChapter:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Bulk operations
export async function bulkUpdateChapters(
  chapterIds: string[],
  updateData: Partial<TablesUpdate<'chapters'>>
): Promise<{ success: boolean; updatedCount: number; error?: string }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('chapters')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .in('id', chapterIds)
      .select('id, course_id')

    if (error) {
      console.error('Error bulk updating chapters:', error)
      return { success: false, updatedCount: 0, error: 'Failed to bulk update chapters' }
    }

    // Revalidate affected courses
    const courseIds = [...new Set(data?.map(c => c.course_id) || [])]
    courseIds.forEach(courseId => {
      revalidatePath(`/dashboard/course/${courseId}`)
      revalidatePath(`/course/${courseId}`)
    })

    return { success: true, updatedCount: data?.length || 0 }
  } catch (error) {
    console.error('Error in bulkUpdateChapters:', error)
    return { success: false, updatedCount: 0, error: 'An unexpected error occurred' }
  }
}

export async function bulkDeleteChapters(
  chapterIds: string[]
): Promise<{ success: boolean; deletedCount: number; error?: string }> {
  try {
    const supabase = await createClient()

    // Get course IDs for revalidation
    const { data: chapters } = await supabase
      .from('chapters')
      .select('course_id')
      .in('id', chapterIds)

    const courseIds = [...new Set(chapters?.map(c => c.course_id) || [])]

    // Delete lessons first
    await supabase
      .from('lessons')
      .delete()
      .in('chapter_id', chapterIds)

    // Delete chapters
    const { data, error } = await supabase
      .from('chapters')
      .delete()
      .in('id', chapterIds)
      .select('id')

    if (error) {
      console.error('Error bulk deleting chapters:', error)
      return { success: false, deletedCount: 0, error: 'Failed to bulk delete chapters' }
    }

    // Revalidate affected courses
    courseIds.forEach(courseId => {
      revalidatePath(`/dashboard/course/${courseId}`)
      revalidatePath(`/course/${courseId}`)
    })

    return { success: true, deletedCount: data?.length || 0 }
  } catch (error) {
    console.error('Error in bulkDeleteChapters:', error)
    return { success: false, deletedCount: 0, error: 'An unexpected error occurred' }
  }
}

// Chapter statistics
export async function getChapterStats(courseId: string): Promise<{
  total: number
  totalLessons: number
  freeChapters: number
  averageLessonsPerChapter: number
}> {
  try {
    const supabase = await createClient()

    // Get total chapters
    const { count: total } = await supabase
      .from('chapters')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId)

    // Get free chapters
    const { count: freeChapters } = await supabase
      .from('chapters')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId)
      .eq('is_free', true)

    // Get chapters with lessons to count total lessons
    const { data: chapters } = await supabase
      .from('chapters')
      .select(`
        id,
        lessons (id)
      `)
      .eq('course_id', courseId)

    const totalLessons = chapters?.reduce((sum, chapter: any) => 
      sum + (chapter.lessons?.length || 0), 0
    ) || 0

    const averageLessonsPerChapter = total ? totalLessons / total : 0

    return {
      total: total || 0,
      totalLessons,
      freeChapters: freeChapters || 0,
      averageLessonsPerChapter: Math.round(averageLessonsPerChapter * 100) / 100
    }
  } catch (error) {
    console.error('Error in getChapterStats:', error)
    throw error
  }
}

// Search chapters
export async function searchChapters(
  searchTerm: string,
  courseId?: string,
  options: Omit<ChapterQueryOptions, 'filters'> = {}
): Promise<ChapterListResponse> {
  const searchFilters: ChapterFilters = {
    search: searchTerm,
    ...(courseId && { course_id: courseId })
  }

  return getChapters({
    ...options,
    filters: searchFilters
  })
}