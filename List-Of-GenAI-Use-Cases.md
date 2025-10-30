# List of GenAI Use cases

Prompt Engineering => Retrival Augmented Generation => Fine-Tuning

**Bookworm**: A user is able to discuss the book with this application (Bookworm). 
Ask the application to read (audio) the book or selected parts of the book. 
Bookworm enjoys engaging with a user for a selected book, characters, events, story line. Bookworm could recommend other books based on conversation with a user. 
Of course, Bookworm can utilize audio or text to carry out these conversations. 
Along the same trend of thought, Bookworm-like applications could be an interface to newspapers’ or magazines’ content. 

**PM-Assistant**: When we are operating software systems (that we developed), 
an on-call becomes the responsibility of the same software team. 
The team will receive asks in the form of JIRA issues from patrons. 
Every sprint planning meeting, based on available capacity, importance, urgency, and confidence, 
a team needs to decide which JIRA issues to work on the coming sprint. 
It helps to have a summary view to guide decision making. 
A PM-Assistant could help to summarize what the top-10 pain points from JIRA issues (closed ones in the last 3 sprints and waiting in backlog) 
by considering the importance, needs by date, and other criteria available in JIRA Issue fields. 
The PM-Assistant could also help us to categorize and decide the priority of the next set of development items based on ROI calculated from existing JIRA issues 
and availability of members. Humans are the decision makers while 
LLM handles undifferentiated heavy lifting by gathering and summarizing JIRA issues of our team every day. 
This solution enables real-time data-driven informed decision making.   

**Onboarding-Companion**: Onboarding new members to a software engineering team happens multiple times in a year. 
We assign a buddy to accelerate the onboarding process while investing in training materials. 
In this use case, a new engineering team member could interact with a corpus of architecture documents, 
software design document, software requirements documents, product requirements documents,  
test documents, ADR (architecture design records), 
JIRA tickets, relevant CVEs, CICD scripts, monitoring scripts, 
runbooks, RCA/CoE documents, and source code via Onboarding-Companion. 
This application could prepare quizzes to test retention of knowledge about the runbooks or modules in the software system. 
Onboarding-Companion could create mock JIRA tickets and assess new member’s solutions.
Onboarding-Companion could create mock on-call scenarios to evaluate new member’s performance. 
These solutions could help us to improve how we onboard new members today by 
training on available materials, asking questions to team members, 
shadowing (by observing experienced members in action), 
reverse-shadowing (by receiving feedback from experienced members), 
and finally being ready to drive by themselves. 
Onboarding-Companion could support on-call as a knowledgeable on-call assistant.

**Study-Buddy**: Students prepare for assessments, for the classes they are taking, to demonstrate their mastery. 
Generally assessments given in the prior years are available. 
These prior assessments, student class notes, teacher’s class notes, and teacher’s recordings can build a topic specific document base (corpus) for a study-buddy. 
An LLM can help students to master the topic by interacting conversationally,  
engaging in Q&A, giving assessments and identifying improvements, 
and personalizing learning experience for the student. 
If the operating costs are reasonable, a Study-Buddy could generate short videos (for instance, using Sora 2) to explain material/concepts, 
enact experiments/events, or find a segment of existing multimedia. 
A Study-Buddy could take an animated character form (via video generators) for engaging user experience. 
A Study-Buddy could tune into the student’s learning styles (visual learner, auditory learner (by listening), read/write learners, kinesthetic learners (by doing)) 
for this class. 

**Course-Selection-Assistant**: High school students start to face the course selection process (preparation for next level of education). 
The high school policy manual(Student Handbook) explains all the rules about the graduation such as mandatory courses/tracks, number of credits, mandatory exams. 
The school courses document (program of studies) explains the available courses and dependencies between these courses if any. 
Each student needs to select and submit their course selection before the published deadline by considering the current policies, 
current available courses, graduation requirements and courses completed. 
An application can ingest the policy and courses document to answer questions on these. 
A Course-Selection-Assistant will need a way to figure out which courses a particular student has completed so far. 
A ‘tool’ mechanism allows LLM to ask for further information. 
For instance, a Course-Selection-Assistant could ask for list of completed courses 
and invoke a tool that can retrieve a list of completed courses for this student. 
Then the Course-Selection-Assistant could assess completed courses, earned credits, etc. 
with respect to the policy, available courses, and course schedules to recommend course-selection alternatives. 
After the Course-Selection-Assistant has enough information about the student, 
it could engage in what-if scenario analysis based on available paths.  

