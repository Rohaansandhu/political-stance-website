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
import { Helmet } from "react-helmet-async";

const politicalCategoriesData = [
  {
    name: "Economy & Finance",
    description: "Policies affecting taxation, business regulation, financial markets, and corporate governance.",
    conservative_view: "Free market capitalism with minimal government interference, lower taxes, reduced regulation, fiscal responsibility, and competition-driven growth.",
    liberal_view: "Government regulation to ensure fairness, progressive taxation, consumer protections, and active measures to address income inequality.",
    subcategories: [
      {
        name: "Taxes",
        description: "Income, corporate, and wealth tax policy.",
        conservative_view: "Lower taxes stimulate economic growth, reduce government size, and allow individuals to keep more of their earnings.",
        liberal_view: "Progressive taxation funds public services, reduces inequality, and ensures the wealthy pay their fair share."
      },
      {
        name: "Business Regulation",
        description: "Antitrust, corporate rules, and market concentration.",
        conservative_view: "Minimal regulation allows innovation and competition to drive efficiency naturally; aggressive antitrust harms consumer benefits from scale.",
        liberal_view: "Strong regulation prevents monopoly abuse, protects consumers, ensures fair competition, and breaks up concentrated corporate power."
      },
      {
        name: "Financial Markets & Monetary Policy",
        description: "Securities regulation, central bank policy, crypto, inflation control.",
        conservative_view: "Light-touch regulation promotes capital formation; sound money and price stability protect savers.",
        liberal_view: "Strong Wall Street oversight prevents systemic risk and fraud; monetary policy should support full employment."
      }
    ]
  },
  {
    name: "Budget & Appropriations",
    description: "Overall fiscal planning, debt, and major government spending bills.",
    conservative_view: "Fiscal responsibility, balanced budgets, debt reduction, limited government spending, and prioritizing essential functions only.",
    liberal_view: "Strategic government investment for economic growth, social programs, and infrastructure, with less concern for short-term deficits.",
    subcategories: [
      {
        name: "Debt & Deficit",
        description: "Debt ceiling, deficit reduction measures.",
        conservative_view: "Fiscal discipline requires debt reduction, spending cuts, and living within government means to avoid burdening future generations.",
        liberal_view: "Government debt is acceptable for productive investments; focus on economic growth and revenue enhancement over austerity."
      },
      {
        name: "Appropriations",
        description: "Omnibus spending bills, continuing resolutions.",
        conservative_view: "Streamlined government funding focused on core functions; strict oversight to eliminate waste and unnecessary programs.",
        liberal_view: "Adequate funding for government services, social programs, and public investments even if requiring larger appropriations."
      }
    ]
  },
  {
    name: "Labor & Employment",
    description: "Worker protections, union rights, wages, and workplace conditions.",
    conservative_view: "Market forces should determine wages; right-to-work laws protect individual freedom; excessive labor regulation hurts job creation.",
    liberal_view: "Strong union protections, living wage laws, and robust workplace safety nets are essential for worker dignity and economic fairness.",
    subcategories: [
      {
        name: "Unions & Collective Bargaining",
        description: "Organized labor rights, strike protections, right-to-work laws.",
        conservative_view: "Workers should not be forced to join unions or pay dues; right-to-work laws promote economic competitiveness.",
        liberal_view: "Strong unions are essential to balance corporate power, negotiate fair wages, and protect worker rights."
      },
      {
        name: "Wages & Benefits",
        description: "Minimum wage, paid leave, overtime rules.",
        conservative_view: "Mandated wage floors and benefit requirements price low-skilled workers out of the market and burden small businesses.",
        liberal_view: "Federal minimum wage increases and mandated paid family leave are necessary baseline protections for all workers."
      },
      {
        name: "Workplace Safety & Standards",
        description: "OSHA regulations, discrimination in employment, worker classification.",
        conservative_view: "Flexible labor arrangements (like gig work) benefit workers; avoid overly burdensome safety compliance that stifles business.",
        liberal_view: "Strict enforcement of workplace safety, protections against discrimination, and preventing the misclassification of employees."
      }
    ]
  },
  {
    name: "Healthcare",
    description: "Healthcare coverage, costs, public health, and regulation.",
    conservative_view: "Market-based solutions, personal responsibility, choice in coverage, and competition to drive down costs and improve quality.",
    liberal_view: "Healthcare as a human right requiring universal access, government role in ensuring affordability, and public health prioritization.",
    subcategories: [
      {
        name: "Coverage Models",
        description: "Universal healthcare vs private insurance systems.",
        conservative_view: "Private insurance and market competition provide better quality, choice, and efficiency than government-run systems.",
        liberal_view: "Universal healthcare ensures everyone gets care regardless of ability to pay, reducing costs through collective bargaining."
      },
      {
        name: "Costs & Access",
        description: "Drug pricing, insurance affordability, billing transparency.",
        conservative_view: "Market competition and price transparency will naturally reduce costs; government price controls stifle medical innovation.",
        liberal_view: "Government intervention, like Medicare negotiating drug prices, is needed to control excessive pricing and ensure affordability."
      },
      {
        name: "Public & Mental Health",
        description: "Pandemic response, vaccinations, suicide prevention, parity laws.",
        conservative_view: "Individual choice in health decisions; private sector innovation and community support address mental health best.",
        liberal_view: "Government coordination is necessary to protect public health; state funding ensures mental health treatment is accessible."
      },
      {
        name: "Reproductive Health",
        description: "Abortion policy, contraception access, maternal care.",
        conservative_view: "Protection of unborn life, religious freedom for providers, and traditional family values guide reproductive policy.",
        liberal_view: "Women's bodily autonomy, reproductive choice, and universal access to family planning services."
      }
    ]
  },
  {
    name: "Education",
    description: "Policies governing schools, universities, and student support.",
    conservative_view: "School choice, parental rights, local control, merit-based advancement, and traditional educational values.",
    liberal_view: "Equitable public education funding, inclusive curriculum, teacher support, and addressing systemic educational inequalities.",
    subcategories: [
      {
        name: "K-12 Education",
        description: "Funding, curriculum standards, teacher pay.",
        conservative_view: "Local control, parental oversight of curriculum, merit pay for teachers, and emphasis on core academic subjects.",
        liberal_view: "Adequate federal/state funding, professional teacher compensation, inclusive curriculum, and addressing achievement gaps."
      },
      {
        name: "Higher Education",
        description: "Student loans, tuition, public university funding.",
        conservative_view: "Personal responsibility for education costs; reduced government subsidies that inflate tuition prices.",
        liberal_view: "Accessible higher education through public funding, loan forgiveness, and treating education as a public investment."
      },
      {
        name: "School Choice",
        description: "Charter schools, vouchers, homeschooling policy.",
        conservative_view: "Competition improves education quality; parents should have the funding to choose schools that align with their values.",
        liberal_view: "Public schools need support, not diversion of funds to private entities; school choice can increase segregation."
      }
    ]
  },
  {
    name: "Infrastructure & Transportation",
    description: "Development of physical and digital infrastructure.",
    conservative_view: "Private sector efficiency, user fees for infrastructure, limited government role, focus on core infrastructure needs like roads.",
    liberal_view: "Major public investment in infrastructure as an economic stimulus, job creator, and means to ensure equitable access.",
    subcategories: [
      {
        name: "Transportation",
        description: "Roads, transit systems, aviation, maritime.",
        conservative_view: "User fees and private sector involvement; focus on maintaining roads and highways over heavily subsidized mass transit.",
        liberal_view: "Public investment in mass transit, high-speed rail, and sustainable transportation options to reduce emissions."
      },
      {
        name: "Digital Infrastructure",
        description: "Broadband expansion, rural connectivity.",
        conservative_view: "Private sector-led broadband expansion; market competition should drive access and reduce costs.",
        liberal_view: "Government investment needed to ensure universal broadband access as a utility, especially in rural and urban areas."
      },
      {
        name: "Public Works & Utilities",
        description: "Water systems, electricity grid, waste management.",
        conservative_view: "Private utility management where possible, user fees for services, efficient delivery through market mechanisms.",
        liberal_view: "Public utilities ensure universal access and affordability; government must invest in modern, resilient infrastructure."
      }
    ]
  },
  {
    name: "Environment & Energy",
    description: "Natural resource policy, energy production, climate change response, and disaster management.",
    conservative_view: "Balanced approach prioritizing economic growth, energy independence, private property rights, and market-based solutions.",
    liberal_view: "Aggressive climate action, renewable energy transition, and environmental protection over short-term economic interests.",
    subcategories: [
      {
        name: "Climate Policy",
        description: "Emissions limits, carbon pricing, green incentives.",
        conservative_view: "Market-based technological innovation; avoiding economic disruption or job losses while addressing environmental concerns.",
        liberal_view: "Urgent government action on climate change through strict regulation, carbon pricing, and rapid transition mandates."
      },
      {
        name: "Energy Production",
        description: "Fossil fuels, nuclear power, renewable energy.",
        conservative_view: "All-of-the-above strategy including domestic fossil fuels and nuclear to ensure energy independence and low costs.",
        liberal_view: "Rapid transition to renewable energy sources, phasing out fossil fuel subsidies, and heavy government investment in clean tech."
      },
      {
        name: "Conservation & Water",
        description: "Public lands, wildlife, water rights, pollution control.",
        conservative_view: "Balanced use of natural resources for economic benefit; respect for private property and existing water rights.",
        liberal_view: "Strong environmental protection, expansion of protected federal lands, and prioritizing conservation over resource extraction."
      },
      {
        name: "Disaster Management",
        description: "FEMA programs, hurricane/wildfire response.",
        conservative_view: "State and local primary responsibility with efficient federal support; personal responsibility for preparedness.",
        liberal_view: "Strong federal disaster response, climate change adaptation funding, and ensuring equitable recovery assistance."
      }
    ]
  },
  {
    name: "Science & Technology",
    description: "Regulation of digital platforms, scientific research, space exploration, and emerging tech.",
    conservative_view: "Light regulation to promote innovation, free speech online, private sector space leadership, and American technological dominance.",
    liberal_view: "Strong regulation to protect data privacy, prevent algorithmic bias, fund public research, and ensure tech serves the public good.",
    subcategories: [
      {
        name: "Data Privacy & Cybersecurity",
        description: "User data protection, infrastructure defense.",
        conservative_view: "Market-based privacy solutions; public-private partnerships for cyber defense without heavy compliance burdens.",
        liberal_view: "Strong federal data protection laws, user rights over personal information, and strict cybersecurity mandates for infrastructure."
      },
      {
        name: "Tech Regulation & Speech",
        description: "Online content moderation, platform liability.",
        conservative_view: "Protect free speech online; skeptical of content moderation by Big Tech that may silence conservative viewpoints.",
        liberal_view: "Platform responsibility to combat misinformation and hate speech while protecting legitimate expression."
      },
      {
        name: "Emerging Tech & AI",
        description: "Artificial intelligence, biotech, intellectual property.",
        conservative_view: "Light regulatory touch to maintain American innovation leadership against foreign adversaries.",
        liberal_view: "Proactive regulation to ensure AI safety, prevent algorithmic discrimination, and manage workforce displacement."
      },
      {
        name: "Space & Scientific Research",
        description: "NASA programs, federal R&D funding.",
        conservative_view: "Commercialization of space; government R&D should focus primarily on national security and basic research.",
        liberal_view: "Robust public funding for scientific institutions; space exploration as a peaceful public good."
      }
    ]
  },
  {
    name: "Agriculture & Rural Issues",
    description: "Policies affecting farmers, food safety, and rural economies.",
    conservative_view: "Support for farming autonomy, minimal environmental regulation, market-based solutions, and preserving rural property rights.",
    liberal_view: "Sustainable agriculture, farm worker protections, strict environmental standards, and support for small farmers over agribusiness.",
    subcategories: [
      {
        name: "Farm Policy",
        description: "Subsidies, crop insurance, agribusiness regulation.",
        conservative_view: "Support for agricultural producers through crop insurance while reducing the EPA regulatory burden on family farms.",
        liberal_view: "Farm subsidies should be restructured to support sustainable practices, conservation, and small local farms rather than corporate agribusiness."
      },
      {
        name: "Food Safety",
        description: "Labeling, inspection, GMO policy.",
        conservative_view: "Science-based safety regulations without alarmism; support for agricultural innovation including GMOs; minimal labeling burdens.",
        liberal_view: "Strong FDA/USDA oversight, aggressive consumer right-to-know through labeling, and a precautionary approach to new food technologies."
      },
      {
        name: "Rural Development",
        description: "Infrastructure and healthcare access for rural areas.",
        conservative_view: "Market-based rural development; empowering local communities to manage their own economic growth without federal mandates.",
        liberal_view: "Targeted federal investment to prevent rural hospital closures and ensure equitable access to economic opportunities."
      }
    ]
  },
  {
    name: "Criminal Justice",
    description: "Approach to crime, punishment, policing, and the justice system.",
    conservative_view: "Tough on crime, strong support for law enforcement, serious consequences for criminals, and prioritizing victims' rights.",
    liberal_view: "Reform the system, address root causes of crime, emphasize rehabilitation, and reduce mass incarceration.",
    subcategories: [
      {
        name: "Sentencing & Punishment",
        description: "Prison terms, mandatory minimums, death penalty.",
        conservative_view: "Serious crimes deserve serious punishment; strong sentences deter crime and incapacitate dangerous repeat offenders.",
        liberal_view: "Mass incarceration is ineffective and unjust; reduce sentences, eliminate mandatory minimums, and abolish the death penalty."
      },
      {
        name: "Policing & Law Enforcement",
        description: "Police funding, tactics, accountability.",
        conservative_view: "Support and fully fund police; officers need qualified immunity and discretion to safely handle dangerous situations.",
        liberal_view: "Reform policing through strict accountability, demilitarization, independent oversight, and addressing systemic bias."
      },
      {
        name: "Rehabilitation & Drug Policy",
        description: "Prison programs, decriminalization, treatment.",
        conservative_view: "Punishment is the primary goal; maintain strong drug enforcement while offering voluntary treatment options.",
        liberal_view: "Decriminalize minor drug offenses; treat addiction as a health issue; invest heavily in reentry and rehabilitation programs."
      }
    ]
  },
  {
    name: "Civil Rights & Social Issues",
    description: "Civil liberties, discrimination, family policy, and cultural values.",
    conservative_view: "Traditional values, religious freedom, colorblind legal equality without special preferences, and preservation of established social norms.",
    liberal_view: "Active social justice, protection of marginalized groups, LGBTQ+ rights, and addressing systemic historical inequities.",
    subcategories: [
      {
        name: "Civil Rights & Equity",
        description: "Anti-discrimination laws, affirmative action.",
        conservative_view: "Equal opportunity and treatment under the law; opposition to identity politics and race-conscious policies.",
        liberal_view: "Active measures, including affirmative action and diversity initiatives, are needed to combat systemic discrimination."
      },
      {
        name: "Family, Culture & Religion",
        description: "Marriage policy, gender identity, religious liberties.",
        conservative_view: "Protection of traditional family structures, biological reality in gender policy, and robust religious exemptions in public life.",
        liberal_view: "Marriage equality, comprehensive LGBTQ+ rights, gender identity recognition, and secular governance."
      },
      {
        name: "Privacy & Civil Liberties",
        description: "Surveillance limits, individual constitutional rights.",
        conservative_view: "Balance civil liberties with the need for law enforcement to maintain order and protect national security.",
        liberal_view: "Robust privacy protections, strict limits on government surveillance, and absolute defense of individual civil liberties."
      },
      {
        name: "Tribal & Indigenous Affairs",
        description: "Native American sovereignty, treaty rights, cultural preservation.",
        conservative_view: "Respect for tribal sovereignty balanced with federal/state authority; focus on indigenous economic self-reliance.",
        liberal_view: "Strict honoring of historical treaty obligations, strong support for tribal self-determination, and restorative justice for historical harms."
      }
    ]
  },
  {
    name: "Immigration",
    description: "Comprehensive approach to border security, legal immigration, and asylum.",
    conservative_view: "Strict border enforcement, merit-based legal immigration, deterrence of illegal entry, and prioritizing American workers.",
    liberal_view: "A humane system with pathways to citizenship for undocumented residents, family reunification, and robust refugee protection.",
    subcategories: [
      {
        name: "Border Security & Enforcement",
        description: "Physical barriers, ICE operations, deportation.",
        conservative_view: "Secure the border with physical barriers and increased personnel; strictly enforce deportation laws to deter illegal crossings.",
        liberal_view: "Focus on smart border technology; limit interior ICE raids; treat unauthorized border crossings as civil rather than criminal offenses."
      },
      {
        name: "Legal Immigration & Pathways",
        description: "Visas, green cards, DACA, amnesty.",
        conservative_view: "Transition to a skills-based system; oppose blanket amnesty which rewards lawbreaking.",
        liberal_view: "Provide a permanent pathway to citizenship for Dreamers and undocumented populations; expand legal visa caps."
      },
      {
        name: "Asylum & Refugees",
        description: "Humanitarian protection, asylum claims.",
        conservative_view: "Tighten asylum rules to prevent systemic abuse; limit overall refugee admissions to ensure thorough security vetting.",
        liberal_view: "Restore and expand asylum processes; generous refugee admissions reflect American humanitarian values."
      }
    ]
  },
  {
    name: "Defense & National Security",
    description: "Funding and deployment of the armed forces, military strategy, and veterans affairs.",
    conservative_view: "Peace through strength; robust military funding, modernization of the nuclear triad, and decisive lethal capability.",
    liberal_view: "Measured military spending, focus on asymmetric threats like cyber warfare, and reliance on diplomacy before force.",
    subcategories: [
      {
        name: "Military Readiness & Budget",
        description: "Pentagon funding, weapons procurement.",
        conservative_view: "Consistent increases in defense spending are required to maintain global supremacy and deter near-peer adversaries.",
        liberal_view: "The defense budget is bloated and should be audited; funds should be reallocated to domestic priorities and diplomacy."
      },
      {
        name: "Veterans Affairs",
        description: "VA hospitals, military benefits.",
        conservative_view: "Expand private healthcare choices for veterans to bypass VA wait times; ensure strong transition assistance to civilian life.",
        liberal_view: "Fully fund and staff the VA system as a public healthcare model; expand benefits for toxic exposure and mental health."
      },
      {
        name: "Intelligence & Counterterrorism",
        description: "CIA, NSA, homeland security operations.",
        conservative_view: "Provide intelligence agencies with the broad authorities and surveillance tools necessary to prevent terrorist attacks.",
        liberal_view: "Ensure strict congressional oversight of intelligence agencies to prevent abuses of power and constitutional violations."
      }
    ]
  },
  {
    name: "Foreign Policy",
    description: "International diplomacy, global trade, foreign aid, and geopolitical alliances.",
    conservative_view: "America First approach; bilateral agreements over multilateral constraints; skepticism of international organizations.",
    liberal_view: "Multilateral cooperation; strengthening international institutions; prioritizing human rights and global stability.",
    subcategories: [
      {
        name: "International Alliances & Treaties",
        description: "NATO, UN, international climate accords.",
        conservative_view: "Alliances must serve US interests and partners must pay their fair share; avoid treaties that surrender US sovereignty.",
        liberal_view: "Strong alliances multiply American influence; active participation in the UN and global accords is essential for solving global crises."
      },
      {
        name: "Global Trade & Tariffs",
        description: "Free trade deals, protectionism, sanctions.",
        conservative_view: "Use tariffs aggressively to protect domestic manufacturing and punish unfair foreign trade practices; favor bilateral trade deals.",
        liberal_view: "Free trade generally benefits the global economy, but agreements must include strict labor and environmental standards."
      },
      {
        name: "Foreign Aid & Diplomacy",
        description: "Humanitarian relief, State Department funding.",
        conservative_view: "Foreign aid should be highly restricted and explicitly tied to US strategic objectives, not open-ended nation building.",
        liberal_view: "Robust funding for the State Department and foreign aid promotes global stability, addresses poverty, and prevents conflicts."
      }
    ]
  },
  {
    name: "Government Operations & Reform",
    description: "Rules and systems shaping elections, the balance of power, and institutional integrity.",
    conservative_view: "Limited federal power, strong states' rights, constitutional originalism, and strict election security measures.",
    liberal_view: "Expansion of voting access, federal protection of civil rights, campaign finance reform, and modernization of democratic institutions.",
    subcategories: [
      {
        name: "Electoral Law & Voting",
        description: "Voter ID, ballot access, gerrymandering.",
        conservative_view: "Election integrity requires strict voter ID, accurate rolls, and state control over election procedures.",
        liberal_view: "Expand voting access through federal standards, automatic registration, and independent redistricting commissions."
      },
      {
        name: "Campaign Finance & Ethics",
        description: "PACs, political donations, lobbying rules.",
        conservative_view: "Political spending is a form of protected free speech; arbitrary limits on campaign contributions are unconstitutional.",
        liberal_view: "Aggressive campaign finance reform is needed to limit corporate influence, including support for public campaign financing."
      },
      {
        name: "Federalism & Executive Power",
        description: "States' rights, bureaucracy, executive orders.",
        conservative_view: "Decentralize power to the states; rein in the unelected administrative state; the executive must strictly follow the Constitution.",
        liberal_view: "Strong federal authority is needed to ensure equal protection nationwide; expert administrative agencies are vital for complex governance."
      }
    ]
  }
];

