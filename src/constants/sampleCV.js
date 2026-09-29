import { makeId } from "../utils/cv";

// Example CVs for "Load example" — one per CV language. Fresh ids each call.
export function sampleCV(lang) {
  return lang === "km" ? sampleKm() : sampleEn();
}

function sampleEn() {
  return {
    personal: {
      photo: "",
      name: "Sok Dara",
      headline: "Accountant",
      gender: "male",
      dob: "1998-04-14",
      pob: "Phnom Penh",
      tel: "012 345 678",
      email: "sok.dara@example.com",
      location: "Sen Sok, Phnom Penh",
      nationality: "Cambodian",
      maritalStatus: "single",
      hobbies: ["Reading", "Football", "Travelling"],
      links: ["linkedin.com/in/sokdara"],
      languages: [
        { id: makeId(), language: "Khmer", level: "native" },
        { id: makeId(), language: "English", level: "fluent" },
        { id: makeId(), language: "Chinese", level: "basic" },
      ],
    },
    summary:
      "Detail-oriented accountant with 3 years of experience in bookkeeping, tax filing and financial reporting. Looking for a position where I can grow and support a strong finance team.",
    experience: [
      {
        id: makeId(), jobTitle: "Accountant", company: "ABC Trading Co., Ltd.",
        location: "Phnom Penh", startDate: "2023-01", endDate: "", current: true,
        description: "Prepare monthly financial reports\nFile monthly and annual tax returns with GDT\nReconcile bank accounts and petty cash",
      },
      {
        id: makeId(), jobTitle: "Junior Accountant", company: "Mekong Services",
        location: "Phnom Penh", startDate: "2021-06", endDate: "2022-12", current: false,
        description: "Recorded daily transactions in QuickBooks\nPrepared invoices and payment vouchers",
      },
    ],
    education: [
      {
        id: makeId(), institution: "National University of Management", degree: "Bachelor of Accounting",
        gpa: "3.5", location: "Phnom Penh", startDate: "2016-10", endDate: "2020-09", current: false,
      },
    ],
    certifications: [
      { id: makeId(), name: "QuickBooks Certification", issuer: "Intuit", date: "2022-03" },
    ],
    skills: ["Microsoft Excel", "QuickBooks", "Tax Filing", "Financial Reporting", "Teamwork"],
    references: [
      {
        id: makeId(), personName: "Chan Sophea", position: "Finance Manager",
        companyName: "ABC Trading Co., Ltd.", link: "011 222 333",
      },
    ],
  };
}

function sampleKm() {
  return {
    personal: {
      photo: "",
      name: "សុខ ដារា",
      headline: "គណនេយ្យករ",
      gender: "male",
      dob: "1998-04-14",
      pob: "រាជធានីភ្នំពេញ",
      tel: "012 345 678",
      email: "sok.dara@example.com",
      location: "ខណ្ឌសែនសុខ រាជធានីភ្នំពេញ",
      nationality: "ខ្មែរ",
      maritalStatus: "single",
      hobbies: ["អានសៀវភៅ", "បាល់ទាត់", "ធ្វើដំណើរកម្សាន្ត"],
      links: [],
      languages: [
        { id: makeId(), language: "ខ្មែរ", level: "native" },
        { id: makeId(), language: "អង់គ្លេស", level: "fluent" },
        { id: makeId(), language: "ចិន", level: "basic" },
      ],
    },
    summary:
      "គណនេយ្យករដែលមានបទពិសោធន៍ ៣ ឆ្នាំ ក្នុងការកត់ត្រាបញ្ជីគណនេយ្យ ការប្រកាសពន្ធ និងការរៀបចំរបាយការណ៍ហិរញ្ញវត្ថុ។ ចង់បានការងារដែលអាចអភិវឌ្ឍខ្លួន និងចូលរួមគាំទ្រក្រុមហិរញ្ញវត្ថុ។",
    experience: [
      {
        id: makeId(), jobTitle: "គណនេយ្យករ", company: "ក្រុមហ៊ុន ABC Trading",
        location: "ភ្នំពេញ", startDate: "2023-01", endDate: "", current: true,
        description: "រៀបចំរបាយការណ៍ហិរញ្ញវត្ថុប្រចាំខែ\nប្រកាសពន្ធប្រចាំខែ និងប្រចាំឆ្នាំ\nផ្ទៀងផ្ទាត់គណនីធនាគារ និងសាច់ប្រាក់",
      },
      {
        id: makeId(), jobTitle: "ជំនួយការគណនេយ្យ", company: "ក្រុមហ៊ុន Mekong Services",
        location: "ភ្នំពេញ", startDate: "2021-06", endDate: "2022-12", current: false,
        description: "កត់ត្រាប្រតិបត្តិការប្រចាំថ្ងៃក្នុង QuickBooks\nរៀបចំវិក្កយបត្រ និងប័ណ្ណទូទាត់",
      },
    ],
    education: [
      {
        id: makeId(), institution: "សាកលវិទ្យាល័យជាតិគ្រប់គ្រង", degree: "បរិញ្ញាបត្រគណនេយ្យ",
        gpa: "3.5", location: "ភ្នំពេញ", startDate: "2016-10", endDate: "2020-09", current: false,
      },
    ],
    certifications: [
      { id: makeId(), name: "វិញ្ញាបនបត្រ QuickBooks", issuer: "Intuit", date: "2022-03" },
    ],
    skills: ["Microsoft Excel", "QuickBooks", "ការប្រកាសពន្ធ", "របាយការណ៍ហិរញ្ញវត្ថុ", "ការងារជាក្រុម"],
    references: [
      {
        id: makeId(), personName: "ចាន់ សោភា", position: "ប្រធានផ្នែកហិរញ្ញវត្ថុ",
        companyName: "ក្រុមហ៊ុន ABC Trading", link: "011 222 333",
      },
    ],
  };
}
