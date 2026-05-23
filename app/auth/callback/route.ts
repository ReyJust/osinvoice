import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
        return NextResponse.redirect(`${origin}/login`)
    }

    const supabase = createClient(await cookies())

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
        console.error(error)
        return NextResponse.redirect(`${origin}/login`)
    }

    // ✅ cookies are now set
    return NextResponse.redirect(`${origin}/invoice/new`)
}