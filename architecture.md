{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # \uc0\u23436 \u25972 \u26550 \u26500 \u35774 \u35745 \u25991 \u26723 \
\
## \uc0\u20135 \u21697 \u30446 \u26631 \
\uc0\u26412 \u20135 \u21697 \u26159 \u19968 \u20010  **\u22522 \u20110 \u24773 \u32490  ABC \u29702 \u35770 \u30340 \u24773 \u32490 \u21672 \u35810 \u24072 \u35821 \u35328 \u27169 \u22411 \u32593 \u31449 **\u65292 \u26680 \u24515 \u29702 \u24565 \u26159 \u36890 \u36807 \u31185 \u23398 \u30340 \u35748 \u30693 \u34892 \u20026 \u24178 \u39044 \u25216 \u26415 \u65292 \u24110 \u21161 \u29992 \u25143 \u35782 \u21035 \u24773 \u32490 \u32972 \u21518 \u30340 \u19981 \u21512 \u29702 \u20449 \u24565 \u65292 \u23454 \u29616 \u24773 \u32490 \u33258 \u25105 \u31649 \u29702 \u12290   \
\
\uc0\u20027 \u35201 \u20215 \u20540 \u65306   \
- **\uc0\u31185 \u23398 \u24615 **\u65306 \u22522 \u20110 \u22467 \u21033 \u26031  ABC \u29702 \u35770 \u65292 \u25552 \u20379 \u26377 \u24515 \u29702 \u23398 \u25903 \u25745 \u30340 \u24178 \u39044   \
- **\uc0\u21487 \u21450 \u24615 **\u65306 24 \u23567 \u26102  AI \u26381 \u21153   \
- **\uc0\u36731 \u37327 \u21270 **\u65306 \u21333 \u27425 \u20351 \u29992 \u20165 \u38656  5\'9610 \u20998 \u38047 \u65292 \u34701 \u20837 \u26085 \u24120 \u29983 \u27963   \
- **\uc0\u25968 \u25454 \u39537 \u21160 **\u65306 \u36890 \u36807 \u29992 \u25143 \u25968 \u25454 \u24314 \u31435 \u20010 \u24615 \u21270 \u24178 \u39044 \u27169 \u22411   \
\
---\
\
## \uc0\u25216 \u26415 \u26632 \
- \uc0\u21069 \u31471 \u65306 Next.js + TypeScript + Tailwind CSS  \
- \uc0\u29366 \u24577 \u31649 \u29702 \u65306 React Context \u25110  Zustand  \
- \uc0\u21518 \u31471 \u65306 Next.js API Routes / Edge Functions  \
- \uc0\u25968 \u25454 \u24211 \u19982 \u29992 \u25143 \u35748 \u35777 \u65306 Supabase\u65288 Postgres + Auth + Storage + Realtime\u65289   \
- \uc0\u25903 \u20184 \u65306 Stripe\u65288 Checkout + Subscriptions\u65289   \
- AI \uc0\u27169 \u22411 \u65306 OpenAI \u25110 \u20854 \u20182  LLM API\u65288 \u36890 \u36807 \u21518 \u31471 \u20195 \u29702 \u35843 \u29992 \u65289   \
- \uc0\u32531 \u23384 \u65288 \u21487 \u36873 \u65289 \u65306 Redis\u65288 rate limiting\u12289 \u20020 \u26102 \u29366 \u24577 \u23384 \u20648 \u65289   \
- \uc0\u37096 \u32626 \u65306 Vercel\u65288 \u21069 \u31471  + API\u65289  + Supabase Cloud + Stripe  \
- \uc0\u30417 \u25511 \u65306 Sentry\u65288 \u38169 \u35823 \u65289 \u65292 Datadog \u25110  Grafana\u65288 \u24615 \u33021 \u30417 \u25511 \u65289   \
\
---\
\
## \uc0\u25991 \u20214 \u19982 \u25991 \u20214 \u22841 \u32467 \u26500 \
- /my-emotion-ai-app  \
  - /app  \
    - /(auth)  \
      - login/page.tsx  \
      - signup/page.tsx  \
    - /chat  \
      - page.tsx  \
      - components/  \
        - ChatWindow.tsx  \
        - MessageBubble.tsx  \
        - EmotionVisualizer.tsx  \
    - /pricing/page.tsx  \
    - /onboarding/page.tsx  \
    - layout.tsx  \
  - /components\uc0\u65288 \u21487 \u22797 \u29992  UI \u32452 \u20214 \u65289   \
  - /lib  \
    - supabaseClient.ts\uc0\u65288 Supabase \u23553 \u35013 \u65289   \
    - ai.ts\uc0\u65288 AI \u35831 \u27714 \u23553 \u35013 \u65292 \u25903 \u25345 \u27969 \u24335 \u65289   \
    - stripe.ts\uc0\u65288 Stripe helpers\u65289   \
    - validators.ts\uc0\u65288 \u36755 \u20837 \u26657 \u39564 \u65289   \
  - /hooks  \
    - useConversation.ts\uc0\u65288 \u21069 \u31471 \u23545 \u35805 \u29366 \u24577 \u31649 \u29702 \u65289   \
    - useAuth.ts\uc0\u65288 \u35748 \u35777 \u29366 \u24577 \u31649 \u29702 \u65289   \
  - /pages/api  \
    - /ai/stream.ts\uc0\u65288 AI \u35843 \u29992 \u20195 \u29702 \u65289   \
    - /webhooks/stripe.ts\uc0\u65288 Stripe webhook\u65289   \
    - /auth/callback.ts\uc0\u65288 \u35748 \u35777 \u22238 \u35843 \u65289   \
    - /billing/create-checkout.ts\uc0\u65288 \u21019 \u24314 \u25903 \u20184 \u65289   \
  - /styles\uc0\u65288 \u20840 \u23616 \u26679 \u24335 \u65289   \
  - /scripts/db-migrations.sql\uc0\u65288 \u25968 \u25454 \u24211 \u36801 \u31227 \u33050 \u26412 \u65289   \
  - /migrations\uc0\u65288 \u25968 \u25454 \u24211 \u29256 \u26412 \u31649 \u29702 \u65289   \
  - /types/index.d.ts\uc0\u65288 \u31867 \u22411 \u23450 \u20041 \u65289   \
  - .env.local\uc0\u65288 \u29615 \u22659 \u21464 \u37327 \u65289   \
  - next.config.js  \
  - README.md  \
\
---\
\
## \uc0\u21508 \u37096 \u20998 \u20316 \u29992 \u35828 \u26126 \
- \uc0\u21069 \u31471 \u65288 Next.js\u65289 \u65306 \u29992 \u25143 \u30028 \u38754 \u12289 \u23545 \u35805 \u31383 \u21475 \u12289 \u29366 \u24577 \u23384 \u20648 \u12289 \u35843 \u29992  API  \
- /lib\uc0\u65306 \u24037 \u20855 \u24211 \u65292 \u32479 \u19968 \u23553 \u35013  Supabase\u12289 AI\u12289 Stripe \u30340 \u35843 \u29992 \u36923 \u36753   \
- API Routes\uc0\u65306 \u22788 \u29702  AI \u35843 \u29992 \u12289 \u25903 \u20184 \u12289 webhook\u12289 \u29992 \u25143 \u25968 \u25454 \u21516 \u27493   \
- \uc0\u25968 \u25454 \u24211 \u65288 Supabase\u65289 \u65306 \u23384 \u20648 \u29992 \u25143 \u12289 \u20250 \u35805 \u12289 \u28040 \u24687 \u12289 \u24773 \u32490 \u20107 \u20214 \u12289 \u35746 \u38405 \u29366 \u24577   \
- \uc0\u25903 \u20184 \u65288 Stripe\u65289 \u65306 \u25552 \u20379 \u35746 \u38405 \u19982 \u20184 \u36153 \u33021 \u21147   \
- \uc0\u23433 \u20840 \u23618 \u65306 Supabase RLS\u65288 \u34892 \u32423 \u26435 \u38480 \u25511 \u21046 \u65289 \u12289 Webhook \u31614 \u21517 \u26657 \u39564   \
\
---\
\
## \uc0\u25968 \u25454 \u24211 \u35774 \u35745 \
- **profiles**  \
  - id (uuid, \uc0\u20027 \u38190 , \u20851 \u32852  auth.users)  \
  - display_name (text)  \
  - timezone (text)  \
  - created_at (timestamptz)  \
  - metadata (jsonb)  \
\
- **conversations**  \
  - id (uuid, \uc0\u20027 \u38190 )  \
  - user_id (uuid, \uc0\u20851 \u32852  profiles.id)  \
  - title (text)  \
  - status (text: active | ended)  \
  - created_at (timestamptz)  \
  - last_interaction (timestamptz)  \
\
- **messages**  \
  - id (uuid, \uc0\u20027 \u38190 )  \
  - conversation_id (uuid, \uc0\u20851 \u32852  conversations.id)  \
  - role (text: user | assistant)  \
  - content (text)  \
  - tokens (int)  \
  - created_at (timestamptz)  \
\
- **emotion_events**  \
  - id (uuid, \uc0\u20027 \u38190 )  \
  - user_id (uuid, \uc0\u20851 \u32852  profiles.id)  \
  - conversation_id (uuid)  \
  - event_text (text)  \
  - belief_text (text)  \
  - emotion_label (text)  \
  - intensity (numeric)  \
  - created_at (timestamptz)  \
\
- **subscriptions**  \
  - id (serial, \uc0\u20027 \u38190 )  \
  - user_id (uuid, \uc0\u20851 \u32852  profiles.id)  \
  - stripe_customer_id (text)  \
  - stripe_subscription_id (text)  \
  - status (text)  \
  - tier (text)  \
  - current_period_end (timestamptz)  \
  - created_at (timestamptz)  \
\
---\
\
## \uc0\u29366 \u24577 \u23384 \u20648 \u20301 \u32622 \
- \uc0\u30701 \u26399 \u29366 \u24577 \u65306 \u21069 \u31471 \u20869 \u23384 \u65288 React Context/Zustand\u65289 \u65292 \u23384 \u20648 \u20020 \u26102 \u23545 \u35805 \u28040 \u24687   \
- \uc0\u25345 \u20037 \u21270 \u29366 \u24577 \u65306 Supabase\u65288 conversations\u12289 messages\u12289 emotion_events \u34920 \u65289   \
- \uc0\u35748 \u35777 \u29366 \u24577 \u65306 Supabase Auth\u65288 JWT\u65289   \
- \uc0\u35746 \u38405 \u29366 \u24577 \u65306 Supabase subscriptions \u34920 \u65288 \u21516 \u27493  Stripe \u25968 \u25454 \u65289   \
- \uc0\u32531 \u23384 \u65288 \u21487 \u36873 \u65289 \u65306 Redis\u65292 \u29992 \u20110 \u36895 \u29575 \u38480 \u21046 \u21644 \u30701 \u26399  session  \
\
---\
\
## \uc0\u26381 \u21153 \u20132 \u20114 \u27969 \u31243 \
### \uc0\u29992 \u25143 \u30331 \u24405 \
1. \uc0\u29992 \u25143 \u36890 \u36807  Supabase Auth \u30331 \u24405   \
2. Supabase \uc0\u36820 \u22238  JWT  \
3. \uc0\u21069 \u31471 \u20351 \u29992  JWT \u35843 \u29992 \u21463 \u20445 \u25252  API  \
\
### \uc0\u23545 \u35805 \u27969 \u31243 \
1. \uc0\u29992 \u25143 \u36755 \u20837 \u20107 \u20214  \u8594  \u21069 \u31471 \u35843 \u29992  `/api/ai/stream`  \
2. API \uc0\u26657 \u39564  JWT \u8594  \u35843 \u29992  AI \u27169 \u22411 \u65288 \u24102  ABC Prompt\u65289   \
3. AI \uc0\u27969 \u24335 \u36820 \u22238 \u32467 \u26524  \u8594  \u21069 \u31471 \u23637 \u31034  \u8594  \u25968 \u25454 \u20889 \u20837  Supabase  \
4. \uc0\u29992 \u25143 \u30830 \u35748 \u20449 \u24565 /\u24773 \u32490  \u8594  \u20889 \u20837  emotion_events  \
\
### \uc0\u25903 \u20184 \u27969 \u31243 \
1. \uc0\u29992 \u25143 \u28857 \u20987 \u21319 \u32423  \u8594  \u21069 \u31471 \u35843 \u29992  `/api/billing/create-checkout`  \
2. \uc0\u21518 \u31471 \u35843 \u29992  Stripe API \u21019 \u24314  Checkout Session \u8594  \u36820 \u22238  URL  \
3. \uc0\u29992 \u25143 \u23436 \u25104 \u25903 \u20184  \u8594  Stripe \u35843 \u29992  `/api/webhooks/stripe`  \
4. Webhook \uc0\u26657 \u39564 \u31614 \u21517  \u8594  \u26356 \u26032  Supabase subscriptions \u34920   \
\
---\
\
## \uc0\u23433 \u20840 \u19982 \u21512 \u35268 \
- \uc0\u25968 \u25454 \u35775 \u38382 \u25511 \u21046 \u65306 Supabase Row-Level Security\u65288 RLS\u65289   \
- Webhook \uc0\u26657 \u39564 \u65306 \u39564 \u35777  Stripe \u31614 \u21517 \u65292 \u38450 \u27490 \u20266 \u36896 \u35831 \u27714   \
- \uc0\u36895 \u29575 \u38480 \u21046 \u65306 \u38450 \u27490 \u28389 \u29992  AI \u25509 \u21475   \
- \uc0\u25968 \u25454 \u38544 \u31169 \u65306 \u29992 \u25143 \u21487 \u35831 \u27714 \u21024 \u38500 \u25968 \u25454 \u65292 \u31526 \u21512  GDPR \u35201 \u27714   \
- \uc0\u21361 \u26426 \u39044 \u26696 \u65306 \u26816 \u27979 \u21040 \u33258 \u20260 /\u26292 \u21147 \u20851 \u38190 \u35789 \u26102 \u65292 \u36820 \u22238 \u32039 \u24613 \u36164 \u28304 \u20449 \u24687   \
- \uc0\u20813 \u36131 \u22768 \u26126 \u65306 \u22768 \u26126  AI \u19981 \u26159 \u20020 \u24202 \u24515 \u29702 \u21672 \u35810   \
\
---\
\
## \uc0\u29615 \u22659 \u21464 \u37327 \
- NEXT_PUBLIC_SUPABASE_URL  \
- NEXT_PUBLIC_SUPABASE_ANON_KEY  \
- SUPABASE_SERVICE_ROLE_KEY  \
- OPENAI_API_KEY  \
- STRIPE_SECRET_KEY  \
- STRIPE_WEBHOOK_SECRET  \
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  \
\
---\
\
## \uc0\u25193 \u23637 \u19982 \u36816 \u32500 \
- MVP \uc0\u38454 \u27573 \u65306 \u21482 \u20351 \u29992  Supabase + Stripe\u65292 AI \u35843 \u29992 \u30001 \u21518 \u31471 \u20195 \u29702   \
- \uc0\u20013 \u26399 \u65306 \u21551 \u29992  pgvector \u20570 \u20010 \u24615 \u21270 \u26816 \u32034 \u65307 \u32771 \u34385  Redis \u32531 \u23384   \
- \uc0\u25104 \u29087 \u26399 \u65306 AI \u26381 \u21153 \u29420 \u31435 \u21270 \u65292 \u25903 \u25345  AB \u27979 \u35797 \u19982 \u20010 \u24615 \u21270 \u25512 \u33616   \
- \uc0\u30417 \u25511 \u19982 \u22791 \u20221 \u65306 Sentry\u12289 Datadog\u12289 Supabase \u24555 \u29031 \u22791 \u20221   \
}