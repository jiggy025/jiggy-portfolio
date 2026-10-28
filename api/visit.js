export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    // Graceful exit if webhook is not configured yet
    return res.status(200).json({ ok: true, notice: 'DISCORD_WEBHOOK_URL not configured' });
  }

  try {
    const { path = '/', referrer = 'Direct / Bookmark', screen = 'Unknown' } = req.body || {};

    // Extract geo headers automatically populated by Vercel's Edge/Serverless network
    const country = req.headers['x-vercel-ip-country'] || 'Unknown';
    const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Simple bot filter
    const isBot = /bot|crawl|spider|slurp|facebookexternalhit|bingpreview/i.test(userAgent);
    if (isBot) {
      return res.status(200).json({ ok: true, skipped: 'bot' });
    }

    const payload = {
      username: 'Portfolio Visitor Alert',
      avatar_url: 'https://jiggy-portfolio.vercel.app/favicon.svg',
      embeds: [
        {
          title: '👀 New Portfolio Visitor',
          color: 0x2563eb, // Cobalt blue matching portfolio
          fields: [
            {
              name: '📄 Page',
              value: `\`${path}\``,
              inline: true
            },
            {
              name: '🌍 Location',
              value: `${city}, ${country}`,
              inline: true
            },
            {
              name: '🔗 Referrer',
              value: referrer === '' ? 'Direct / Bookmark' : referrer,
              inline: false
            },
            {
              name: '📱 Device / Screen',
              value: screen,
              inline: true
            }
          ],
          footer: {
            text: 'jiggy-portfolio.vercel.app'
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      return res.status(500).json({ error: 'Discord webhook error', details: errText });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}
