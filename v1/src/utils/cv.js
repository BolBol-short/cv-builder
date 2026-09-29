export function makeId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// string arrays (skills, hobbies, links)
export function addString(list, raw){
    const value = raw.trim()
    if(!value) return list
    if(list.includes(value)) return list
    return[...list, value]
}

export function removeString(list, value){
    return list.filter((item) => item!==value)
}

// object arrays (experience, education, references, languages, certifications)
export function addItem(list, item){
    return[...list, item]
}

export function removeItem(list, id){
    return list.filter((item) => item.id !== id)
}

export function updateItem(list, id, field, value){
    return list.map((item) => (item.id === id ? {...item, [field]: value} : item))
}

// dir: -1 = up, +1 = down. Out-of-range moves return the list unchanged.
export function moveItem(list, id, dir){
    const from = list.findIndex((item) => item.id === id)
    const to = from + dir
    if(from < 0 || to < 0 || to >= list.length) return list
    const next = [...list]
    ;[next[from], next[to]] = [next[to], next[from]]
    return next
}

// factories, empty row of object type
export const newExperience = () => ({
    id: makeId(), jobTitle: "", company: "", description: "", location: "", startDate: "", endDate: "", current: false,
})

export const newReference = () => ({
    id: makeId(), personName: "", position: "", companyName: "", link: "",
})

export const newEducation = () => ({
    id: makeId(), institution: "", degree: "", gpa: "", location: "", startDate: "", endDate: "", current: false,
})

export const newLanguage = () => ({
    id: makeId(), language: "", level: ""
})

export const newCertification = () => ({
    id: makeId(), name: "", issuer: "", date: "",
})

// Rough "how finished is this CV" score for the progress bar (0–100).
export function completeness(cv){
    const p = cv.personal
    const checks = [
        p.name, p.headline, p.photo, p.email, p.tel, p.location,
        cv.summary,
        cv.experience.length, cv.education.length, cv.skills.length,
        p.languages.length, cv.references.length,
    ]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}
