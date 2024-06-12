const logTypeToEnv = {
  alerts: process.env.ZLICX_SLACK_HOOK_ALERTS,
  cron: process.env.ZLICX_SLACK_HOOK_CRON,
  links: process.env.ZLICX_SLACK_HOOK_LINKS,
  subscribers: process.env.ZLICX_SLACK_HOOK_SUBSCRIBERS,
  errors: process.env.ZLICX_SLACK_HOOK_ERRORS,
};

export const log = async ({
  message,
  type,
  mention = false,
}: {
  message: string;
  type: "alerts" | "cron" | "links" | "subscribers" | "errors";
  mention?: boolean;
}) => {
  if (
    process.env.NODE_ENV === "development" ||
    !process.env.ZLICX_SLACK_HOOK_ALERTS ||
    !process.env.ZLICX_SLACK_HOOK_CRON ||
    !process.env.ZLICX_SLACK_HOOK_LINKS ||
    !process.env.ZLICX_SLACK_HOOK_SUBSCRIBERS ||
    !process.env.ZLICX_SLACK_HOOK_ERRORS
  ) {
    console.log(message);
  }
  /* Log a message to the console */
  const HOOK = logTypeToEnv[type];
  if (!HOOK) return;
  try {
    return await fetch(HOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              // prettier-ignore
              text: `${mention ? "<@U0404G6J3NJ> " : ""}${(type === "alerts" || type === "errors") ? ":alert: " : ""}${message}`,
            },
          },
        ],
      }),
    });
  } catch (e) {
    console.log(`Failed to log to Zlicx Slack. Error: ${e}`);
  }
};
