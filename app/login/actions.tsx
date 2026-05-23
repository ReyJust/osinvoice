'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signInOrUpWithEmail(formData: FormData) {
    const email = formData.get('email') as string
    const name = formData.get('name') as string
    const surname = formData.get('surname') as string


    const supabase = createClient(await cookies())

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            data: {
                // email,
                name,
                surname
            },
            shouldCreateUser: true,
            emailRedirectTo: 'http://localhost:3000/auth/callback',
        },
    })

    if (error) {
        throw new Error(error.message)
    }

    // Optional: redirect immediately
    redirect('/check-email')
}