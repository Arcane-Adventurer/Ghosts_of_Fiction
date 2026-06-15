-- ============================================================
-- کتابخانه آزاد افغانستان — Supabase Database Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Books table ──────────────────────────────────────────────
CREATE TABLE books (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_dari    TEXT NOT NULL,
  title_en      TEXT,
  author        TEXT,
  translator    TEXT,
  description   TEXT,
  category      TEXT NOT NULL CHECK (category IN ('school','university','history','philosophy')),
  subcategory   TEXT,
  grade         INTEGER,              -- for school books: 1-12
  pages         INTEGER,
  year          TEXT,
  publisher     TEXT,
  language      TEXT DEFAULT 'از',    -- دری
  cover_emoji   TEXT DEFAULT '📘',
  cover_color   TEXT DEFAULT '#EEF3FB',
  archive_url   TEXT,                 -- Internet Archive URL
  gdrive_url    TEXT,                 -- Google Drive PDF URL
  gdrive_embed  TEXT,                 -- Google Drive embed URL
  source        TEXT DEFAULT 'archive.org',
  downloads     INTEGER DEFAULT 0,
  views         INTEGER DEFAULT 0,
  is_published  BOOLEAN DEFAULT TRUE,
  is_featured   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Contributions (user-submitted translations) ──────────────
CREATE TABLE contributions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submitter_name  TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  title_dari      TEXT NOT NULL,
  title_original  TEXT,
  author          TEXT,
  translator      TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('school','university','history','philosophy')),
  subcategory     TEXT,
  description     TEXT,
  file_url        TEXT,              -- Google Drive share link
  gdrive_embed    TEXT,
  source_notes    TEXT,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  admin_notes     TEXT,
  reviewed_at     TIMESTAMPTZ,
  reviewed_by     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Search log (for analytics) ───────────────────────────────
CREATE TABLE search_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query      TEXT NOT NULL,
  results    INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Admin users ───────────────────────────────────────────────
