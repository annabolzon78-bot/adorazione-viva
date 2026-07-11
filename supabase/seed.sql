-- ============================================================
-- SEED — DATI DEMO
-- ⚠️  Questi dati sono SOLO per sviluppo e test.
--     NON applicare in produzione.
-- ============================================================

-- Paesi principali
INSERT INTO public.countries (code, name_it, name_en, flag_emoji, continent) VALUES
('IT', 'Italia',       'Italy',        '🇮🇹', 'EUROPA'),
('IE', 'Irlanda',      'Ireland',      '🇮🇪', 'EUROPA'),
('FR', 'Francia',      'France',       '🇫🇷', 'EUROPA'),
('PL', 'Polonia',      'Poland',       '🇵🇱', 'EUROPA'),
('ES', 'Spagna',       'Spain',        '🇪🇸', 'EUROPA'),
('PT', 'Portogallo',   'Portugal',     '🇵🇹', 'EUROPA'),
('DE', 'Germania',     'Germany',      '🇩🇪', 'EUROPA'),
('US', 'USA',          'United States','🇺🇸', 'AMERICA_NORD'),
('BR', 'Brasile',      'Brazil',       '🇧🇷', 'AMERICA_SUD'),
('MX', 'Messico',      'Mexico',       '🇲🇽', 'AMERICA_NORD'),
('PH', 'Filippine',    'Philippines',  '🇵🇭', 'ASIA'),
('SG', 'Singapore',    'Singapore',    '🇸🇬', 'ASIA'),
('JP', 'Giappone',     'Japan',        '🇯🇵', 'ASIA'),
('KR', 'Corea del Sud','South Korea',  '🇰🇷', 'ASIA'),
('AU', 'Australia',    'Australia',    '🇦🇺', 'OCEANIA')
ON CONFLICT (code) DO NOTHING;

-- Diocesi demo
INSERT INTO public.dioceses (name, bishop_name, website_url) VALUES
('[DEMO] Diocese of Meath', 'Most Rev. Tom Deenihan', 'https://dioceseofmeath.ie'),
('[DEMO] Diocesi di Roma', 'Papa Francesco', 'https://diocesidiroma.it'),
('[DEMO] Archidiocèse de Paris', 'Mgr Laurent Ulrich', 'https://paris.catholique.fr')
ON CONFLICT DO NOTHING;

