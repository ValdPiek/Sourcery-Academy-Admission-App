SET SCHEMA 'public';

create table if not exists "user"
(
    id               serial                                           not null
        constraint user_pk
            primary key,
    role             varchar(45) default 'STUDENT'::character varying not null,
    first_name       varchar(45)                                      not null,
    last_name        varchar(45)                                      not null,
    email            varchar(255)                                     not null,
    password         varchar(255)                                     not null,
    telephone        varchar(45),
    year_of_birth    integer                                          not null,
    education        varchar(45)                                      not null,
    active           boolean     default true                         not null,
    is_not_suspended boolean     default true                         not null,
    created          timestamp        default CURRENT_TIMESTAMP            not null,
    created_by       integer,
    updated          timestamp        default CURRENT_TIMESTAMP            not null,
    updated_by       integer,
    gender           char                                             not null
);

create unique index if not exists user_email_uindex
    on "user" (email);

create table if not exists academy
(
    id          serial                            not null
        constraint academy_pk
            primary key,
    status      integer default 1                 not null,
    name        varchar(255)                      not null,
    description varchar(255),
    city        varchar(255)                      not null,
    email       varchar(255),
    telephone   varchar(45),
    created     timestamp    default CURRENT_TIMESTAMP not null,
    created_by  integer                           not null,
    updated     timestamp    default CURRENT_TIMESTAMP not null,
    updated_by  integer                           not null,
    time_start  timestamp,
    time_finish timestamp
);

create unique index if not exists academy_id_uindex
    on academy (id);

create table if not exists academy_has_user
(
    academy_id integer
        constraint academy_has_user_academy_id_fk
            references academy,
    user_id    integer
        constraint academy_has_user_user_id_fk
            references "user",
    active     boolean default true              not null,
    created    timestamp    default CURRENT_TIMESTAMP not null,
    created_by integer                           not null,
    updated    timestamp    default CURRENT_TIMESTAMP not null,
    updated_by integer                           not null
);

create table if not exists form
(
    id          serial                            not null
        constraint form_pk
            primary key,
    status      integer default 1                 not null,
    name        varchar(255)                      not null,
    academy_id  integer                           not null
        constraint form_academy_id_fk
            references academy,
    time_start  timestamp,
    time_finish timestamp,
    created     timestamp    default CURRENT_TIMESTAMP not null,
    created_by  integer                           not null,
    updated     timestamp    default CURRENT_TIMESTAMP not null,
    updated_by  integer                           not null
);

create unique index if not exists form_id_uindex
    on form (id);

create table if not exists user_submit_form
(
    user_id  integer
        constraint user_submit_form_user_id_fk
            references "user",
    form_id  integer
        constraint user_submit_form_form_id_fk
            references form,
    score    integer                           not null,
    created  timestamp    default CURRENT_TIMESTAMP not null,
    updated  timestamp    default CURRENT_TIMESTAMP not null,
    verified boolean default false             not null
);

create table if not exists question
(
    id         serial                         not null
        constraint question_pk
            primary key,
    type       integer                        not null,
    value      varchar(255)                   not null,
    category   varchar(45)                    not null,
    picture    varchar(255),
    created    timestamp default CURRENT_TIMESTAMP not null,
    created_by integer                        not null,
    updated    timestamp default CURRENT_TIMESTAMP not null,
    updated_by integer                        not null
);

create unique index if not exists question_id_uindex
    on question (id);

create table if not exists form_has_question
(
    form_id     integer
        constraint form_has_question_form_id_fk
            references form,
    question_id integer
        constraint form_has_question_question_id_fk
            references question,
    number      integer not null
);

create table if not exists answer
(
    id          serial                            not null
        constraint answer_pk
            primary key,
    question_id integer
        constraint answer_question_id_fk
            references question,
    value       varchar(255)                      not null,
    points      integer default 0                 not null,
    created     timestamp    default CURRENT_TIMESTAMP not null,
    created_by  integer                           not null,
    updated     timestamp    default CURRENT_TIMESTAMP not null,
    updated_by  integer                           not null
);

create unique index if not exists answer_id_uindex
    on answer (id);

create table if not exists user_has_answer
(
    user_id    integer
        constraint user_has_answer_user_id_fk
            references "user",
    answer_id  integer
        constraint user_has_answer_answer_id_fk
            references answer,
    form_id    integer
        constraint user_has_answer_form_id_fk
            references form,
    value      varchar(255),
    points     integer default 0                 not null,
    created    timestamp    default CURRENT_TIMESTAMP not null,
    created_by integer                           not null,
    updated    timestamp    default CURRENT_TIMESTAMP not null,
    updated_by integer                           not null
);


