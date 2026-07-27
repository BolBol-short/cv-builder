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

// object arrays (experiencs, references, languages)
export function addItem(list, item){
    return[...list, item]
}

export function removeItem(list, id){
    return list.filter((item) => item.id !== id)
}

export function updateItem(list, id, field, value){
    return list.map((item) => (item.id === id ? {...item, [field]: value} : item))
}

// factories, empty row of object type
export const newExperience = () => ({
    id: makeId(), jobTitle: "", company: "", description: "", location: "", startDate: "", endDate: "",
})

export const newReference = () => ({
    id: makeId(), personName: "", companyName: "", link: "",
})

export const newEducation = () => ({
    id: makeId(), institution: "", gpa: "", location: "", startDate: "", endDate: "",
})

export const newLanguage = () => ({
    id: makeId(), language: "", level: ""
})