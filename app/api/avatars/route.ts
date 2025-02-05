const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Predefined avatar data with all necessary information
const avatarData = [
    {
        avatar_id: 'Santa_Fireplace_Front_public',
        avatar_name: 'Santa',
        preview_image_url: '/images/avatars/preview_target1.webp',
        gender: 'male',
        is_public: true,
        status: 'active'
    },
    {
        avatar_id: 'Ann_Doctor_Standing2_public',
        avatar_name: 'Doctor Ann',
        preview_image_url: '/images/avatars/preview_target2.webp',
        gender: 'female',
        is_public: true,
        status: 'active'
    },
    {
        avatar_id: 'Ann_Doctor_Sitting_public',
        avatar_name: 'Doctor Ann Sitting',
        preview_image_url: '/images/avatars/preview_target3.webp',
        gender: 'female',
        is_public: true,
        status: 'active'
    },
    {
        avatar_id: 'Ann_Therapist_public',
        avatar_name: 'Therapist Ann',
        preview_image_url: '/images/avatars/preview_target4.webp',
        gender: 'female',
        is_public: true,
        status: 'active'
    },
    {
        avatar_id: 'Shawn_Therapist_public',
        avatar_name: 'Therapist Shawn',
        preview_image_url: '/images/avatars/preview_target5.webp',
        gender: 'male',
        is_public: true,
        status: 'active'
    },
    {
        avatar_id: 'Bryan_FitnessCoach_public',
        avatar_name: 'Coach Bryan',
        preview_image_url: '/images/avatars/preview_target6.webp',
        gender: 'male',
        is_public: true,
        status: 'active'
    },
    {
        "avatar_id": "Bryan_IT_Sitting_public",
        avatar_name: 'Bryan IT',
        preview_image_url: '/images/avatars/preview_target7.webp',
        gender: 'male',
        "is_public": true,
        "status": "ACTIVE"
    },
    {
        "avatar_id": "Dexter_Doctor_Standing2_public",
        avatar_name: 'Doctor Dexter',
        preview_image_url: '/images/avatars/preview_target8.webp',
        gender: 'male',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "Dexter_Doctor_Sitting2_public",
        avatar_name: 'Doctor Dexter Sitting',
        preview_image_url: '/images/avatars/preview_target9.webp',
        gender: 'male',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "Dexter_Lawyer_Sitting_public",
        avatar_name: 'Lawyer Dexter',
        preview_image_url: '/images/avatars/preview_target10.webp',
        gender: 'male',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "Elenora_IT_Sitting_public",
        avatar_name: 'Elenora IT',
        preview_image_url: '/images/avatars/preview_target11.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "Elenora_FitnessCoach2_public",
        avatar_name: 'Fitness Coach Elenora',
        preview_image_url: '/images/avatars/preview_target12.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "Elenora_FitnessCoach_public",
        avatar_name: 'Fitness Coach Elenora',
        preview_image_url: '/images/avatars/preview_target13.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "Judy_Doctor_Standing2_public",
        avatar_name: 'Doctor Judy',
        preview_image_url: '/images/avatars/preview_target14.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "Judy_Doctor_Sitting2_public",
        avatar_name: 'Doctor Judy Sitting',
        preview_image_url: '/images/avatars/preview_target15.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "Judy_Lawyer_Sitting2_public",
        avatar_name: 'Lawyer Judy',
        preview_image_url: '/images/avatars/preview_target16.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "Judy_Teacher_Standing_public",
        avatar_name: 'Teacher Judy',
        preview_image_url: '/images/avatars/preview_target17.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "Judy_Teacher_Sitting2_public",
        avatar_name: 'Teacher Judy Sitting',
        preview_image_url: '/images/avatars/preview_target18.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "Judy_Teacher_Sitting_public",
        avatar_name: 'Teacher Judy Sitting',
        preview_image_url: '/images/avatars/preview_target19.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "June_HR_public",
        avatar_name: 'HR June',
        preview_image_url: '/images/avatars/preview_target20.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "Silas_CustomerSupport_public",
        avatar_name: 'Customer Support Silas',
        preview_image_url: '/images/avatars/preview_target21.webp',
        gender: 'male',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "SilasHR_public",
        avatar_name: 'HR Silas',
        preview_image_url: '/images/avatars/preview_target22.webp',
        gender: 'male',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "Wayne_20240711",
        avatar_name: 'Wayne',
        preview_image_url: '/images/avatars/preview_target23.webp',
        gender: 'male',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "ef08039a41354ed5a20565db899373f3",
        avatar_name: 'Sofia in Office',
        preview_image_url: '/images/avatars/preview_target24.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "336b72634e644335ad40bd56462fc780",
        avatar_name: 'Sofia Outdoor',
        preview_image_url: '/images/avatars/preview_target25.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "37f4d912aa564663a1cf8d63acd0e1ab",
        avatar_name: 'Sofia in Office',
        preview_image_url: '/images/avatars/preview_target26.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "cc2984a6003a4d5194eb58a4ad570337",
        avatar_name: 'Raj Outdoor',
        preview_image_url: '/images/avatars/preview_target27.webp',
        gender: 'male',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "eb0a8cc8046f476da551a5559fbb5c82",
        avatar_name: 'Raj in Office',
        preview_image_url: '/images/avatars/preview_target28.webp',
        gender: 'male',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "fa7b34fe0b294f02b2fca6c1ed2c7158",
        avatar_name: 'Vicky Outdoor',
        preview_image_url: '/images/avatars/preview_target29.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "3c8a703d9d764938ae522b43401a59c2",
        avatar_name: 'Vicky',
        preview_image_url: '/images/avatars/preview_target30.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "73c84e2b886940099c5793b085150f2f",
        avatar_name: 'Angelino Outdoor',
        preview_image_url: '/images/avatars/preview_target31.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "c20f4bdddbe041ecba98d93444f8b29b",
        avatar_name: 'Angelino in office',
        preview_image_url: '/images/avatars/preview_target32.webp',
        gender: 'female',
        "is_public": true,
        "status": "active"
    },
    {
        "avatar_id": "43c34c4285cb4b6c81856713c70ba23b",
        avatar_name: 'Aiden',
        preview_image_url: '/images/avatars/preview_target33.webp',
        gender: 'male',
        "is_public": true,
        "status": "active"
    },
    // {
    //     "avatar_id": "2c57ba04ef4d4a5ca30a953d0791e7e3",
    //     "created_at": 1726185600,
    //     "is_public": true,
    //     "status": "ACTIVE"
    // }
];

export async function GET() {
    try {
        if (!HEYGEN_API_KEY) {
            return new Response(
                JSON.stringify({ error: "API key configuration error" }),
                { status: 401 }
            );
        }

        // Return predefined data immediately
        return new Response(
            JSON.stringify({
                data: {
                    avatars: avatarData
                }
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
                },
            }
        );

    } catch (error) {
        console.error("Error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch avatars" }),
            { status: 500 }
        );
    }
}