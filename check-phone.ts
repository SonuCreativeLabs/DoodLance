// Quick debug script to check if phone is in database
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function checkPhone() {
    const { data, error } = await supabase
        .from('users')
        .select('id, email, name, phone, location, createdAt')
        .eq('email', 'sonucreativelabs@gmail.com')
        .single()

    console.log('User data:', data)
    console.log('Error:', error)
}

checkPhone()
