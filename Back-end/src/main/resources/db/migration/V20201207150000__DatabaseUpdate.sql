ALTER TABLE IF EXISTS public.academy
	ALTER COLUMN description TYPE varchar(32768),
	ALTER COLUMN time_start SET NOT NULL,
	ALTER COLUMN time_finish SET NOT NULL;

CREATE TABLE IF NOT EXISTS public.academy (
	id serial NOT NULL,
	status int4 NOT NULL DEFAULT 1,
	"name" varchar(255) NOT NULL,
	description varchar(32768) NULL,
	city varchar(255) NOT NULL,
	email varchar(255) NULL,
	telephone varchar(45) NULL,
	created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by int4 NOT NULL,
	updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by int4 NOT NULL,
	time_start timestamp NOT NULL,
	time_finish timestamp NOT NULL,
	CONSTRAINT academy_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS academy_id_uindex ON public.academy USING btree (id);

CREATE TABLE IF NOT EXISTS public.question (
	id serial NOT NULL,
	"type" int4 NOT NULL,
	value varchar(255) NOT NULL,
	category varchar(45) NOT NULL,
	picture varchar(255) NULL,
	created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by int4 NOT NULL,
	updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by int4 NOT NULL,
	CONSTRAINT question_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS question_id_uindex ON public.question USING btree (id);

ALTER TABLE IF EXISTS public."user"
	ALTER COLUMN created_by SET NOT NULL,
	ALTER COLUMN updated_by SET NOT NULL;

CREATE TABLE IF NOT EXISTS public."user" (
	id serial NOT NULL,
	"role" varchar(45) NOT NULL DEFAULT 'STUDENT'::character varying,
	first_name varchar(45) NOT NULL,
	last_name varchar(45) NOT NULL,
	email varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	telephone varchar(45) NULL,
	year_of_birth int4 NOT NULL,
	education varchar(45) NOT NULL,
	active bool NOT NULL DEFAULT true,
	is_not_suspended bool NOT NULL DEFAULT true,
	created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by int4 NOT NULL,
	updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by int4 NOT NULL,
	gender bpchar(1) NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX IF NOT EXISTS user_email_uindex ON public."user" USING btree (email);

ALTER TABLE IF EXISTS public.academy_has_user
	ADD CONSTRAINT academy_has_user_pkey PRIMARY KEY (academy_id, user_id);

ALTER TABLE IF EXISTS public.academy_has_user
	RENAME COLUMN active TO is_suspended;
	
ALTER TABLE IF EXISTS public.academy_has_user
	ALTER COLUMN is_suspended SET DEFAULT false;

CREATE TABLE IF NOT EXISTS public.academy_has_user (
	academy_id int4 NOT NULL,
	user_id int4 NOT NULL,
	is_suspended bool NOT NULL DEFAULT false,
	created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by int4 NOT NULL,
	updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by int4 NOT NULL,
	CONSTRAINT academy_has_user_pkey PRIMARY KEY (academy_id, user_id),
	CONSTRAINT academy_has_user_academy_id_fk FOREIGN KEY (academy_id) REFERENCES academy(id),
	CONSTRAINT academy_has_user_user_id_fk FOREIGN KEY (user_id) REFERENCES "user"(id)
);

ALTER TABLE IF EXISTS public.answer
	ALTER COLUMN value TYPE varchar(8191),
	ALTER COLUMN question_id SET NOT NULL;

CREATE TABLE IF NOT EXISTS public.answer (
	id serial NOT NULL,
	question_id int4 NOT NULL,
	value varchar(8191) NOT NULL,
	points int4 NOT NULL DEFAULT 0,
	created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by int4 NOT NULL,
	updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by int4 NOT NULL,
	CONSTRAINT answer_pk PRIMARY KEY (id),
	CONSTRAINT answer_question_id_fk FOREIGN KEY (question_id) REFERENCES question(id)
);

ALTER TABLE IF EXISTS public.form
	ALTER COLUMN time_start SET NOT NULL,
	ALTER COLUMN time_finish SET NOT NULL,
    ADD COLUMN description varchar(32768) NULL;

CREATE TABLE IF NOT EXISTS public.form (
	id serial NOT NULL,
    academy_id int4 NOT NULL,
	"name" varchar(255) NOT NULL,
    status int4 NOT NULL DEFAULT 1,
    description varchar(32768) NULL,
	time_start timestamp NOT NULL,
	time_finish timestamp NOT NULL,
	created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by int4 NOT NULL,
	updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by int4 NOT NULL,
	CONSTRAINT form_pk PRIMARY KEY (id),
	CONSTRAINT form_academy_id_fk FOREIGN KEY (academy_id) REFERENCES academy(id)
);
CREATE UNIQUE INDEX IF NOT EXISTS form_id_uindex ON public.form USING btree (id);

ALTER TABLE IF EXISTS public.form_has_question
	ADD CONSTRAINT form_has_question_pkey PRIMARY KEY (form_id, question_id);

CREATE TABLE IF NOT EXISTS public.form_has_question (
	form_id int4 NOT NULL,
	question_id int4 NOT NULL,
	"number" int4 NOT NULL,
	CONSTRAINT form_has_question_pkey PRIMARY KEY (form_id, question_id),
	CONSTRAINT form_has_question_form_id_fk FOREIGN KEY (form_id) REFERENCES form(id),
	CONSTRAINT form_has_question_question_id_fk FOREIGN KEY (question_id) REFERENCES question(id)
);

ALTER TABLE IF EXISTS public.user_has_answer
	ALTER COLUMN value TYPE varchar(2047),
	ALTER COLUMN form_id SET NOT NULL,
	ADD CONSTRAINT user_has_answer_pkey PRIMARY KEY (user_id, answer_id);

CREATE TABLE IF NOT EXISTS public.user_has_answer (
	user_id int4 NOT NULL,
	answer_id int4 NOT NULL,
	form_id int4 NOT NULL,
	value varchar(2047) NULL,
	points int4 NOT NULL DEFAULT 0,
	created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by int4 NOT NULL,
	updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by int4 NOT NULL,
	CONSTRAINT user_has_answer_pkey PRIMARY KEY (user_id, answer_id),
	CONSTRAINT user_has_answer_answer_id_fk FOREIGN KEY (answer_id) REFERENCES answer(id),
	CONSTRAINT user_has_answer_form_id_fk FOREIGN KEY (form_id) REFERENCES form(id),
	CONSTRAINT user_has_answer_user_id_fk FOREIGN KEY (user_id) REFERENCES "user"(id)
);

ALTER TABLE IF EXISTS public.user_submit_form
	ADD CONSTRAINT user_submit_form_pkey PRIMARY KEY (user_id, form_id);

CREATE TABLE IF NOT EXISTS public.user_submit_form (
	user_id int4 NOT NULL,
	form_id int4 NOT NULL,
	score int4 NOT NULL,
	verified bool NOT NULL DEFAULT false,
	created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by int4 NOT NULL,
	updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by int4 NOT NULL,
	CONSTRAINT user_submit_form_pkey PRIMARY KEY (user_id, form_id),
	CONSTRAINT user_submit_form_form_id_fk FOREIGN KEY (form_id) REFERENCES form(id),
	CONSTRAINT user_submit_form_user_id_fk FOREIGN KEY (user_id) REFERENCES "user"(id)
);