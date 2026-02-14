import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateSlug } from '@/lib/auth'
import { cookies } from 'next/headers'

async function getUserId() {
  const cookieStore = await cookies()
  return cookieStore.get('user_id')?.value
}

// AI-powered content templates based on topic
const contentTemplates = {
  generateArticle: (topic: string, category: string) => {
    const templates = [
      {
        title: `Breaking: ${topic} - What You Need to Know`,
        content: `In recent developments, ${topic} has become a major talking point. Industry experts are closely monitoring the situation as it continues to evolve.

## Key Points

Recent analysis shows significant movement in this area. Stakeholders across various sectors are paying close attention to how this develops.

The implications could be far-reaching, affecting multiple aspects of the industry. Experts suggest that this trend is likely to continue in the coming weeks.

## What This Means

For those following this story, it's important to stay informed about the latest developments. The situation remains fluid, and new information continues to emerge.

## Looking Ahead

As the story develops, we'll continue to provide updates and analysis. Stay tuned for more information as it becomes available.`,
        excerpt: `Latest updates and analysis on ${topic}. Stay informed with our comprehensive coverage.`
      },
      {
        title: `${topic}: Complete Guide and Analysis`,
        content: `Understanding ${topic} has become increasingly important in today's fast-paced environment. This comprehensive guide breaks down everything you need to know.

## Overview

${topic} represents a significant development that's worth understanding in depth. Here's what you should know about this evolving situation.

## Expert Insights

Industry professionals have weighed in on ${topic}, offering valuable perspectives on its implications and potential outcomes.

## Impact Assessment

The effects of ${topic} are being felt across multiple sectors. Organizations are adapting their strategies to account for these changes.

## Conclusion

As ${topic} continues to develop, staying informed is crucial. We'll keep you updated with the latest news and analysis.`,
        excerpt: `Everything you need to know about ${topic} - expert analysis and insights.`
      },
      {
        title: `${topic} Update: Latest Developments and Trends`,
        content: `The landscape surrounding ${topic} is constantly evolving. Here's your latest update on the most important developments.

## Recent Changes

New information has emerged regarding ${topic}, shedding light on its current state and future trajectory.

## Market Response

The response to ${topic} has been significant, with various stakeholders adjusting their approaches accordingly.

## Future Outlook

Looking ahead, ${topic} is expected to remain a key focus area. Experts predict continued interest and development.

## Stay Connected

Follow our coverage for ongoing updates about ${topic} and related developments.`,
        excerpt: `Stay up to date with the latest on ${topic} - trends, analysis, and expert commentary.`
      }
    ]
    
    const template = templates[Math.floor(Math.random() * templates.length)]
    return {
      ...template,
      category: category || 'Technology',
      tags: `${topic},News,Analysis,Trending`
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get unpublished trending topics
    const { data: topics, error: topicsError } = await supabase
      .from('trending_topics')
      .select('*')
      .eq('is_published', false)
      .limit(5)

    if (topicsError || !topics || topics.length === 0) {
      return NextResponse.json({ 
        message: 'No unpublished topics found',
        published: 0 
      })
    }

    const publishedPosts = []

    // Create and publish posts for each topic
    for (const topic of topics) {
      const article = contentTemplates.generateArticle(
        topic.topic,
        'Technology' // You can make this dynamic based on topic analysis
      )

      const slug = generateSlug(article.title)

      // Create the post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          title: article.title,
          slug,
          content: article.content,
          excerpt: article.excerpt,
          category: article.category,
          tags: article.tags,
          status: 'published',
          author_id: userId,
          published_at: new Date().toISOString(),
          is_trending_post: true,
          views: 0
        })
        .select()
        .single()

      if (!postError && post) {
        // Mark topic as published
        await supabase
          .from('trending_topics')
          .update({ is_published: true })
          .eq('id', topic.id)

        publishedPosts.push(post)
      }
    }

    return NextResponse.json({
      message: `Successfully published ${publishedPosts.length} posts`,
      published: publishedPosts.length,
      posts: publishedPosts
    })
  } catch (error) {
    console.error('Auto-publish error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET endpoint to check status
export async function GET(request: NextRequest) {
  try {
    const { data: unpublishedTopics } = await supabase
      .from('trending_topics')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', false)

    const { data: recentPosts } = await supabase
      .from('posts')
      .select('*')
      .eq('is_trending_post', true)
      .order('created_at', { ascending: false })
      .limit(10)

    return NextResponse.json({
      unpublishedTopics: unpublishedTopics || 0,
      recentAutoPublished: recentPosts?.length || 0,
      posts: recentPosts || []
    })
  } catch (error) {
    console.error('Auto-publish status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
