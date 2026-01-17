import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Link,
  VStack,
  Separator,
  Tabs,
} from "@chakra-ui/react";

export function About() {
  const [activeTab, setActiveTab] = useState("0");

  return (
    <Box maxW="6xl" mx="auto" p={8}>
      <Tabs.Root
        value={activeTab}
        onValueChange={(e) => setActiveTab(e.value)}
        variant="enclosed"
      >
        <Tabs.List mb={6}>
          <Tabs.Trigger value="0">Overview</Tabs.Trigger>
          <Tabs.Trigger value="1">Methodology</Tabs.Trigger>
          <Tabs.Trigger value="2">Glossary</Tabs.Trigger>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Content value="0">
          <VStack gap={6} align="start">
            <Heading as="h1" size="xl">
              About United States Political Stance Tracker
            </Heading>

            <Text fontSize="lg">
              <strong>United States Political Stance Tracker</strong> is a web
              platform designed to help you explore where U.S. Congress members
              stand on major political issues. By pulling voting records and
              using LLM-powered analysis, I aim to provide insight into
              legislators' political ideologies on specific political
              categories.
            </Text>

            <Separator />

            <Heading as="h2" size="lg">
              Platform Overview
            </Heading>
            <VStack align="start" gap={3}>
              <Text>
                • <strong>Track Voting Records:</strong> Organize roll call
                votes by member and calculate political ideology scores based on
                how legislators vote.
              </Text>
              <Text>
                • <strong>Analyze Bills with AI:</strong> Summarize bills,
                highlight partisan tendencies, and estimate potential impacts
                using LLMs.
              </Text>
              <Text>
                • <strong>Visualize Congress:</strong> Charts, histograms, and
                rankings show political trends across parties, issues, and
                chambers.
              </Text>
              <Text>
                • <strong>Explore Legislator Profiles:</strong> Dive deep into
                individual legislators to see their scores on major political
                topics and how they compare with peers.
              </Text>
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              How It Works
            </Heading>
            <VStack align="start" gap={3}>
              <Text>
                • <strong>Data Sources:</strong> Voting records from the U.S.
                House and Senate, from the 113th Congress to today.
              </Text>
              <Text>
                • <strong>AI-Powered Analysis:</strong> Large Language Models
                (LLMs) help summarize bills, categorize political issues, and
                generate insights.
              </Text>
              <Text>
                • <strong>Open Tools:</strong> Built with open-source software
                and frameworks for transparency and reproducibility.
              </Text>
              <Text fontSize="sm">
                Interested in the role of AI in politics? Check out{" "}
                <Link href="https://political-llm.org/" color="teal.400">
                  Political LLM Research 2024
                </Link>{" "}
                and a recent AI-driven analysis of Japanese parliamentary
                speeches{" "}
                <Link href="https://arxiv.org/pdf/2505.07118" color="teal.400">
                  KOKKAI DOC
                </Link>
                .
              </Text>
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              Current Features
            </Heading>
            <VStack align="start" gap={3}>
              <Text>
                • <strong>Legislators Page:</strong> Search, filter, and explore
                ideological scores of individual Congress members.
              </Text>
              <Text>
                • <strong>Congress Data Page:</strong> View histograms and
                charts summarizing political trends across parties, models, and
                chambers.
              </Text>
              <Text>
                • <strong>Bill Analyses Page:</strong> Examine AI-generated
                analyses of bills, including partisan and impact scores, and
                compare results across different AI models.
              </Text>
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              Future Plans
            </Heading>
            <Text fontSize="lg">
              I am actively improving the platform with UI enhancements, new
              features for deep political analysis, expanded datasets, and
              continuous improvements in AI-driven bill analysis. Feedback and
              contributions are welcome.
            </Text>

            <Separator />

            <Heading as="h2" size="lg">
              Acknowledgments
            </Heading>
            <Text fontSize="lg">
              Special thanks to the{" "}
              <Link
                href="https://github.com/unitedstates/congress"
                color="teal.400"
              >
                unitedstates/congress
              </Link>{" "}
              project for their scrapers and foundational data, which make this
              project possible.
            </Text>

            <Heading as="h2" size="lg">
              GitHub
            </Heading>
            <Text fontSize="lg">
              In order to promote transparency and community involvement, my
              entire codebase is open-source and available on GitHub. Explore
              the full source code, contribute, or report issues on GitHub:{" "}
              <Link
                href="https://github.com/Rohaansandhu/political-stance-tracker"
                color="teal.400"
              >
                Python Data Pipeline
              </Link>
              {" ,  "}
              <Link
                href="https://github.com/Rohaansandhu/political-stance-website"
                color="teal.400"
              >
                Website Code
              </Link>
            </Text>
          </VStack>
        </Tabs.Content>

        {/* Methodology Tab */}
        <Tabs.Content value="1">
          <VStack gap={6} align="start">
            <Heading as="h1" size="xl">
              Methodology
            </Heading>

            <Text fontSize="lg">
              This section explains how I calculate political stance scores and
              analyze legislative data.
            </Text>

            <Separator />

            <Heading as="h2" size="lg">
              Data Sources
            </Heading>
            <Text>
              Voting data is pulled from the bulkdata repository found on
              govinfo.org and processed using the unitedstates/congress
              scrapers. The dataset includes roll call votes, bill texts, and
              legislator information from the 113th Congress (2013-2014) to the
              present.
            </Text>
            <VStack align="start" gap={3} pl={4}>
              <Text>
                • <strong>Types of Bills Analyzed:</strong> For practicality,
                only bills that received roll call votes for passage were
                included. Also, only bills with the force of law were analyzed,
                meaning that some chamber resolutions were not included. In the
                future, there are plans to analyze a broader set of bills.
              </Text>
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              Bill Processing and LLM Analysis
            </Heading>
            <Text>
              After voting data is processed, I find which bills are associated
              with each roll call vote. Each bill is then analyzed using
              multiple Large Language Models (LLMs) to generate summaries,
              classify political categories, and estimate the partisan leaning
              of the bill.
            </Text>
            <VStack align="start" gap={3} pl={4}>
              <Text>
                • <strong>Library of Congress Summaries:</strong> The Library of
                Congress provides official bill summaries written by humans.
                These summaries are then fed into LLMs for further analysis.
                Legislative subjects are also often defined for each bill. These
                subjects can help LLMs pinpoint the exact political categories
                at play. The choice to use summaries and subjects, instead of
                the raw bill text, was to reduce the noise of a full bill, and
                to provide the model with a more concise description of the
                bill. Feeding an entire bill text into an LLM may result in
                worse outputs due to the limitations on input length and context
                in modern-day LLMs.
              </Text>
              {/**analyze_bill(summary_text, legislative_subjects, top_subject, MODEL) */}
              <Text>
                • <strong>Bill Data Provided:</strong> LLMs are fed the bill
                summary text, legislative subjects, and the top subject area to
                provide context for analysis.
              </Text>
              {/**Please provide:
                        1. Classify the bill into any relevant political categories and subcategories. 
                           Only use the categories/spectrums provided above. Do NOT create new ones.
                           Determine the impact on each relevant category using a scale from 0.0 to 1.0, where 1.0 is the most impactful.
                           Rate the bill on how conservative/progressive it is within each category. Use a scale of -1 to 1, where:
                            - -1 = fully aligned with the liberal_view
                            - 0 = neutral or mixed
                            - 1 = fully aligned with the conservative_view
                        3. If a category is **not relevant**, omit it from the output.
                        4. Analysis of what a YES vote represents politically
                        5. Analysis of what a NO vote represents politically  */}
              <Text>
                • <strong>Prompt:</strong> LLMs are asked to do the following:
                classify the bill into relevant political categories (and
                subcategories), rate each category's impact and ideological
                leaning, and analyze what a YES or NO vote represents
                politically. A scale from -1 (liberal) to 1 (conservative) is
                used to rate ideological alignment, and a scale from 0.0 to 1.0
                is used to rate impact. For full prompt details, please see the
                GitHub repository. If you're curious about the political
                category definitions used, please see the glossary.
              </Text>
              <Text>
                • <strong>Current LLMs in Use:</strong> Initially, the plan was
                to use free and open-source LLMs. The idea was that open source
                models could show full transparency. However, it became apparent
                that there may be gaps in reasoning between the open source and
                flagship commercial models. Therefore, the plan is to use as
                many models as possible to explore and eliminate all possible
                sources of bias. Currently, I am using gpt-oss-120b,
                gemini-2.5-flash-lite, llama3.3-70b, and qwen3-32b. These models
                were solely chosen because they were free to use. As the project
                advances, I plan to use more powerful, expensive models.
              </Text>
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              Calculating Legislator Ideology Scores
            </Heading>
            <Text>
              Legislator profiles are generated for each AI model used. All
              major political categories are given an ideology score when
              sufficient voting data exists (minimum 10 bills per category).
            </Text>
            <VStack align="start" gap={3} pl={4}>
              <Text>
                • <strong>Weighted Score Calculation:</strong> For each vote, I
                multiply the bill's partisan score x impact score x vote
                direction (1 for Yea, -1 for Nay) to create a weighted score
                that captures both the political leaning and significance of the
                legislator's position. If a legislator does not vote, they do
                not receive a score for that bill.
              </Text>
              <Text>
                • <strong>Category Aggregation:</strong> Bills are classified
                into primary categories and subcategories by the AI model. For
                each category, I average all weighted scores from the
                legislator's votes to produce their ideology score, ranging from
                -1 (most liberal) to +1 (most conservative).
              </Text>
              <Text>
                • <strong>Ranking System:</strong> Each legislator receives both
                an overall rank and percentile rank within each category,
                comparing them against all legislators in the dataset. Current
                members also receive separate rankings comparing them only
                against other currently serving legislators.
              </Text>
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              Decisions, Observations, Problems, and Next Steps
            </Heading>
            <Text>
              There have been many challenges to finding an accurate, unbiased
              political stance of a legislator. There have already been numerous
              decisions made, each with their own tradeoffs. A discussion of
              some important points is below.
            </Text>
            <VStack align="start" gap={3} pl={4}>
              <Text>
                • <strong>Lack of Sufficient Voting Data:</strong> Specifically,
                Senators vote on fewer bills for passage than their House of
                Representatives counterparts. The Senate contains many amendment
                votes on different bills, however, there isn't a clear way to
                gather amendment information right now. In the future, amendment
                information may be able to be pulled from the transcripts of
                Senate floor debates, but until then, Senators have far fewer
                bills analyzed, and therefore, slightly less accurate results.
                In general, more voting data will always help improve the
                accuracy of ideology scores. A future plan is to include all
                bills and assign the partisan scores towards the sponsors of
                said bills.
              </Text>
              <Text>
                • <strong>Strong Gravitation Towards the Middle:</strong>{" "}
                Legislator ideologies on all political categories tend to
                gravitate towards the center of the spectrum. This is likely due
                to the fact that many bills are bipartisan in nature, and that
                many bills do not have a strong partisan leaning. Therefore,
                even if a legislator votes consistently along party lines, if
                the bills themselves are moderate, the resulting ideology score
                will also be moderate. In the future, there may be ways to
                adjust for this, such as normalizing scores based on the
                distribution of bill partisan scores. Additionally, LLMs tend to
                rate bills more moderately than their true nature. Also, some
                models prefer not to assign a partisan score on some bills
                (assigning a score of 0 instead). GPT was most comfortable with
                assigning partisan scores, while Llama and Gemini had many bills
                come out with no partisan score. Of course bipartisan bills
                exist, but the amount of neutral scores suggest an idea of
                political censorship built into some of these models. To prevent
                strong pull toward moderation, these specific bill category
                partisan data points are excluded from legislator ideology
                calculations.
              </Text>
              <Text>
                •{" "}
                <strong>
                  More Bills = More Moderate, Less Bills = More Extreme:
                </strong>{" "}
                This is a combination of the above points. Legislators with very
                little bill counts on a political category tend to have more
                extreme ideology scores. This is likely because with less data
                points, each vote has a much larger impact on the final score.
                Therefore, if a legislator votes along party lines for a few
                highly partisan bills, their resulting ideology score will be
                very extreme. On the other hand, legislators with many bills
                analyzed tend to have more moderate scores, likely due to the
                law of large numbers. In the future, there may be ways to adjust
                for this, such as applying Bayesian averaging or other
                statistical techniques to moderate scores with low bill counts.
              </Text>
              <Text>
                • <strong>Data Reliability and Sanity Checking:</strong> Large
                Language Model outputs are notoriously unreliable and can vary
                significantly based on prompt phrasing, model choice, and even
                random seed. Therefore, it is crucial to continuously sanity
                check outputs against known data points and expected behaviors.
                As of right now, no guardrails or sanity checks exist to verify
                the LLM outputs. In the future, more robust validation
                techniques will be implemented, such as cross-referencing with
                external expert analyses, historical voting patterns, or even
                consolidation with other LLMs.
              </Text>
              <Text>
                • <strong>Addressing Political Bias in LLMs:</strong> If you've
                explored the website for a while, you may have noticed that
                Republican legislators tend to be labeled as more moderate,
                while their liberal peers, tend to be labeled as more extreme.
                It's possible this is a demonstrated effect of the political
                bias found in LLMs today, or it is a result of the way
                conservative versus liberal positions are considered. Another
                observation is that conservative legislators have a larger
                spread while liberal legislators clump together on many
                categories. Further analysis must be done to fully understand
                why this is happening, and whether or not it is a fault of the
                LLMs, or the true nature of political stances today. In the
                future, more LLMs will be used, and we'll see if the pattern
                holds. Because I can't control the training data of these LLMs,
                it's impossible to fully eliminate bias, but I can try to
                minimize it by using multiple models and consolidating results.
                However, due to the nature of LLMs being a product of human
                output over the years, it is my belief that some bias will
                always exist.
              </Text>
              <Text>
                • <strong>Hopes for the Future of This Project:</strong> The
                goal of this project will always be to provide accurate insight
                into the political stances of U.S. legislators. As AI continues
                to improve, I hope to leverage more advanced models and
                techniques to refine my analyses. Additionally, expanding the
                dataset to include more types of legislative actions and
                exploring new methodologies for scoring will be key areas of
                focus moving forward. It is my hope that this project will
                inspire you to think carefully and critically about the
                positions of the legislators who represent you.
              </Text>
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              A Final Note
            </Heading>
            <Text>
              <strong>
                Be involved in the political process! Vote, contact your
                representatives, and stay informed. Democracy thrives when
                citizens actively participate and hold their leaders
                accountable. So please, let your voice be heard.
              </strong>
            </Text>

            <Separator />
          </VStack>
        </Tabs.Content>

        {/* Glossary Tab */}
        <Tabs.Content value="2">
          <VStack gap={6} align="start">
            <Heading as="h1" size="xl">
              Glossary
            </Heading>

            <Text fontSize="lg">
              Key terms and metrics used throughout the United States Political
              Stance Tracker.
            </Text>

            <Separator />

            <Heading as="h2" size="lg">
              Voting & Legislation Terms
            </Heading>
            <VStack align="start" gap={4}>
              <Box>
                <Text fontWeight="bold">Roll Call Vote</Text>
                <Text>
                  A recorded vote where each legislator's position (Yea, Nay,
                  Present, Not Voting) is officially documented.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Bill</Text>
                <Text>
                  A proposed law presented to Congress for consideration and
                  voting.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Congress Session</Text>
                <Text>
                  A two-year term of Congress, numbered sequentially (e.g.,
                  113th Congress: 2013-2014).
                </Text>
              </Box>
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              Scoring Metrics
            </Heading>
            <VStack align="start" gap={4}>
              <Box>
                <Text fontWeight="bold">Ideology Score</Text>
                <Text>
                  A numerical value representing a legislator's political
                  position on a specific issue category, calculated from their
                  voting record.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Partisan Score</Text>
                <Text>
                  A measure indicating how closely a bill aligns with one party
                  versus another, based on voting patterns.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Impact Score</Text>
                <Text>
                  An AI-generated assessment of a bill's potential policy impact
                  and significance.
                </Text>
              </Box>
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              Political Categories
            </Heading>
            <Text fontSize="md" mb={2}>
              Bills are analyzed and classified into these major political
              categories. Each category represents a distinct policy area with
              conservative and liberal viewpoints. There are a total of 25
              defined categories.
            </Text>
            <VStack align="start" gap={4}>
              <Box>
                <Text fontWeight="bold">Economy & Finance</Text>
                <Text>
                  Policies affecting taxation, government spending, trade,
                  business regulation, and employment.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Free market capitalism
                  with minimal government interference, lower taxes, reduced
                  regulation, fiscal responsibility, and competition-driven
                  growth.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Government regulation to ensure
                  fairness, progressive taxation, social safety nets, worker
                  protections, and addressing income inequality.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Healthcare</Text>
                <Text>
                  Healthcare coverage, costs, public health, and regulation.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Market-based solutions,
                  personal responsibility, choice in coverage, and competition
                  to drive down costs and improve quality.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Healthcare as a human right
                  requiring universal access, government role in ensuring
                  affordability, and public health prioritization.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Education</Text>
                <Text>
                  Policies governing schools, universities, and student support.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> School choice, parental
                  rights, local control, merit-based advancement, and
                  traditional educational values and curriculum.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Equitable public education
                  funding, inclusive curriculum, teacher support, and addressing
                  systemic educational inequalities.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Social Issues</Text>
                <Text>
                  Civil rights, immigration, criminal justice, and family
                  policy.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Traditional values, law
                  and order, national sovereignty, individual responsibility,
                  and preservation of established social institutions.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Social justice, equality,
                  inclusive society, criminal justice reform, and protection of
                  marginalized groups' rights.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Environment & Energy</Text>
                <Text>
                  Natural resource policy, energy production, climate change
                  response.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Balanced approach
                  prioritizing economic growth, energy independence, private
                  property rights, and market-based environmental solutions.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Aggressive climate action,
                  renewable energy transition, environmental protection over
                  short-term economic interests.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Technology & Innovation</Text>
                <Text>
                  Regulation of digital platforms, privacy, and emerging tech.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Light regulation to
                  promote innovation, market competition, free speech
                  protection, and American technological leadership.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Strong regulation to protect
                  privacy, prevent monopolization, ensure platform
                  accountability, and address digital inequities.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Infrastructure & Transportation</Text>
                <Text>Development of physical and digital infrastructure.</Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Private sector efficiency,
                  user fees for infrastructure, limited government role, focus
                  on core infrastructure needs.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Major public investment in
                  infrastructure as economic stimulus, job creation, and
                  ensuring equitable access.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Government & Institutional Reform</Text>
                <Text>Rules and systems shaping governance and elections.</Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Limited government,
                  constitutional originalism, federalism, election integrity,
                  and maintaining traditional institutional structures.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Democratic reforms, voting
                  rights expansion, government accountability, and institutional
                  changes to ensure fair representation.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Agriculture & Rural Issues</Text>
                <Text>
                  Policies affecting farmers, food safety, and rural economies.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Support for family
                  farming, minimal regulation, market-based solutions, and
                  preserving rural way of life and property rights.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Sustainable agriculture, worker
                  protections, environmental standards, and support for small
                  farmers over agribusiness.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Budget & Appropriations</Text>
                <Text>
                  Overall fiscal planning, debt, and major spending bills.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Fiscal responsibility,
                  balanced budgets, debt reduction, limited government spending,
                  and prioritizing essential functions only.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Strategic government investment
                  for economic growth, social programs, infrastructure, with
                  less concern for short-term deficits.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Science & Space</Text>
                <Text>
                  Policies advancing research, exploration, and innovation.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Private sector innovation,
                  market-driven research, space commercialization, and
                  maintaining American technological leadership.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Public investment in research
                  and development, space exploration as public good, scientific
                  research for societal benefit.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Disaster & Emergency Management</Text>
                <Text>
                  Preparedness, response, and recovery from disasters.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Local and state
                  responsibility for disaster response, private sector
                  efficiency, individual preparedness and responsibility.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Federal coordination and
                  resources necessary for effective disaster response, climate
                  adaptation, and protecting vulnerable populations.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Tribal & Indigenous Affairs</Text>
                <Text>
                  Policy related to Native American tribes and sovereignty.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Respect for tribal
                  sovereignty within constitutional framework, economic
                  development opportunities, and gradual integration approaches.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Honor treaty obligations,
                  support tribal self-determination, address historical
                  injustices, and protect indigenous rights and culture.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Government Role & Regulation</Text>
                <Text>
                  The extent and nature of government involvement in society,
                  economy, and individual lives.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Limited government with
                  minimal regulation allows free markets, individual liberty,
                  and competition to produce optimal outcomes naturally.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Active government intervention
                  through regulation and programs protects vulnerable
                  populations, ensures fairness, and addresses market failures.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">
                  Foreign Policy & National Security
                </Text>
                <Text>
                  International relations, military engagement, and America's
                  role in the world.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Strong national defense
                  with selective engagement prioritizing American interests;
                  skepticism of international institutions limiting sovereignty.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Multilateral cooperation
                  through alliances and international institutions; diplomacy
                  and humanitarian concerns alongside national interests.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Federalism & Governance</Text>
                <Text>
                  Balance of power between federal, state, and local
                  governments.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Power should be
                  decentralized to states and localities; federal government
                  limited to enumerated constitutional powers.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Strong federal authority
                  ensures nationwide standards, protects rights uniformly, and
                  addresses problems beyond state capacity.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Civil Liberties vs Security</Text>
                <Text>
                  Balance between individual privacy rights and collective
                  security needs.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Security and public safety
                  require strong law enforcement with tools to prevent crime and
                  terrorism, even if limiting some liberties.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Civil liberties and privacy are
                  fundamental rights that must be protected even when security
                  concerns exist.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Populism vs Institutionalism</Text>
                <Text>
                  Trust in established institutions and expertise vs populist
                  skepticism.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Elite institutions often
                  disconnected from ordinary Americans; common sense and popular
                  will should prevail over technocratic expertise.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Democratic institutions,
                  expertise, and established norms provide stability and
                  informed policymaking essential for functioning society.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Trade & Globalization</Text>
                <Text>
                  International trade policy, tariffs, and economic integration
                  with global economy.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Protect American workers
                  and industries from unfair competition; prioritize national
                  economic interests over global integration.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Free trade creates prosperity
                  through efficiency and cooperation; protectionism raises costs
                  and invites retaliation.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Corporate Power & Business</Text>
                <Text>
                  Regulation of corporations, antitrust policy, and relationship
                  between business and government.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Business freedom and light
                  regulation foster innovation, job creation, and economic
                  growth; corporations drive prosperity.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Large corporations require
                  strong regulation to prevent abuse, ensure fair competition,
                  and protect workers and consumers.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Tradition vs Progress</Text>
                <Text>
                  Relationship between historical norms, religious values, and
                  evolving social understanding.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Traditional wisdom,
                  religious values, and established norms provide moral
                  foundation and social stability.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Society should evolve based on
                  reason, science, and expanding moral understanding; tradition
                  shouldn't limit progress.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">
                  Individual vs Collective Responsibility
                </Text>
                <Text>
                  Balance between personal responsibility and
                  community/government solutions.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Personal responsibility
                  and voluntary cooperation produce better outcomes than
                  government programs; individual liberty paramount.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Collective action through
                  government addresses systemic problems individual effort
                  cannot solve; shared responsibility for common good.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Democratic Governance</Text>
                <Text>
                  Structure of democratic institutions, executive power, and
                  government transparency.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Strong executive
                  leadership and decisive governance; respect for law and order;
                  majoritarian rule within constitutional limits.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Checks and balances,
                  transparency, broad participation, free press; protect
                  minority rights and democratic norms.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Criminal Justice</Text>
                <Text>
                  Approach to crime, punishment, policing, and the justice
                  system.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Tough on crime with strong
                  law enforcement, serious consequences for criminals,
                  prioritize public safety and victims' rights.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Reform unjust system, address
                  root causes of crime, emphasize rehabilitation, reduce mass
                  incarceration.
                </Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Immigration Policy</Text>
                <Text>
                  Comprehensive approach to immigration, asylum, and
                  citizenship.
                </Text>
                <Text fontSize="sm" color="gray.600" mt={1}>
                  <strong>Conservative view:</strong> Strict border enforcement,
                  limited immigration levels, merit-based system, prioritize
                  American workers and national security.
                </Text>
                <Text fontSize="sm" color="gray.600">
                  <strong>Liberal view:</strong> Humane immigration system with
                  pathways to citizenship, family reunification, refugee
                  protection, and addressing root causes.
                </Text>
              </Box>
            </VStack>
          </VStack>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
