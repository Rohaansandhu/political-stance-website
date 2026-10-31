import { useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Link,
  VStack,
  Separator,
  Tabs,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";

import politicalCategoriesData from "../../data/politicalCategories.json";
import politicalAxesData from "../../data/politicalAxes.json";
const POLITICAL_CATEGORIES = politicalCategoriesData.political_categories;
const POLITICAL_AXES = politicalAxesData.political_axes;

const TAB_VALUES = ["overview", "methodology", "glossary"];

const PAGE_CSS = {
  "& .chakra-separator": {
    alignSelf: "stretch",
    borderColor: "borderSubtle",
    marginBlock: "4",
  },
};

// Hanging indent so wrapped lines align with the text after the bullet
const BULLET_LIST_CSS = {
  "& > p:has(> strong)": {
    paddingInlineStart: "0.72em",
    textIndent: "-0.72em",
  },
};

const GLOSSARY_TERMS_CSS = {
  "& div > p + p": { marginTop: "2" },
};

export function About() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") || "overview";
  const activeTab = TAB_VALUES.includes(tabParam) ? tabParam : "overview";

  const setActiveTab = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "overview") {
      newParams.delete("tab");
    } else {
      newParams.set("tab", value);
    }
    setSearchParams(newParams, { replace: true });
  };

  return (
    <Container
      maxW="3xl"
      py={{ base: 8, md: 12 }}
      lineHeight="1.7"
      css={PAGE_CSS}
    >
      <Helmet>
        <title>{`About | US PoliTrack`}</title>
        <meta
          name="description"
          content={`About page for US PoliTrack - United States Political Stance Tracker. Explains key terms and methodology.`}
        />
      </Helmet>
      <Box
        as="aside"
        mb={8}
        p={5}
        bg="bgAltGreen"
        borderLeftWidth="3px"
        borderColor="primary"
        rounded="lg"
      >
        <Text
          fontSize="xs"
          fontWeight="semibold"
          color="primary"
          textTransform="uppercase"
          letterSpacing="wide"
          mb={1}
        >
          Author's Note
        </Text>
        <Text>
          Be involved in the political process! Vote, contact your
          representatives, and stay informed. Democracy thrives when citizens
          actively participate and hold their leaders accountable. So please,
          let your voice be heard.
        </Text>
      </Box>

      <Tabs.Root
        value={activeTab}
        onValueChange={(e) => setActiveTab(e.value)}
        variant="line"
      >
        <Tabs.List mb={8}>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="methodology">Methodology</Tabs.Trigger>
          <Tabs.Trigger value="glossary">Glossary</Tabs.Trigger>
        </Tabs.List>

        {/* Overview Tab */}
        <Tabs.Content value="overview">
          <VStack gap={4} align="start">
            <Heading as="h1" size="3xl" letterSpacing="tight">
              About United States Political Stance Tracker
            </Heading>

            <Text fontSize="lg" color="textMuted">
              <strong>United States Political Stance Tracker</strong> is a web
              platform designed to help you explore where U.S. Congress members
              stand on major political issues. By pulling voting records and
              using LLM-powered analysis, the platform aims to provide insight into
              legislators' political ideologies on specific political
              categories.
            </Text>

            <Separator />

            <Heading as="h2" size="lg">
              Platform Overview
            </Heading>
            <VStack align="start" gap={3} css={BULLET_LIST_CSS}>
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
                • <strong>Visualize Congress:</strong> Histograms, scatter plots,
                rankings, and a two-axis political compass show political trends
                across parties, issues, and chambers.
              </Text>
              <Text>
                • <strong>Explore Legislator Profiles:</strong> Dive deep into
                individual legislators to see their scores on major political
                topics and ideological axes, and how they compare with peers.
              </Text>
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              How It Works
            </Heading>
            <VStack align="start" gap={3} css={BULLET_LIST_CSS}>
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
                <Link href="https://political-llm.org/" color="accent">
                  Political LLM Research 2024
                </Link>{" "}
                and a recent AI-driven analysis of Japanese parliamentary
                speeches{" "}
                <Link href="https://arxiv.org/pdf/2505.07118" color="accent">
                  KOKKAI DOC
                </Link>
                .
              </Text>
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              Current Features
            </Heading>
            <VStack align="start" gap={3} css={BULLET_LIST_CSS}>
              <Text>
                • <strong>Legislators Page:</strong> Search, filter, and explore
                ideological scores of individual Congress members.
              </Text>
              <Text>
                • <strong>Congress Data Page:</strong> View histograms, scatter
                plots, and rankings summarizing political trends across parties,
                models, and chambers, by political category or ideological axis.
              </Text>
              <Text>
                • <strong>Political Compass Page:</strong> Plot legislators on
                two ideological axes at once, using presets such as the classic
                political compass or party loyalty, and compare them against
                their chamber or their own party.
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
            <Text>
              The platform is under active development, with UI enhancements, new
              features for deep political analysis, expanded datasets, and
              continuous improvements in AI-driven bill analysis. Feedback and
              contributions are welcome.
            </Text>

            <Separator />

            <Heading as="h2" size="lg">
              Acknowledgments
            </Heading>
            <Text>
              Special thanks to the{" "}
              <Link
                href="https://github.com/unitedstates/congress"
                color="accent"
              >
                unitedstates/congress
              </Link>{" "}
              project for their scrapers and foundational data, which make this
              project possible.
            </Text>

            <Separator />

            <Heading as="h2" size="lg">
              GitHub
            </Heading>
            <Text>
              In order to promote transparency and community involvement, the
              entire codebase is open-source and available on GitHub. Explore
              the full source code, contribute, or report issues on GitHub:{" "}
              <Link
                href="https://github.com/Rohaansandhu/political-stance-tracker"
                color="accent"
              >
                Python Data Pipeline
              </Link>
              {" ,  "}
              <Link
                href="https://github.com/Rohaansandhu/political-stance-website"
                color="accent"
              >
                Website Code
              </Link>
            </Text>
          </VStack>
        </Tabs.Content>

        {/* Methodology Tab */}
        <Tabs.Content value="methodology">
          <VStack gap={4} align="start">
            <Heading as="h1" size="3xl" letterSpacing="tight">
              Methodology
            </Heading>

            <Text fontSize="lg" color="textMuted">
              This section explains the methods used to calculate political stance scores and
              analyze legislative data.
            </Text>

            <Separator />

            <Heading as="h2" size="lg">
              Data Sources
            </Heading>
            <Text>
              Bill data is pulled from the bulkdata repository found on
              govinfo.gov, and roll call votes come from clerk.house.gov and
              senate.gov. Both are processed using the unitedstates/congress
              scrapers. The dataset includes roll call votes, bill texts, and
              legislator information from the 113th Congress (2013-2014) to the
              present.
            </Text>
            <VStack align="start" gap={3} css={BULLET_LIST_CSS}>
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
              After voting data is processed, the pipeline identifies the bills associated
              with each roll call vote. Each bill is then analyzed using
              multiple Large Language Models (LLMs) to generate summaries,
              classify political categories, and estimate the partisan leaning
              of the bill.
            </Text>
            <VStack align="start" gap={3} css={BULLET_LIST_CSS}>
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
                sources of bias. In the past, the project used gpt-oss-120b,
                gemini-2.5-flash-lite, llama3.3-70b, and qwen-3-32b, and later
                gpt-5-mini. These models were chosen because they were free or
                cheap to use. The default results you'll see now come from
                gpt-6-luna, which was run on the latest political category
                definitions and also scores each bill on nine additional
                ideological axes (beyond the original left-right score) -
                see the Ideological Axes section below. Older model runs
                remain available for comparison via the model selector. As the
                project advances, more powerful, expensive models will be used.
              </Text>
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              Calculating Legislator Ideology Scores
            </Heading>
            <Text>
              Legislator profiles are generated for each AI model used. Major
              political categories receive an ideology score from every analyzed
              bill a legislator voted on. Legislator profile pages treat a
              category as having insufficient data unless it has more than 10
              bills.
            </Text>
            <VStack align="start" gap={3} css={BULLET_LIST_CSS}>
              <Text>
                • <strong>Weighted Score Calculation:</strong> For each vote, the platform
                multiplies the bill's partisan score x impact score x vote
                direction (1 for Yea, -1 for Nay) to create a weighted score
                that captures both the political leaning and significance of the
                legislator's position. If a legislator does not vote, they do
                not receive a score for that bill.
              </Text>
              <Text>
                • <strong>Category Aggregation:</strong> Bills are classified
                into primary categories and subcategories by the AI model. For
                each category, the platform averages all weighted scores from the
                legislator's votes to produce an average ranging from -1 (most
                liberal) to +1 (most conservative).
              </Text>
              <Text>
                • <strong>Bayesian Weighting:</strong> Each primary category
                average is then pulled toward the average score of the
                legislator's party to produce the final ideology score.
                Legislators without a Democratic or Republican party average are
                pulled toward 0 instead. The fewer bills a legislator has in a
                category, the stronger the pull, so a score based on many bills
                stays close to the legislator's own average.
              </Text>
              <Text>
                • <strong>Ranking System:</strong> Each legislator receives both
                an overall rank and percentile rank within each category and
                axis, comparing them against all legislators in the dataset.
                Current members also receive separate rankings comparing them
                only against other currently serving legislators.
              </Text>
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              Ideological Axes
            </Heading>
            <Text>
              Categories describe the topic of a bill, while axes describe
              viewpoints that cut across topics. Eleven axes are currently
              available, and only gpt-6-luna results include them. Each axis is
              defined in the glossary.
            </Text>
            <VStack align="start" gap={3} css={BULLET_LIST_CSS}>
              <Text>
                • <strong>LLM-Scored Axes:</strong> In a separate pass, the LLM
                scores bills on nine axes: Economic System, Fiscal, State Power,
                Social, Security Posture, Trade, Global Engagement, Branch Power,
                and Federalism. For each axis a bill meaningfully engages, it
                rates the direction a YES vote pushes, from -1 to 1, and how
                central the axis is to the bill, from 0 to 1. A legislator's
                score is the average of position x relevance x vote direction
                across their votes, followed by the same Bayesian weighting used
                for categories.
              </Text>
              <Text>
                • <strong>Left-Right:</strong> This axis is not scored separately
                by the LLM. It is derived from the partisan and impact scores of
                each bill's primary categories.
              </Text>
              <Text>
                • <strong>Institutional:</strong> This axis is computed from roll
                call votes without an LLM. It is a weighted measure of how often
                a legislator votes against their party's leadership, from -1
                (Establishment) to +1 (Insurgent). Unlike the other axes, it
                uses every roll call rather than only analyzed bills, and it does
                not use Bayesian weighting.
              </Text>
              <Text>
                • <strong>Comparison Scales:</strong> The Political Compass and
                legislator profiles can show axis scores in three ways. "Vs.
                chamber" and "Vs. own party" show how many standard deviations a
                legislator is from the average of that group, while "Raw" shows
                the original score from -1 to +1. Legislators need at least 10
                bills on an axis to count toward these comparison statistics.
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
            <VStack align="start" gap={3} css={BULLET_LIST_CSS}>
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
                law of large numbers. To adjust for this, Bayesian weighting now
                pulls scores with low bill counts toward the legislator's party
                average. One tradeoff is that a legislator with few votes in a
                category can appear closer to their party than those votes alone
                would suggest.
              </Text>
              <Text>
                • <strong>Data Reliability and Sanity Checking:</strong> Large
                Language Model outputs are notoriously unreliable and can vary
                significantly based on prompt phrasing, model choice, and even
                random seed. Therefore, it is crucial to continuously sanity
                check outputs against known data points and expected behaviors.
                The pipeline now validates the format of LLM responses and
                includes a script that checks axis scores against known
                cross-party votes, correlations between axes, and agreement
                between models. These checks do not verify each individual LLM
                output. In the future, more robust validation
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
                observation from earlier models is that conservative legislators
                had a larger spread while liberal legislators clumped together on
                many categories. In gpt-6-luna's overall left-right scores, that
                wider spread appears in the Senate but not in the House. Further
                analysis must be done to fully understand
                why this is happening, and whether or not it is a fault of the
                LLMs, or the true nature of political stances today. In the
                future, more LLMs will be used, and we'll see if the pattern
                holds. Because the training data of these LLMs cannot be controlled,
                it is impossible to fully eliminate bias, but the project aims to
                minimize it by using multiple models and consolidating results.
                However, due to the nature of LLMs being a product of human
                output over the years, it is expected that some bias will
                always exist.
              </Text>
              <Text>
                • <strong>Hopes for the Future of This Project:</strong> The
                goal of this project will always be to provide accurate insight
                into the political stances of U.S. legislators. As AI continues
                to improve, the project aims to leverage more advanced models and
                techniques to refine its analyses. Additionally, expanding the
                dataset to include more types of legislative actions and
                exploring new methodologies for scoring will be key areas of
                focus moving forward. The hope is that this project will
                inspire you to think carefully and critically about the
                positions of the legislators who represent you.
              </Text>
            </VStack>
          </VStack>
        </Tabs.Content>

        {/* Glossary Tab */}
        <Tabs.Content value="glossary">
          <VStack gap={4} align="start">
            <Heading as="h1" size="3xl" letterSpacing="tight">
              Glossary
            </Heading>

            <Text fontSize="lg" color="textMuted">
              Key terms and metrics used throughout the United States Political
              Stance Tracker.
            </Text>

            <Separator />

            <Heading as="h2" size="lg">
              Scoring Metrics
            </Heading>
            <VStack align="start" gap={6} w="full" css={GLOSSARY_TERMS_CSS}>
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
                  ideological scores, pulled toward the average of the
                  legislator's party when they have few bills in that category.
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
                  An AI-generated measure of how closely a political category in
                  a bill aligns with liberal or conservative views, based on the
                  bill's summary and legislative subjects.
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
                  <Text fontWeight="bold">Congress</Text>
                  <Text>
                    A two-year term of the legislature, numbered sequentially
                    (e.g., 113th Congress: 2013-2014). Each Congress usually has
                    two sessions.
                  </Text>
                </Box>
              </VStack>
            </VStack>

            <Separator />

            <Heading as="h2" size="lg">
              Ideological Axes
            </Heading>
            <Text fontSize="md" mb={2}>
              Axes describe viewpoints that cut across political categories.
              Each axis runs between two poles, from -1 to +1.
            </Text>

            <VStack align="start" gap={4} w="full">
              {POLITICAL_AXES.map((axis) => (
                <Box
                  key={axis.id}
                  w="full"
                  p={5}
                  bg="surface"
                  borderWidth="1px"
                  borderColor="border"
                  rounded="card"
                  boxShadow="card"
                >
                  <Text fontWeight="bold" fontSize="lg" mb={2}>{axis.name}</Text>
                  {/* Left-Right's definitions name raw fields like liberal_view */}
                  <Text fontSize="sm" color="textMuted">
                    <strong>-1 {axis.negative_pole.label}:</strong> {axis.negative_pole.description.replace("_view", " view")}
                  </Text>
                  <Text fontSize="sm" color="textMuted">
                    <strong>+1 {axis.positive_pole.label}:</strong> {axis.positive_pole.description.replace("_view", " view")}
                  </Text>
                </Box>
              ))}
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

            <VStack align="start" gap={4} w="full">
              {POLITICAL_CATEGORIES.map((category, idx) => (
                <Box
                  key={idx}
                  w="full"
                  p={5}
                  bg="surface"
                  borderWidth="1px"
                  borderColor="border"
                  rounded="card"
                  boxShadow="card"
                >
                  <Text fontWeight="bold" fontSize="lg">{category.name}</Text>
                  <Text mb={2}>{category.scope}</Text>
                  <Text fontSize="sm" color="textMuted" mt={1}>
                    <strong>Conservative view:</strong> {category.conservative_view}
                  </Text>
                  <Text fontSize="sm" color="textMuted" mb={3}>
                    <strong>Liberal view:</strong> {category.liberal_view}
                  </Text>

                  {/* Subcategories Rendering */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <Box pl={4} borderLeft="2px solid" borderColor="border" mt={4}>
                      <Text fontWeight="semibold" fontSize="sm" mb={3} color="textMuted" textTransform="uppercase" letterSpacing="wide">
                        Subcategories
                      </Text>
                      <VStack align="start" gap={4}>
                        {category.subcategories.map((sub, sIdx) => (
                          <Box key={sIdx}>
                            <Text fontWeight="bold" fontSize="sm">{sub.name}</Text>
                            <Text fontSize="sm" mb={1}>{sub.scope}</Text>
                            <Text fontSize="xs" color="textMuted" mt={1}>
                              <strong>Conservative:</strong> {sub.conservative_view}
                            </Text>
                            <Text fontSize="xs" color="textMuted">
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
    </Container>
  );
}
