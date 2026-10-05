const RULES: Array<[string, RegExp]> = [
  ["Nursing", /\b(nurse|nursing|rn\b|registered nurse|lpn|lvn|nurse practitioner)\b/i],
  ["Cybersecurity", /\b(cyber|security engineer|security analyst|information security|infosec|soc analyst|penetration|threat)\b/i],
  ["AI & Machine Learning", /\b(ai|artificial intelligence|machine learning|ml engineer|deep learning|nlp|computer vision|llm|generative ai)\b/i],
  ["Data Science & Analytics", /\b(data scientist|data analyst|analytics|business intelligence|bi analyst|statistician|data engineer)\b/i],
  ["Engineering", /\b(mechanical engineer|civil engineer|electrical engineer|chemical engineer|industrial engineer|structural engineer|manufacturing engineer|aerospace engineer|systems engineer|engineering manager|engineer|engineering)\b/i],
  ["IT & Software", /\b(software|developer|devops|sre|frontend|backend|full stack|fullstack|qa engineer|test engineer|cloud engineer|platform engineer|technical support|programmer)\b/i],
  ["Healthcare & Medical", /\b(doctor|physician|medical|healthcare|clinical|therapist|medical assistant|medical technologist)\b/i],
  ["Pharmaceutical & Biotech", /\b(pharma|pharmaceutical|biotech|biotechnology|clinical research|drug development|laboratory)\b/i],
  ["Education & Teaching", /\b(teacher|teaching|professor|faculty|instructor|tutor|education|school)\b/i],
  ["Legal", /\b(attorney|lawyer|legal counsel|paralegal|legal)\b/i],
  ["Finance & Accounting", /\b(accountant|accounting|financial analyst|finance|fp&a|controller|auditor|bookkeeper)\b/i],
  ["Banking & Insurance", /\b(bank|banking|insurance|underwriter|claims|actuary|mortgage)\b/i],
  ["Sales", /\b(sales|account executive|account manager|business development|sales development)\b/i],
  ["Marketing & Advertising", /\b(marketing|advertising|seo|sem|brand manager|content marketing|growth marketing)\b/i],
  ["Human Resources", /\b(human resources|hr manager|recruiter|recruiting|talent acquisition|people operations)\b/i],
  ["Management", /\b(manager|director|vice president|vp |chief |operations manager|program manager)\b/i],
  ["Administrative & Office", /\b(administrative|administrative assistant|executive assistant|office manager|receptionist|clerical)\b/i],
  ["Customer Service", /\b(customer service|customer support|call center|client support)\b/i],
  ["Retail", /\b(retail|store associate|store manager|cashier|merchandiser)\b/i],
  ["E-commerce", /\b(e-commerce|ecommerce|marketplace operations)\b/i],
  ["Construction", /\b(construction|superintendent|site manager|general contractor)\b/i],
  ["Architecture & Planning", /\b(architect|architecture|urban planning|planner|interior design)\b/i],
  ["Manufacturing", /\b(manufacturing|production|plant manager|assembly|fabrication)\b/i],
  ["Skilled Trades", /\b(electrician|plumber|welder|carpenter|hvac|machinist|mechanic|technician|maintenance technician)\b/i],
  ["Automotive", /\b(automotive|automobile|vehicle|auto technician|dealership)\b/i],
  ["Transportation & Logistics", /\b(logistics|transportation|driver|dispatcher|fleet|delivery|truck)\b/i],
  ["Warehouse & Supply Chain", /\b(warehouse|supply chain|inventory|procurement|fulfillment|distribution)\b/i],
  ["Aviation & Aerospace", /\b(aerospace|aviation|aircraft|airline|flight)\b/i],
  ["Maritime", /\b(maritime|marine|ship|vessel|port)\b/i],
  ["Hospitality & Hotels", /\b(hotel|hospitality|front desk|guest services|concierge)\b/i],
  ["Restaurant & Food Service", /\b(restaurant|barista|server|waiter|waitress|cook|chef|food service|dishwasher)\b/i],
  ["Cleaning & Maintenance", /\b(cleaner|janitor|custodian|housekeeper|maintenance worker)\b/i],
  ["Real Estate", /\b(real estate|property manager|leasing|realtor)\b/i],
  ["Government & Public Sector", /\b(government|public sector|federal|state government|municipal|civil service)\b/i],
  ["Security & Law Enforcement", /\b(security guard|police|law enforcement|corrections|detective|firefighter)\b/i],
  ["Science & Research", /\b(research scientist|scientist|research associate|laboratory scientist)\b/i],
  ["Energy & Utilities", /\b(energy|utility|utilities|solar|wind energy|oil and gas|power plant)\b/i],
  ["Agriculture & Farming", /\b(agriculture|farmer|farming|agronomy|farm worker)\b/i],
  ["Environmental & Sustainability", /\b(environmental|sustainability|climate|conservation|renewable)\b/i],
  ["Media & Journalism", /\b(journalist|journalism|editor|reporter|news|media)\b/i],
  ["Design & Creative", /\b(designer|graphic design|ux designer|ui designer|creative director|illustrator)\b/i],
  ["Entertainment", /\b(entertainment|producer|production assistant|actor|casting)\b/i],
  ["Sports & Fitness", /\b(coach|fitness|personal trainer|sports|athletics)\b/i],
  ["Beauty & Personal Care", /\b(beauty|cosmetologist|barber|hairstylist|esthetician)\b/i],
  ["Childcare & Social Services", /\b(childcare|social worker|case worker|social services|caregiver)\b/i],
  ["Animal Care", /\b(veterinary|vet tech|animal care|kennel)\b/i],
  ["Telecommunications", /\b(telecom|telecommunications|network technician|fiber|wireless)\b/i],
  ["Freelance & Contract", /\b(freelance|freelancer|contractor|contract role)\b/i]
];

export function inferCategory(...values: string[]) {
  const text = values.filter(Boolean).join(" ");
  for (const [category, rule] of RULES) {
    if (rule.test(text)) return category;
  }
  return "Other Jobs";
}
