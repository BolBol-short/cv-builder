export const emptyCV ={
    personal:{
        photo: "",
        name: "",
        headline: "",
        gender: "",          // option code: female | male | other
        dob: "",             // YYYY-MM-DD
        pob: "",
        tel: "",
        email: "",
        location: "",
        nationality: "",
        maritalStatus: "",   // option code: single | married | divorced | widowed
        hobbies: [],
        links: [],
        languages: [
            /*
            {
                id,
                language,
                level,       // option code (native | fluent | …) or free text
            }
            */
        ],
    },
    summary: "",
    experience: [
        /*
        {
            id,
            jobTitle,
            company,
            description, // one bullet per line
            location,
            startDate,   // YYYY-MM
            endDate,
            current,     // bool — shows "Present" instead of endDate
        }
        */
    ],
    skills: [],
    education: [
        /*
        {
            id,
            institution,
            degree,
            gpa,
            location,
            startDate,
            endDate,
            current,
        }
        */
    ],
    certifications: [
        /*
        {
            id,
            name,
            issuer,
            date,
        }
        */
    ],
    references: [
        /*
        {
            id,
            personName,
            position,
            companyName,
            link,       // phone / email
        }
        */
    ],
}