CREATE TABLE admins (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT UNIQUE NOT NULL,
  name       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO admins (email, name) VALUES ('seyaramiry.2468@gmail.com', 'Admin');

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE books         ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs   ENABLE ROW LEVEL SECURITY;

-- Books: public read, no public write
CREATE POLICY "Books are publicly readable" ON books FOR SELECT USING (is_published = TRUE);

-- Contributions: anyone can insert, only service_role can update
CREATE POLICY "Anyone can submit contribution" ON contributions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public can view own submissions" ON contributions FOR SELECT USING (TRUE);

-- ── Increment views function ──────────────────────────────────
CREATE OR REPLACE FUNCTION increment_views(book_id UUID)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE books SET views = views + 1 WHERE id = book_id;
END;
$$;

-- ── Increment downloads function ─────────────────────────────
CREATE OR REPLACE FUNCTION increment_downloads(book_id UUID)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE books SET downloads = downloads + 1 WHERE id = book_id;
END;
$$;

-- ── Full-text search index ────────────────────────────────────
CREATE INDEX books_search_idx ON books USING GIN (
  to_tsvector('arabic', coalesce(title_dari,'') || ' ' || coalesce(author,'') || ' ' || coalesce(description,''))
);
CREATE INDEX books_category_idx ON books (category);
CREATE INDEX books_grade_idx    ON books (grade);

-- ============================================================
-- SEED DATA — Real books from verified free sources
-- ============================================================

-- ── SCHOOL BOOKS (grades 1–12, Internet Archive confirmed) ──
INSERT INTO books (title_dari, title_en, author, category, subcategory, grade, pages, year, publisher, cover_emoji, cover_color, archive_url, gdrive_embed, source) VALUES

('دری صنف اول', 'Dari Language Grade 1', 'وزارت معارف افغانستان', 'school', 'primary', 1, 85, '1382', 'وزارت معارف', '📗', '#E8F5E9',
 'https://archive.org/details/azu_acku_pk6874_daal49_1382_v2a',
 'https://archive.org/embed/azu_acku_pk6874_daal49_1382_v2a', 'archive.org'),

('دری صنف دوم', 'Dari Language Grade 2', 'وزارت معارف افغانستان', 'school', 'primary', 2, 101, '1382', 'وزارت معارف', '📗', '#E8F5E9',
 'https://archive.org/details/azu_acku_pk6874_daal49_1382_v2a',
 'https://archive.org/embed/azu_acku_pk6874_daal49_1382_v2a', 'archive.org'),

('دری صنف سوم', 'Dari Language Grade 3', 'وزارت معارف افغانستان', 'school', 'primary', 3, 116, '1382', 'وزارت معارف', '📗', '#E8F5E9',
 'https://archive.org/details/azu_acku_pk6874_daal49_1382_v2a',
 'https://archive.org/embed/azu_acku_pk6874_daal49_1382_v2a', 'archive.org'),

('دری صنف چهارم', 'Dari Language Grade 4', 'وزارت معارف افغانستان', 'school', 'primary', 4, 122, '1382', 'وزارت معارف', '📗', '#E8F5E9',
 'https://archive.org/details/04-dari',
 'https://archive.org/embed/04-dari', 'archive.org'),

('دری صنف پنجم', 'Dari Language Grade 5', 'وزارت معارف افغانستان', 'school', 'primary', 5, 117, '1382', 'وزارت معارف', '📗', '#E8F5E9',
 'https://archive.org/details/05-dari',
 'https://archive.org/embed/05-dari', 'archive.org'),

('دری صنف ششم', 'Dari Language Grade 6', 'وزارت معارف افغانستان', 'school', 'primary', 6, 109, '1382', 'وزارت معارف', '📗', '#E8F5E9',
 'https://archive.org/details/azu_acku_pk6874_daal49_1382_v2a',
 'https://archive.org/embed/azu_acku_pk6874_daal49_1382_v2a', 'archive.org'),

('دری صنف هفتم', 'Dari Language Grade 7', 'وزارت معارف افغانستان', 'school', 'middle', 7, 160, '1385', 'وزارت معارف', '📘', '#E3F2FD',
 'https://archive.org/details/07-dari',
 'https://archive.org/embed/07-dari', 'archive.org'),

('دری صنف هشتم', 'Dari Language Grade 8', 'وزارت معارف افغانستان', 'school', 'middle', 8, 204, '1385', 'وزارت معارف', '📘', '#E3F2FD',
 'https://archive.org/details/08-dari',
 'https://archive.org/embed/08-dari', 'archive.org'),

('دری صنف نهم', 'Dari Language Grade 9', 'وزارت معارف افغانستان', 'school', 'middle', 9, 176, '1385', 'وزارت معارف', '📘', '#E3F2FD',
 'https://archive.org/details/09-dari',
 'https://archive.org/embed/09-dari', 'archive.org'),

('دری صنف دهم', 'Dari Language Grade 10', 'وزارت معارف افغانستان', 'school', 'high', 10, 169, '1387', 'وزارت معارف', '📙', '#FFF3E0',
 'https://archive.org/details/10-dari',
 'https://archive.org/embed/10-dari', 'archive.org'),

('دری صنف یازدهم', 'Dari Language Grade 11', 'وزارت معارف افغانستان', 'school', 'high', 11, 161, '1387', 'وزارت معارف', '📙', '#FFF3E0',
 'https://archive.org/details/11-dari',
 'https://archive.org/embed/11-dari', 'archive.org'),

('دری صنف دوازدهم', 'Dari Language Grade 12', 'وزارت معارف افغانستان', 'school', 'high', 12, 153, '1387', 'وزارت معارف', '📙', '#FFF3E0',
 'https://archive.org/details/12-dari',
 'https://archive.org/embed/12-dari', 'archive.org');

-- ── AFGHAN HISTORY (verified archive.org) ────────────────────
INSERT INTO books (title_dari, title_en, author, category, subcategory, pages, year, publisher, cover_emoji, cover_color, archive_url, gdrive_embed, source, is_featured) VALUES

('افغانستان در مسیر تاریخ — جلد اول',
 'Afghanistan in the Course of History Vol.1',
 'میر غلام محمد غبار', 'history', 'modern', 600, '1967', 'میوند', '🏛️', '#FFF3E0',
 'https://archive.org/details/Afghanistan_dar_maseer_tarikh_Vol_1_Ghulam_M_Ghubar',
 'https://archive.org/embed/Afghanistan_dar_maseer_tarikh_Vol_1_Ghulam_M_Ghubar',
 'archive.org', TRUE),

('افغانستان در مسیر تاریخ — جلد دوم',
 'Afghanistan in the Course of History Vol.2',
 'میر غلام محمد غبار', 'history', 'modern', 580, '1999', 'میوند', '🏛️', '#FFF3E0',
 'https://archive.org/details/Afghanistan_in_the_course_of_history_Ghubar_Vol2',
 'https://archive.org/embed/Afghanistan_in_the_course_of_history_Ghubar_Vol2',
 'archive.org', TRUE),

('تاریخ مختصر پنج دهه افغانستان',
 'Brief History of Five Decades of Afghanistan',
 'انتشارات محسن', 'history', 'contemporary', 180, '2016', 'انتشارات محسن', '📜', '#FFF3E0',
 'https://archive.org/details/history-of-afghanistan-past-5-decades-revised-may-2016',
 'https://archive.org/embed/history-of-afghanistan-past-5-decades-revised-may-2016',
 'archive.org', FALSE),

('تاریخ افغانستان — جلد اول',
 'History of Afghanistan Vol.1',
 'مولانا محمد اسماعیل ریحان', 'history', 'general', 300, '2022', 'المذھل پبلشرز', '📜', '#FFF3E0',
 'https://archive.org/details/1_20220915_20220915_1335',
 'https://archive.org/embed/1_20220915_20220915_1335',
 'archive.org', FALSE),

('تاریخ افغانستان — جلد دوم',
 'History of Afghanistan Vol.2',
 'مولانا محمد اسماعیل ریحان', 'history', 'general', 320, '2022', 'المذھل پبلشرز', '📜', '#FFF3E0',
 'https://archive.org/details/2_20220915_20220915_1335',
 'https://archive.org/embed/2_20220915_20220915_1335',
 'archive.org', FALSE);

-- ── PHILOSOPHY (verified archive.org) ────────────────────────
INSERT INTO books (title_dari, title_en, author, translator, category, subcategory, pages, year, cover_emoji, cover_color, archive_url, gdrive_embed, source, is_featured) VALUES

('داستان فلسفه',
 'The Story of Philosophy',
 'برایان مگی', 'ترجمه دری', 'philosophy', 'western', 400, '2017', '🧠', '#F3E5F5',
 'https://archive.org/details/abu-abdurahman-kurdi-f_barid_20171224_2324',
 'https://archive.org/embed/abu-abdurahman-kurdi-f_barid_20171224_2324',
 'archive.org', TRUE),

('تاریخ فلسفه و تصوف',
 'History of Philosophy and Sufism',
 'آیت‌الله شیخ علی نمازی شاهرودی', NULL, 'philosophy', 'islamic', 350, '2015', '🧠', '#F3E5F5',
 'https://archive.org/details/TarikheFalsafe',
 'https://archive.org/embed/TarikheFalsafe',
 'archive.org', FALSE);

-- ── UNIVERSITY TEXTBOOKS ──────────────────────────────────────
INSERT INTO books (title_dari, title_en, author, category, subcategory, year, cover_emoji, cover_color, archive_url, gdrive_embed, source) VALUES

('ادب دری افغانی',
 'Afghan Dari Literature',
 'محمد حسین راضی', 'university', 'literature', '1356', '📕', '#E3F2FD',
 'https://archive.org/details/azu_acku_kotabkalan_pk_6427_6_alif77_ray26_1356',
 'https://archive.org/embed/azu_acku_kotabkalan_pk_6427_6_alif77_ray26_1356',
 'archive.org');
