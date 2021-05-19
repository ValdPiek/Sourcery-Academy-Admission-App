ALTER TABLE IF EXISTS public.form_has_question
    ADD COLUMN created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN created_by int4 NOT NULL,
    ADD COLUMN updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN updated_by int4 NOT NULL;

ALTER TABLE IF EXISTS public.question
	ALTER COLUMN picture TYPE varchar(2047);