-- Parrocchia demo
-- NOTA: l'admin_id e diocese_id devono essere ID reali dopo la creazione utenti
INSERT INTO public.parishes (
  name, slug, description, address, city, country_id,
  lat, lng, email, website_url, status,
  has_adoration, has_confession, has_streaming, is_featured
) VALUES (
  '[DEMO] St Mary''s Parish Navan',
  'demo-st-marys-navan',
  'Parrocchia demo per sviluppo. DATO NON REALE.',
  'Market Square, Navan',
  'Navan',
  (SELECT id FROM public.countries WHERE code = 'IE'),
  53.6551, -6.6831,
  'demo@adorazioneviva.test',
  'https://stmarysnavan.ie',
  'VERIFIED',
  TRUE, TRUE, TRUE, TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Cappella demo
INSERT INTO public.chapels (
  parish_id, name, slug, address, lat, lng,
  adoration_type, is_24h, has_live_stream, is_verified
) VALUES (
  (SELECT id FROM public.parishes WHERE slug = 'demo-st-marys-navan'),
  '[DEMO] Cappella Adorazione — Navan',
  'demo-cappella-adorazione-navan',
  'Market Square, Navan, Co. Meath',
  53.6551, -6.6831,
  'PERPETUAL', TRUE, TRUE, TRUE
) ON CONFLICT DO NOTHING;

-- Stream demo
INSERT INTO public.live_streams (
  parish_id, title, type, url, embed_url, language,
  continent, status, is_default, is_active, is_featured
) VALUES (
  (SELECT id FROM public.parishes WHERE slug = 'demo-st-marys-navan'),
  '[DEMO] Adorazione Perpetua — Cappella 1 Navan',
  'YOUTUBE_LIVE',
  'https://www.youtube.com/watch?v=hMNLrStmcTs',
  'https://www.youtube.com/embed/hMNLrStmcTs?autoplay=1&rel=0&modestbranding=1',
  'EN', 'EUROPA', 'ACTIVE', TRUE, TRUE, TRUE
) ON CONFLICT DO NOTHING;

-- Miracoli demo (3)
INSERT INTO public.eucharistic_miracles (
  slug, title, location, city, country_id, year,
  summary, verification_level, is_visitable_today,
  conserved_at, lat, lng, blood_type, tissue_type,
  analyzed_by, scientific_analysis, status
) VALUES
(
  'demo-lanciano-750',
  '[DEMO] Miracolo Eucaristico di Lanciano',
  'Lanciano', 'Lanciano',
  (SELECT id FROM public.countries WHERE code = 'IT'),
  750,
  '[DEMO] Nel 750 d.C. un monaco basiliano dubitò della presenza reale di Cristo. Durante la Messa, il pane si trasformò visibilmente in carne e il vino in sangue.',
  'SCIENTIFICO', TRUE,
  'Santuario del Miracolo Eucaristico, Lanciano (CH)',
  42.2295, 14.5910,
  'AB', 'Miocardio umano vivo (cuore)',
  'Prof. Odoardo Linoli (1971), Prof. Ruggero Bertelli (1981)',
  '[DEMO] Le analisi scientifiche hanno confermato che la carne è tessuto miocardico umano con gruppo sanguigno AB.',
  'PUBLISHED'
),
(
  'demo-buenos-aires-1996',
  '[DEMO] Miracolo Eucaristico di Buenos Aires',
  'Buenos Aires', 'Buenos Aires',
  (SELECT id FROM public.countries WHERE code = 'BR'),  -- approximation
  1996,
  '[DEMO] Nel 1996 una particola abbandonata si trasformò in tessuto cardiaco sanguinante.',
  'PONTIFICIO', FALSE,
  'Museo Arcidiocesi di Buenos Aires',
  -34.6037, -58.3816,
  'AB', 'Leucociti e miocardio',
  'Dr. Ricardo Castañón Gómez, Università di Buenos Aires',
  '[DEMO] Analisi del DNA confermarono tessuto umano vivo.',
  'PUBLISHED'
),
(
  'demo-sokolka-2008',
  '[DEMO] Miracolo Eucaristico di Sokółka',
  'Sokółka', 'Sokółka',
  (SELECT id FROM public.countries WHERE code = 'PL'),
  2008,
  '[DEMO] Nel 2008 una particola caduta fu messa in acqua e si trasformò in tessuto cardiaco rosso.',
  'SCIENTIFICO', TRUE,
  'Chiesa di Sant''Antonio, Sokółka',
  53.4059, 23.5017,
  'AB', 'Muscolo cardiaco umano',
  'Prof. Maria Sobaniec-Łotowska e Prof. Stanisław Sulkowski (Università di Białystok)',
  '[DEMO] Analisi istologiche confermarono muscolo cardiaco umano in stato agonizzante.',
  'PUBLISHED'
)
ON CONFLICT (slug) DO NOTHING;

-- Categorie preghiere
INSERT INTO public.prayer_categories (name_it, name_en, slug, icon, sort_order) VALUES
('Adorazione',  'Adoration',  'adorazione',  '🙏', 1),
('Suffragio',   'Suffrage',   'suffragio',   '🕊️', 2),
('Riparazione', 'Reparation', 'riparazione', '💛', 3),
('Santi',       'Saints',     'santi',       '✝️', 4),
('Liturgiche',  'Liturgical', 'liturgiche',  '📿', 5)
ON CONFLICT (slug) DO NOTHING;

-- Preghieri base
INSERT INTO public.prayers (category_id, title_it, title_en, body_it, is_public, sort_order) VALUES
(
  (SELECT id FROM public.prayer_categories WHERE slug='adorazione'),
  'Atto di Adorazione',
  'Act of Adoration',
  'O Gesù, vero Dio e vero uomo, presente nel Santissimo Sacramento dell''altare, ti adoro con profonda riverenza. Credo fermamente che sei qui presente. Ti amo sopra ogni cosa e desidero riceverti nella mia anima. Rimani con me, Signore. Amen.',
  TRUE, 1
),
(
  (SELECT id FROM public.prayer_categories WHERE slug='adorazione'),
  'Comunione Spirituale',
  'Spiritual Communion',
  'Gesù mio, credo che sei nel Santissimo Sacramento. Ti amo sopra ogni cosa e ti desidero nell''anima mia. Poiché ora non posso riceverti sacramentalmente, vieni almeno spiritualmente nel mio cuore. Come se già fossi venuto, ti abbraccio e mi unisco tutto a te: non permettere che mi separi da te. Amen.',
  TRUE, 2
),
(
  (SELECT id FROM public.prayer_categories WHERE slug='suffragio'),
  'Per le Anime del Purgatorio',
  'For the Souls in Purgatory',
  'Signore Gesù, presente in questo Santissimo Sacramento, ti offro quest''ora di adorazione a suffragio delle Anime del Purgatorio. Esse non possono pregare per sé stesse: la mia preghiera sia la loro voce davanti a te. Dona loro il riposo eterno, e splenda ad essi la luce perpetua. Riposino in pace. Amen.',
  TRUE, 1
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- FINE SEED DEMO
-- ============================================================
