
// This file contains the text extracted from the provided PDF documents.

const MHYPERTENSION_HANDBOOK = `
BE HE@LTHY BE MOBILE
A handbook on how to implement mHypertension

Contents:
1. Operations management (Page 14)
2. Content development and adaptation (Page 24)
3. Promotion and recruitment (Page 34)
4. Technology specifications (Page 36)
5. Monitoring and evaluation (Page 42)

==Start of OCR for page 4==
Executive Summary
WHO and the International Telecommunication Union (ITU) have formed a partnership to use mobile technology to help combat noncommunicable diseases...
The handbook provides guidance for developing and implementing an mHealth programme to support people with hypertension...
==End of OCR for page 4==

==Start of OCR for page 5==
Background
Hypertension, or blood pressure equal to or greater than 140/90 mmHg is the leading risk factor for premature mortality globally...
The HEARTS technical package includes recommendations to countries for preventing and managing hypertension...
==End of OCR for page 5==

==Start of OCR for page 6==
What is an mHypertension programme?
The goal of the mHypertension programme is to help people with hypertension to improve their blood pressure control through healthy behaviours and self-management...
Messages focus on: adherence to medication, healthy diet (low salt), physical activity, stopping smoking, limiting alcohol...
==End of OCR for page 6==

==Start of OCR for page 16==
TABLE 5. CONTENT OF mHYPERTENSION PROGRAMME
Modules:
1. Adherence: "Take your blood pressure medications exactly as prescribed."
2. Monitoring/screening: "Have your blood pressure checked at every visit."
3. Healthy eating: "Eat less than 1 level teaspoon (5g) of salt per day."
4. Physical activity: "Increase to 150 minutes of moderate physical activity per week."
5. Tobacco cessation.
6. Harmful use of alcohol.
==End of OCR for page 16==

==Start of OCR for page 26==
Design the framework of the programme:
- Duration: at least six months.
- Frequency: Start high dose (daily), then taper.
- Directionality: Encourage two-way messaging if feasible.
==End of OCR for page 26==

==Start of OCR for page 30==
Example Messages (Annex 4):
- "Hello [name], welcome to mHypertension!"
- "You can control your blood pressure by using less salt in your food."
- "Walk to work, walk to the shops... It all adds up."
==End of OCR for page 30==
`;

const PHARMACOLOGICAL_GUIDELINE = `
Guideline for the pharmacological treatment of hypertension in adults
World Health Organization 2021

==Start of OCR for page 9==
Executive summary
1. RECOMMENDATION ON BLOOD PRESSURE THRESHOLD FOR INITIATION OF PHARMACOLOGICAL TREATMENT
WHO recommends initiation of pharmacological antihypertensive treatment of individuals with a confirmed diagnosis of hypertension and systolic blood pressure of ≥140 mmHg or diastolic blood pressure of ≥90 mmHg. (Strong recommendation)
WHO recommends pharmacological antihypertensive treatment of individuals with existing cardiovascular disease and systolic blood pressure of 130–139 mmHg. (Strong recommendation)
==End of OCR for page 9==

==Start of OCR for page 10==
2. RECOMMENDATION ON LABORATORY TESTING
WHO suggests obtaining tests to screen for comorbidities and secondary hypertension, but only when testing does not delay or impede starting treatment.
3. RECOMMENDATION ON CARDIOVASCULAR DISEASE RISK ASSESSMENT
WHO suggests cardiovascular disease risk assessment at or after the initiation of pharmacological treatment, but only where feasible and does not delay treatment.
4. RECOMMENDATION ON DRUG CLASSES TO BE USED AS FIRST-LINE AGENTS
WHO recommends the use of drugs from any of the following three classes:
1. thiazide and thiazide-like agents
2. angiotensin-converting enzyme inhibitors (ACEis)/angiotensin-receptor blockers (ARBs)
3. long-acting dihydropyridine calcium channel blockers (CCBs).
==End of OCR for page 10==

==Start of OCR for page 11==
6. RECOMMENDATIONS ON TARGET BLOOD PRESSURE
WHO recommends a target blood pressure treatment goal of <140/90 mmHg in all patients with hypertension without comorbidities.
WHO recommends a target systolic blood pressure treatment goal of <130 mmHg in patients with hypertension and known cardiovascular disease (CVD).
7. RECOMMENDATIONS ON FREQUENCY OF ASSESSMENT
WHO suggests a monthly follow up after initiation or a change in medications until patients reach target.
WHO suggests a follow up every 3–6 months for patients whose blood pressure is under control.
==End of OCR for page 11==

==Start of OCR for page 19==
8. RECOMMENDATION ON TREATMENT BY NONPHYSICIAN PROFESSIONALS
WHO suggests that pharmacological treatment of hypertension can be provided by nonphysician professionals such as pharmacists and nurses, as long as conditions are met: proper training, prescribing authority, specific protocols, and physician oversight.
==End of OCR for page 19==

==Start of OCR for page 21==
4.1 Hypertension in disaster, humanitarian and emergency settings
There are currently no data regarding target BP... Opinion-based recommendation is target BP < 140/90. Long-acting CCBs are preferred because they are metabolically neutral and reduce BP variability.
==End of OCR for page 21==

==Start of OCR for page 22==
4.2 COVID-19 and hypertension
Most professional societies recommend continuing ACEis/ARBs in COVID-19 infected patients.
4.3 Pregnancy and hypertension
Preferred medications include methyldopa, beta-blockers (labetalol), and CCBs (nifedipine). ACEis, ARBs, and renin inhibitors are CONTRAINDICATED.
==End of OCR for page 22==
`;

export const DOCUMENTS_CONTEXT = `
You have access to the following two specific reference documents. You must use these documents as your primary source of truth.

=== DOCUMENT 1: mHypertension Handbook ===
${MHYPERTENSION_HANDBOOK}

=== DOCUMENT 2: WHO Guideline for the pharmacological treatment of hypertension in adults ===
${PHARMACOLOGICAL_GUIDELINE}
`;
