export const emptyCV ={
    personal:{
        photo: "",
        name: "",
        gender: "",
        dob: "",
        tel: "",
        email: "",
        location: "",
        nationality: "",
        maritalStatus: "",
        hobbies: [],
        links: [],
        languages: [
            /*
            {
                id,
                language,
                level,
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
            description,
            location,
            startDate,
            endDate
        }
        */
    ],
    skills: [],
    education: [
        /*
        {
            id,
            institution,
            gpa,
            location,
            startDate,
            endDate,
        }
        */
    ],
    references: [
        /*
        {
            id,
            personName,
            companyName,
            link,
        }
        */
    ],
}