export function About() {
  const [activeTab, setActiveTab] = useState("0");

  return (
    <Box maxW="6xl" mx="auto" p={8}>
      <Helmet>
        <title>{`About | US PoliTrack`}</title>
        <meta
          name="description"
          content={`About page for US PoliTrack - United States Political Stance Tracker. Explains key terms and methodology.`}
        />
      </Helmet>
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
              <Text>
                • <strong>Bill Data Provided:</strong> LLMs are fed the bill
                summary text, legislative subjects, and the top subject area to
                provide context for analysis.
              </Text>
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
                sources of bias. In the past, I used gpt-oss-120b,
                gemini-2.5-flash-lite, llama3.3-70b, and qwen3-32b. These models
                were chosen because of they were free to use. However, now you
                will only find results from gpt-5-mini which was run on the
                latest poltical category defintions. As the project advances, I
                plan to use more powerful, expensive models.
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
              Scoring Metrics
            </Heading>
            <VStack align="start" gap={4}>
              <Box>
                <Text fontWeight="bold">Ideology Score</Text>
                <Text>
                  A numerical value representing a legislator's political
                  position on a specific issue category, calculated from their
                  voting record. Every bill has different political categories
                  of interest, each with their own partisan and impact scores.
                </Text>

                <Text>
                  When a legislator votes on a bill, for every political
                  category, their vote direction is calculated. A 'Yea' vote is
                  1 and a 'Nay' vote is -1, while a 'Not Voting' status means
                  that this bill is not included in their overall ideological
                  score calculation.
                </Text>
                <Text>
                  Finally, the legislator's vote direction x the partisan score
                  x the impact score = legislator's ideological score for that
                  one bill. This process is done for every bill and political
                  category. The final ideological score for a legislator you see
                  on every category is an average of these individual
                  ideological scores.
                </Text>
                <Text>
                  The range of an ideology score is from -1 (liberal) to +1
                  (conservative).
                </Text>
                <Text>All scores vary by LLM.</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Partisan Score</Text>
                <Text>
                  A measure indicating how closely a political category in a
                  bill aligns with one party versus another, based on voting
                  patterns.
                </Text>
                <Text>On a scale from -1 (liberal) to +1 (conservative).</Text>
                <Text>All scores vary by LLM.</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Impact Score</Text>
                <Text>
                  An AI-generated assessment of a political category in a bill's
                  potential policy impact and significance.
                </Text>
                <Text>
                  On a scale from 0 (least important) to 1 (most important).
                </Text>
                <Text>All scores vary by LLM.</Text>
              </Box>

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
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              Political Categories
            </Heading>
            <Text fontSize="md" mb={2}>
              Bills are analyzed and classified into these major political
              categories. Each category represents a distinct policy area with
              conservative and liberal viewpoints, along with specific subcategories.
            </Text>

            <VStack align="start" gap={8} w="full">
              {politicalCategoriesData.map((category, idx) => (
                <Box key={idx} w="full">
                  <Text fontWeight="bold" fontSize="lg">{category.name}</Text>
                  <Text mb={2}>{category.description}</Text>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    <strong>Conservative view:</strong> {category.conservative_view}
                  </Text>
                  <Text fontSize="sm" color="gray.600" mb={3}>
                    <strong>Liberal view:</strong> {category.liberal_view}
                  </Text>

                  {/* Subcategories Rendering */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <Box pl={4} borderLeft="2px solid" borderColor="gray.200" mt={4}>
                      <Text fontWeight="semibold" fontSize="sm" mb={3} color="gray.500" textTransform="uppercase" letterSpacing="wide">
                        Subcategories
                      </Text>
                      <VStack align="start" gap={4}>
                        {category.subcategories.map((sub, sIdx) => (
                          <Box key={sIdx}>
                            <Text fontWeight="bold" fontSize="sm">{sub.name}</Text>
                            <Text fontSize="sm" mb={1}>{sub.description}</Text>
                            <Text fontSize="xs" color="gray.600" mt={1}>
                              <strong>Conservative:</strong> {sub.conservative_view}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              <strong>Liberal:</strong> {sub.liberal_view}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </Box>
              ))}
            </VStack>
          </VStack>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