**Benefits-Selection-Assistant**: Employees select and register for benefits annually. 
Employees need to decide on many items with a plethora of options. 
For instance, for health benefits, an employee needs to find out which family members are eligible (federal and state laws/regulations), 
find out which plans are probably better based on recent health history and offered plan coverages, 
find out FSA or HSA and contribution amount, etc. For instance, for retirement investment, an employee needs to find out contribution limits, 
find out which investment vehicle is available and hopefully better suited (IRA, Roth IRA, Gold IRA, 401K, etc.), 
tax considerations, prior tax filings, prior tax exceptions/incentives, etc. 
There are interdependencies between these choices in addition to constraints federal and state laws and regulations define. 
Every employee needs to solve their constrained multi-objective optimization problem every year during the registration window. 
A Benefits-Selection-Assistant could be a powerful companion for each individual during this process. 
Applicable federal and state laws and regulations (such as tax), available benefits and their coverage, etc. 
go into the base corpus. Benefits-Selection-Assistant can do Q&A based on base documents. Benefits-Selection-Assistant will need to collect specific data from an individual or 
systems individual granted read access to so that  Benefits-Selection-Assistant could present feasible selections and 
converse about these selections and reasoning with citations. 
Employees will be able to make informed decisions while being aware of a large body of documents. 

**Vocabulary-Buddy**: A learner could give documents (reading assignment) to master the new words in these documents. 
Vocabulary-Buddy utilizes this corpus to generate assessments (quizzes) by leveraging LLM. 
Vocabulary-Buddy persists each learner’s prior assignments and assessments so that it can give better context to LLM. 
For instance, LLM may ask the list of words a learner answered correctly with probability of >75%, 25%<75%, and <25% (quiz generation policy) so that a generated quiz contains questions with different difficult levels for the learner. 
Vocabulary-Buddy could fine-tune the policy (RL) based on the learner’s feedback so that it can establish a sustained user engagement. 

**Teller-Agent**: ATMs have been deployed, but LLMs have potential to push these to the next level by its multimodal interaction capabilities. 
An application can fulfill the current functionalities as well as offer personalized products to patrons by combining individual information (via tools) with available products (via vector store) and asking LLM to generate product recommendations. 

From [8 ways agentic AI will transform IT operations](https://www.cio.com/article/4079008/8-ways-agentic-ai-will-transform-it-operations.html)
- Note: Most business workloads have workflows in certain state. Restarting without considering the state of application layer may create data corruption problems and more surgical work to clean-up.
- Use-Case: the AI agent might detect a database service that’s becoming unresponsive, correlate all related signals, and then recommend restarting the service rather than rebooting the entire server.
- Use-Case: Picture an AI that spots a memory leak, spins up a replacement server, redirects workloads, and patches the faulty node before anyone even knows there’s an issue.
- Use-Case: <font color="orange">Monitor server certificates then schedule to configure with new certificate based on the schedule patch and release events.</font> 
- Use-Case: <font color="orange">Monitor disk space usage, remediate before the dependent workloads experiences the lack of disk space error.</font>

From [Top 7-agentic AI use cases for cybersecurity](https://www.csoonline.com/article/4079887/top-7-agentic-ai-use-cases-for-cybersecurity.html)
- Use-Case: In the context of infrastructure, agents may also be able to speed-up the process of performing root cause analysis by parsing system logs more quickly, correlating results across data sources, and giving human engineers a major head start on their investigation by **summarizing with citations to relevant sources on the timeline of events**.
- Use-Case: Imagine an AI agent that autonomously collects indicators of compromise [IOCs] from multiple threat feeds, correlates them with internal telemetry, enriches the data with context from OSINT and CTI [cyber threat intelligence] repositories, and then **drafts** a structured alert for an analyst.
- Use-Case: Every end user has a unique profile, reflecting specific behaviors, privileges, and risk scores. Agents can monitor those users and, if there’s a deviation, can push changes to what that user can access, force a re-authentication, or even temporarily sandbox that user (honeypot)
- Use-Case: Agentic AI can operate as a real-time, autonomous cyber defense agent by spotting and disrupting intrusion attempts autonomously in real-time.
- Use-Case: Scammers run Facebook or Instagram ads that impersonate your brand, and an AI agent can alert you immediately so you can have them taken down before too many customers click.
- Use-Case: An AI agent can scan for new domain registrations that appear similar to your company, grab screenshots, perform WHOIS checks, and even draft takedown requests.

