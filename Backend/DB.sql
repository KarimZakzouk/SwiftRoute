--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Admin" (
    ssn integer NOT NULL,
    email character varying NOT NULL,
    fname character varying NOT NULL,
    mname character varying NOT NULL,
    lname character varying NOT NULL,
    password character varying NOT NULL
);


ALTER TABLE public."Admin" OWNER TO postgres;

--
-- Name: Attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Attendance" (
    d_ssn integer NOT NULL,
    date character varying NOT NULL,
    arrival_time character varying,
    leave_time character varying
);


ALTER TABLE public."Attendance" OWNER TO postgres;

--
-- Name: Car; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Car" (
    car_license character varying NOT NULL,
    number_of_seats integer NOT NULL,
    air_conditioning boolean DEFAULT false NOT NULL,
    car_type character varying NOT NULL,
    additional_price double precision,
    d_ssn integer NOT NULL
);


ALTER TABLE public."Car" OWNER TO postgres;

--
-- Name: Driver; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Driver" (
    ssn integer NOT NULL,
    email character varying NOT NULL,
    fname character varying NOT NULL,
    mname character varying NOT NULL,
    lname character varying NOT NULL,
    password character varying NOT NULL,
    is_private boolean DEFAULT false NOT NULL,
    m_ssn integer,
    shift character varying,
    salary integer,
    s_id integer,
    is_available boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Driver" OWNER TO postgres;

--
-- Name: Lost & Found; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Lost & Found" (
    t_id integer NOT NULL,
    item character varying NOT NULL,
    quantity integer NOT NULL,
    description character varying
);


ALTER TABLE public."Lost & Found" OWNER TO postgres;

--
-- Name: Manager; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Manager" (
    ssn integer NOT NULL,
    email character varying NOT NULL,
    fname character varying NOT NULL,
    mname character varying NOT NULL,
    lname character varying NOT NULL,
    password character varying NOT NULL,
    verified_by integer
);


ALTER TABLE public."Manager" OWNER TO postgres;

--
-- Name: Manager Finance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Manager Finance" (
    m_ssn integer NOT NULL,
    date date NOT NULL,
    salary double precision,
    total_profit double precision
);


ALTER TABLE public."Manager Finance" OWNER TO postgres;

--
-- Name: Passenger; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Passenger" (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    age integer,
    fname character varying(50),
    lname character varying(50),
    password character varying(255) NOT NULL
);


ALTER TABLE public."Passenger" OWNER TO postgres;

--
-- Name: Passenger Trip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Passenger Trip" (
    p_id integer NOT NULL,
    t_id integer NOT NULL,
    is_favourite boolean DEFAULT false NOT NULL,
    rate integer NOT NULL
);


ALTER TABLE public."Passenger Trip" OWNER TO postgres;

--
-- Name: Passenger_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Passenger_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Passenger_id_seq" OWNER TO postgres;

--
-- Name: Passenger_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Passenger_id_seq" OWNED BY public."Passenger".id;


--
-- Name: Private Trip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Private Trip" (
    order_id integer NOT NULL,
    source character varying(255) NOT NULL,
    destination character varying(255) NOT NULL,
    price double precision,
    estimated_time double precision DEFAULT 1,
    date character varying(255),
    d_ssn integer,
    p_id integer NOT NULL
);


ALTER TABLE public."Private Trip" OWNER TO postgres;

--
-- Name: Private Trip_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Private Trip_order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Private Trip_order_id_seq" OWNER TO postgres;

--
-- Name: Private Trip_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Private Trip_order_id_seq" OWNED BY public."Private Trip".order_id;


--
-- Name: Rejected Private Trip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Rejected Private Trip" (
    d_ssn integer NOT NULL,
    pt_id integer NOT NULL
);


ALTER TABLE public."Rejected Private Trip" OWNER TO postgres;

--
-- Name: Resign; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Resign" (
    m_ssn integer NOT NULL,
    d_ssn integer NOT NULL,
    date character varying NOT NULL,
    reason character varying NOT NULL
);


ALTER TABLE public."Resign" OWNER TO postgres;

--
-- Name: Station; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Station" (
    station_id integer NOT NULL,
    station_name character varying NOT NULL,
    street character varying NOT NULL,
    zipcode character varying NOT NULL,
    governorate character varying NOT NULL,
    m_ssn integer
);


ALTER TABLE public."Station" OWNER TO postgres;

--
-- Name: Station_station_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Station_station_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Station_station_id_seq" OWNER TO postgres;

--
-- Name: Station_station_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Station_station_id_seq" OWNED BY public."Station".station_id;


--
-- Name: Trip; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Trip" (
    trip_id integer NOT NULL,
    price double precision NOT NULL,
    date character varying(255) NOT NULL,
    estimated_time double precision DEFAULT 1,
    d_ssn integer,
    source_station integer NOT NULL,
    destination_station integer NOT NULL,
    status character varying DEFAULT 'idle'::character varying NOT NULL
);


ALTER TABLE public."Trip" OWNER TO postgres;

--
-- Name: Trip_trip_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Trip_trip_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Trip_trip_id_seq" OWNER TO postgres;

--
-- Name: Trip_trip_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Trip_trip_id_seq" OWNED BY public."Trip".trip_id;


--
-- Name: Vacation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vacation" (
    m_ssn integer NOT NULL,
    d_ssn integer NOT NULL,
    date character varying NOT NULL,
    status text DEFAULT false
);


ALTER TABLE public."Vacation" OWNER TO postgres;

--
-- Name: Passenger id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Passenger" ALTER COLUMN id SET DEFAULT nextval('public."Passenger_id_seq"'::regclass);


--
-- Name: Private Trip order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Private Trip" ALTER COLUMN order_id SET DEFAULT nextval('public."Private Trip_order_id_seq"'::regclass);


--
-- Name: Station station_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Station" ALTER COLUMN station_id SET DEFAULT nextval('public."Station_station_id_seq"'::regclass);


--
-- Name: Trip trip_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Trip" ALTER COLUMN trip_id SET DEFAULT nextval('public."Trip_trip_id_seq"'::regclass);


--
-- Data for Name: Admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Admin" (ssn, email, fname, mname, lname, password) FROM stdin;
1234567890	admin@admin.com	admin	admin	admin	$2b$10$fn9Aiv3a2.RmNaW1ZNME.uh7AfzuvUT7ncjhPRC/zndfPW3hufSle
94712854	Karim@admin.com	Karim	Farid	Zakzouk	$2b$10$vTJhaDT5iUBF5fVUq4zu3O7J46LNdk1RrEFFFPoALoMxndTD/x7fS
12351234	mazen@admin.com	Mazen	H	Hatem	$2b$10$rQDjPgC0g3Q4.f2EiP3Rl.Nn.CiaKAQRgnBRGnwZtl9M8z0oUUloG
4125612	Abdullahh@admin.com	Abdullah	A	Ahmed	$2b$10$dyup8epaBGPAz7LlRMVHD.ie00bUjJMA29cP/KGHgnwYf9I0SbmMu
4817724	Yousef@admin.com	Yousef	A	Adel	$2b$10$hvCqS1IxA/bJLR/Cn5RkKOIPCZZ5616nMgN3pxeDnuaXji/a8V4eG
\.


--
-- Data for Name: Attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Attendance" (d_ssn, date, arrival_time, leave_time) FROM stdin;
321321	2024-12-20	1:18 PM	5:00:00 PM
\.


--
-- Data for Name: Car; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Car" (car_license, number_of_seats, air_conditioning, car_type, additional_price, d_ssn) FROM stdin;
3152312	14	t	Sedan	34	321321
ABC12345 	4	t	Sedan	10	41251612
DEF54321 	14	t	SUV	12	12412563
GHI67890	14	f	Sedan	15	63179146
JKL76543 	14	f	Van	15	72167241
MNO87654	14	t	Sedan	11	81571265
PQR98765 	12	t	SEV	12	51272135
STU54321 	4	t	Sedan 	22	5235616
VWX21098 	12	t	Van	0	41361612
YZA43210 	12	t	Sedan	12	12151122
EFG76543 	5	t	Sedan 	8	51214353
JKL43210	5	f	SUV	1	124412
MNO32109	9	t	Van	12	41235623
PQR21098	12	t	Sedan	10	12451242
STU54221 	12	t	SUV	1	51267362
VWX43210 	12	f	SUV	10	12516122
YZA76543	12	t	Sedan	12	12617124
BCD65432	12	t	SUV	0	12516124
EFG32109 	14	t	Sedan	10	12512673
\.


--
-- Data for Name: Driver; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Driver" (ssn, email, fname, mname, lname, password, is_private, m_ssn, shift, salary, s_id, is_available) FROM stdin;
41251612	ahmed.fahad@example.com	Ahmed 	Mohammed 	AlFahad	$2b$10$iDi8U8c2VJ/.Hr1XOEqOCu.oo9kUEjjc.pHp2sGC.1ZH9VOl70ur6	f	\N	\N	\N	\N	t
12412563	sara.hashimi@example.com	Sara 	Khaled	Hashimi	$2b$10$geSTJmnFrNfb/tMobpBEkuHb/EGGn.yCTAFnI3Pp5ISAYzuMM8YwG	f	\N	\N	\N	\N	t
63179146	omar.mansoor@example.com	Omar 	Tariq 	Mansoor	$2b$10$OAVlqUHt3zjI2s/c93COYOo7HMzkecArozPiarqrWc7lZ3dYezYbW	f	\N	\N	\N	\N	t
72167241	layla.amin@example.com	Layla 	Zainab 	Amin 	$2b$10$PpmFSS8SYqgCLVdarGOyveIz798N0WnZGOTRxCDtlK0yyC.2bb9Km	f	\N	\N	\N	\N	t
81571265	ali.rashid@example.com	Ali 	Yusuf 	Rashid 	$2b$10$jlHgA9N8w7C0xRNCNuWYXeHXqC9X8VFD/j7PU7NiZjhrEfiTXD5dO	f	\N	\N	\N	\N	t
5235616	hassan.obaid@example.com	Hassan	Sami 	Obaid 	$2b$10$NDX8CmOTN9HsioAkkkGRte.dngKR4uF4p0OXYRGYvF/PWbbsD4QqS	f	\N	\N	\N	\N	t
41361612	fatima.khattab@example.com	Fatima 	Amira 	Khattab 	$2b$10$t2mhlR5MAVhd2qhy2ih0oOjHV9lTg8MMKLeu7voSGYorxTbv1h27W	f	\N	\N	\N	\N	t
12151122	khalil.mutlaq@example.com	Khalil 	Rami 	Mutlaq	$2b$10$g7JV9IIbBu4k13R4gheCXuwQ478/lu2GPg8rri2bbQBo3hIsVQ7PW	f	\N	\N	\N	\N	t
51236162	noor.jabari@example.com	Noor 	Amal 	Jabari 	$2b$10$Ur0ZgXTU3.Je9F83bkK9iOJK5LSBb/3QhAaSwNQhq7T76uBv7qbcG	f	\N	\N	\N	\N	t
51214353	ziad.harbi@example.com	Ziad	Fadi	Harbi	$2b$10$UMDe4f1BcfetBAfMTQ8oC.4.Ovm2kWx7RIPgG/xEXEtRQlku6COam	f	\N	\N	\N	\N	t
41235623	dina.qassem@example.com	Dina	Rana	Qassem	$2b$10$foEzHiY2d06I8XUc2JV7lOdOZRoa74Ls0UxPR.9Te82YxvckSMCRy	f	\N	\N	\N	\N	t
12451242	mazen.hassan@example.com	Mazen	Rashi	Hassan	$2b$10$qSKjQOtQ00len.PFuqJPlOReperTUfzjQ4v5lPTJdwB4VpY/bN39a	f	\N	\N	\N	\N	t
51267362	jameela.kabir@example.com	Jameela	Zahra	Kabir	$2b$10$TO31XG2HUx71TR9HFajwBOWqj/w8y5uJ0ny2D1ofbGqgA/tJC4l7S	f	\N	\N	\N	\N	t
12516122	moustafa.bassiouni@example.com	Moustafa	Adel	Bassiouni	$2b$10$NFvh7aHkreWPsGgp5lNERufGaR4cxK78nEiZvv9nBxV2oVtXkdRcK	f	\N	\N	\N	\N	t
12617124	reem.farsi@example.com	Reem	Salma	Farsi	$2b$10$xIxMQFh4hzYT6zxUn8YGi.XgISiZ4Pv/VvG0y4.f8g.Qa1emfbL6G	f	\N	\N	\N	\N	t
12516124	tariq.jaziri@example.com	Tariq 	Mazin 	Jaziri 	$2b$10$tSFY9gArWgio6uz3n4/D9.rE6yefvZj71lkLdM7Vhwzz6giBGCfFW	f	\N	\N	\N	\N	t
12512673	rania.mahmoud@example.com	Rania 	Zaina 	Mahmoud	$2b$10$rvrJXKOLIDWZ1aXd7OyxgukgxaUTUB6qEWNbp3Rk7UlmQ82ecab9G	f	\N	\N	\N	\N	t
321321	driver@gmail.com	Karim	Farid	Zakzouk	$2b$10$5taqCAm.JTdPXgVMY1y0z.t52Qqb6wuC4AtQVJXNJk5dQHMvyXJJS	t	\N	\N	\N	\N	t
124412	khaled.khalifa@example.com	Khaled	Nashit	Khalifa	$2b$10$t.wPKwB.Sx.pU90qzmGaFusdB0GnTAEGY7ydnH9S0D2oy7KL3YaU2	t	\N	\N	\N	\N	t
51272135	mona.sayeed@example.com	Mona 	Nadia 	Sayeed 	$2b$10$esNi6huhTbyxWkL3CgYK8.W1r0zJ3o9e/yEfYFQOL8lQpF0Vo2chS	t	8185457	2	2	23	t
\.


--
-- Data for Name: Lost & Found; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Lost & Found" (t_id, item, quantity, description) FROM stdin;
\.


--
-- Data for Name: Manager; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Manager" (ssn, email, fname, mname, lname, password, verified_by) FROM stdin;
2035452	Karim.salem@stations.eg	Karim	Youssef	Salem	$2b$10$qRRtscQBTUJFnTgCQTLEze/c0LazE0xxDe1IHDTmBlYOXgCUDCwxe	\N
4055454	tarek.nassar@stations.eg	Tarek	Ayman	Nassar	$2b$10$eHsU97PPUTo/25OfEg7gGuDmfe2.ybPyESzonpBOsu47DOKm2Ptaa	\N
5065455	mahmoud.said@stations.eg	Mahmoud	Galal	Said	$2b$10$7nknWbHZSa3NmkuOmE/squRhcoWQd/buOez7K42PN6MiD3mTyCf1K	\N
7085457	dalia.sayed@stations.eg	Dalia	Adel	Sayed	$2b$10$Xz8r48eUa5oo6kl/ZBTm/uFxP4XKNpSsvja6lJDbWbEvqRKTjIZ1W	\N
8095458	omar.helmy@stations.eg	Omar	Mostafa	Helmy	$2b$10$pYr1wBVzI3GsDA5ObFQYZO28c5kvSNsqOoz2TskArqJENmz.90DBm	\N
9105459	sara.reda@stations.eg	Sara	Ahmed	Reda	$2b$10$zbCa8bb6sCIeHliuUtdRsutr.Yz5YBKinBFPoYj4Gva9E1hphu37i	\N
1115450	khaled.saber@stations.eg	Khaled	Ibrahim	Saber	$2b$10$0J9c5D2gPqA1ckJVRRIQcexPh/5eAMcKogeDNF0Pq1MI7ndiIm7Ee	\N
2125451	nour.hassan@stations.eg	Nour	Adel	Hassan	$2b$10$fW10fpn434d4FULHr9xLw.azIpjnEZt9DuE5h9o6Fhk6x2dgG.Tsq	\N
3135452	mostafa.ezzeldin@stations.eg	Mostafa	Tarek	Ezzeldin	$2b$10$XhJkVR573yie5C2zUZ4MQ.sUSrhu2L9eBmWOIfUv2ql5y6VaMwasO	\N
4145453	yasmine.lotfy@stations.eg	Yasmine	Amr	Lotfy	$2b$10$q.IIkwQ.CkibXcgEG1GidOA8e1LbZhcQM9NWp9tQ6ZFoLXd/BBvy2	\N
5155454	rami.badr@stations.eg	Rami	Sherif	Badr	$2b$10$vIlju0xnfxyG6tRgyvPMeuOvdBGs3mKHvfS0onAsgLG4/q3qR7K1S	\N
6165455	hanan.elsheikh@stations.eg	Hanan	Samir	Elsheikh	$2b$10$bDASnooENnDvVg3j7IYCaOIlfqq.CwlfRB.Utw6ct.cUtgbf/.a/6	\N
7175456	mohamed.rashed@stations.eg	Mohamed	Zaki	Rashed	$2b$10$3jqqszyznfsjdscq7bL2tOKNZ1Nj3XPHuj1S7Qq.uUyarOe7gLLyK	\N
9195458	walid.eid@stations.eg	Walid	Hossam	Eid	$2b$10$bZ2MVye9CYpugVcFwmItbOhAFLYbFJnRUbvWBCI/qSYDZP2IwdXqa	\N
2101545	ahmed.mansour@stations.eg	Ahmed	Khaled	Mansour	$2b$10$Pmvce1E/JCrY54sbzGvX6OjzpIIZhfnBja6S9LL2742Wu/2p9TXtq	\N
3045453	salma.abdelrahman@stations.eg	Salma	Hesham	Abdelrahman	$2b$10$XYcYdTqIVBNcZq10C.fWIeEj53TZMv5VsS/YEyg6EWYyj7KAPnQvS	\N
8185457	tamer.shaker@stations.eg	Tamer	Ali	Shaker	$2b$10$6P8rciuLrteF9JdzQ70wveqNCrZIlsVth0kTOCASfr8Otf6ud3dm.	1234567890
11112	1@gmail.com	sa	sa	sa	$2b$10$HZ6CUcMGu3jXBCWrc6oxrO6JhXX1p1ZdGlohUukUED5ZlrcB5KbHq	\N
\.


--
-- Data for Name: Manager Finance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Manager Finance" (m_ssn, date, salary, total_profit) FROM stdin;
\.


--
-- Data for Name: Passenger; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Passenger" (id, email, age, fname, lname, password) FROM stdin;
6	john.doe@example.com	25	John	Doe	$2b$10$YRH4pIAC60WlsEIAC4i5x.uqdAHmO3gdci/7IMIC1dJAaq2XLObL2
7	jane.smith@example.com	30	Jane	Smith	$2b$10$OG.88Js9LprgaVRBxANxjuUOnecP6MUxYVlAhSMZSZCTj6Amc58pq
8	alice.johnson@example.com	22	Alice	Johnson	$2b$10$Ur22qYt0XISgjG6rtgxkQu9zXg8WvSeF2r1ZPp28Dba8cL5A0KHeS
9	bob.williams@example.com	28	Bob	Williams	$2b$10$oAhaa5WgeY4geEJ6tRuXW.wFotmRknMw6vmOr1dJr1mwPaPowe1.6
10	carol.brown@example.com	35	Carol	Brown	$2b$10$TaWnz4MwyFnGQZ6y3rFBN.5pPksDXuj3kQjTLCH1q0SMJYFXAU7gS
11	emma.anderson@example.com	24	Emma	Anderson	$2b$10$SA9ZU.JdHhSqCEFEbiXdSerQHygMBzWMYwMYnTiVsUlC0y1/9KtFi
12	frank.thomas@example.com	29	Frank	Thomas	$2b$10$dpbA7HHtUJymIr5loZwkFutC1JqtpTXj/uiwJfpG8CwrUhnBksyNO
13	grace.jackson@example.com	27	Grace	Jackson	$2b$10$vA9hHSpXckmsgomUA4ukBu2cGIzjAE3LzUzX7aIonWvGIend1y99a
14	henry.white@example.com	32	Henry	White	$2b$10$qtdNwJwvBX01rvoqgYV4Q.0Aer9XL.m58Jv4Ht3L558fJEioAalrS
15	ivy.harris@example.com	26	Ivy	Harris	$2b$10$zIqE4a70scl9VkMux5xRRe8OikSL017LEpowLsX7itIEn3xtOGGqu
16	jack.martin@example.com	33	Jack	Martin	$2b$10$VqCsEoTmQ7qN3U7coSi44.VUFP3lHf.LKn.ffJEyLIGKwpurQaAOK
17	kelly.clark@example.com	23	Kelly	Clark	$2b$10$Zh9C5Ce503lpZwaPZEZame2t5cOz1qBaNubvx1umnq2C7tphGyT6q
18	liam.lewis@example.com	31	Liam	Lewis	$2b$10$GQudf8M5MXsRKY3cVYB0fOM0szgYUr37c0VwoiaUj.mxXtX4RGpWK
19	mia.walker@example.com	29	Mia	Walker	$2b$10$HJSWSZdbiRo9U/7bAK6s7eXRXsk6dRrgrWv9oa5JNIpKXJbH/QCUW
20	noah.allen@example.com	33	Noah	Allen	$2b$10$QEgUdS7gmhe7XT6ebKZeLOjbkH.H4uLIXvXG2.qJjMcJKOj51Nky.
1	olivia.young@example.com	22	Olivia	Young	$2b$10$XO2waipZPL5fGN2zKlfSu.7to2KwT8MIsAyCzXiIQwa1.ImAAsBWW
2	peter.king@example.com	32	Peter	King	$2b$10$Ilhc.PbDQmZRjc/OIxPbBORti53c1jw5We7mg0G/l94i7AU4rS.mO
3	quinn.scott@example.com	25	Quinn	Scott	$2b$10$deEikW2F8kMFhLztzzI5Au4phGz1MLNWVMOvOVwf9Gn0sRrZbQoki
4	rachel.green@example.com	28	Rachel	Green	$2b$10$ZFuXXyNtVMA.MftI/GTghuT/lVNDzACqj7pxZBVi5JA1z4QgS60By
5	samuel.miller@example.com	26	Samuel	Miller	$2b$10$dlvsawLEIAyejCK/zSklcOK3AbvYbqoBtw/TKfH3ZUTRG9aCDC6ZG
21	passenger@gmail.com	24	Karim	Zakzouk	$2b$10$YPJy9FEu7dorDOvxyXZ8Ielmlf/8snueR/R9p/BvG62hdCQgYZXjm
22	passenger1@gmail.com	42	Karim	Zakzouk	$2b$10$eWkzJfJRAfGVpJ8ildJqDeexm0LmreZi2O0BgMUNafH7DZG2X3m.y
23	Yousef@passenger.com	20	Yousef	Adel	$2b$10$FqsThJaIO0Xco2AMGfFm0eIGfyrWYBVFD0HeRbPbFupk9UOHgou3e
\.


--
-- Data for Name: Passenger Trip; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Passenger Trip" (p_id, t_id, is_favourite, rate) FROM stdin;
\.


--
-- Data for Name: Private Trip; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Private Trip" (order_id, source, destination, price, estimated_time, date, d_ssn, p_id) FROM stdin;
18	giza	masr	4	1	2024-12-22	124412	23
19	ds	ds	1	1	2024-12-22	\N	23
20	sd	sd	1	1	2024-12-22	124412	23
21	rfd	fd	3	1	2024-12-22	\N	23
22	sf	dssd	5	1	2024-12-22	\N	23
23	ddsdsdsd	sddsdsdsdsd	10	1	2024-12-22	\N	23
24	d	d	2	1	2024-12-22	\N	23
25	we	ew	3	1	2024-12-22	\N	23
\.


--
-- Data for Name: Rejected Private Trip; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Rejected Private Trip" (d_ssn, pt_id) FROM stdin;
321321	18
321321	19
51272135	19
51272135	20
\.


--
-- Data for Name: Resign; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Resign" (m_ssn, d_ssn, date, reason) FROM stdin;
8185457	321321	2024-12-22T16:34:14.702+02:00	hello
\.


--
-- Data for Name: Station; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Station" (station_id, station_name, street, zipcode, governorate, m_ssn) FROM stdin;
9	Alexandria Main	34	456213	Alexandria	2035452
10	Suez City Station	45	6457883	Suez	4055454
11	Aswan Terminal	1	342567	Aswan	5065455
13	Ismailia Station	2	41246312	Ismailia	7085457
14	Tanta Terminal	32	782632	Tanta	8095458
15	Zagazig Station	35	235432	Zagazig	9105459
16	Hurghada Central	231	234323	Hurghada	1115450
17	Minya Station	42	3454561	Minya	2125451
18	Asyut Terminal	542	2134345	Asyut	3135452
19	Fayoum Station	46	3455231	Fayoum	4145453
20	Marsa Matruh Hub	534	343521	Marsa Matruh	5155454
21	Qena Main Station	22	563820	Qena	6165455
22	Beni Suef Station	65	7493021	Beni Suef	7175456
23	Matariya Station	21	537873	Cairo	8185457
24	Kafr El Sheikh Station	81	2456268	Kafr El Sheikh	9195458
7	Cairo Central Station	13	456246	Cairo	2101545
26	Mansoura Station	53	566231	Mansoura	3045453
25	Beheira Central	41	6529378	Beheira	\N
8	Ramses Station	4	342145	Giza	\N
12	Sharm El Sheikh Hub	11	6575345	Sharm El Sheikh	11112
\.


--
-- Data for Name: Trip; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Trip" (trip_id, price, date, estimated_time, d_ssn, source_station, destination_station, status) FROM stdin;
1	11	2024-12-22T14:15:10.417Z	1	\N	23	8	idle
\.


--
-- Data for Name: Vacation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Vacation" (m_ssn, d_ssn, date, status) FROM stdin;
\.


--
-- Name: Passenger_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Passenger_id_seq"', 22, true);


--
-- Name: Private Trip_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Private Trip_order_id_seq"', 17, true);


--
-- Name: Station_station_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Station_station_id_seq"', 26, true);


--
-- Name: Trip_trip_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Trip_trip_id_seq"', 1, false);


--
-- Name: Attendance Attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY (d_ssn, date);


--
-- Name: Car Car_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Car"
    ADD CONSTRAINT "Car_pkey" PRIMARY KEY (car_license);


--
-- Name: Lost & Found Lost & Found_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lost & Found"
    ADD CONSTRAINT "Lost & Found_pkey" PRIMARY KEY (t_id, item);


--
-- Name: Manager Finance Manager Finance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Manager Finance"
    ADD CONSTRAINT "Manager Finance_pkey" PRIMARY KEY (m_ssn, date);


--
-- Name: Passenger Trip Passenger Trip_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Passenger Trip"
    ADD CONSTRAINT "Passenger Trip_pkey" PRIMARY KEY (p_id, t_id);


--
-- Name: Passenger Passenger_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Passenger"
    ADD CONSTRAINT "Passenger_pkey" PRIMARY KEY (id);


--
-- Name: Private Trip Private Trip_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Private Trip"
    ADD CONSTRAINT "Private Trip_pkey" PRIMARY KEY (order_id);


--
-- Name: Rejected Private Trip Rejected Private Trip_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rejected Private Trip"
    ADD CONSTRAINT "Rejected Private Trip_pkey" PRIMARY KEY (d_ssn, pt_id);


--
-- Name: Resign Resign_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resign"
    ADD CONSTRAINT "Resign_pkey" PRIMARY KEY (m_ssn, d_ssn);


--
-- Name: Station Station_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Station"
    ADD CONSTRAINT "Station_pkey" PRIMARY KEY (station_id);


--
-- Name: Trip Trip_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Trip"
    ADD CONSTRAINT "Trip_pkey" PRIMARY KEY (trip_id);


--
-- Name: Vacation Vacation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vacation"
    ADD CONSTRAINT "Vacation_pkey" PRIMARY KEY (m_ssn, d_ssn, date);


--
-- Name: Admin admin_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT admin_email_key UNIQUE (email);


--
-- Name: Admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Admin"
    ADD CONSTRAINT admin_pkey PRIMARY KEY (ssn);


--
-- Name: Driver driver_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Driver"
    ADD CONSTRAINT driver_email_key UNIQUE (email);


--
-- Name: Driver driver_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Driver"
    ADD CONSTRAINT driver_pkey PRIMARY KEY (ssn);


--
-- Name: Manager manager_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Manager"
    ADD CONSTRAINT manager_email_key UNIQUE (email);


--
-- Name: Manager manager_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Manager"
    ADD CONSTRAINT manager_pkey PRIMARY KEY (ssn);


--
-- Name: Attendance Attendance_D_SSN_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_D_SSN_fkey" FOREIGN KEY (d_ssn) REFERENCES public."Driver"(ssn) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: Car D_SSN_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Car"
    ADD CONSTRAINT "D_SSN_fkey" FOREIGN KEY (d_ssn) REFERENCES public."Driver"(ssn) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: Lost & Found Lost & Found_t_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lost & Found"
    ADD CONSTRAINT "Lost & Found_t_id_fkey" FOREIGN KEY (t_id) REFERENCES public."Trip"(trip_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: Manager Finance Manager Finance_M_SSN_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Manager Finance"
    ADD CONSTRAINT "Manager Finance_M_SSN_fkey" FOREIGN KEY (m_ssn) REFERENCES public."Manager"(ssn) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: Manager Manager_verifiedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Manager"
    ADD CONSTRAINT "Manager_verifiedBy_fkey" FOREIGN KEY (verified_by) REFERENCES public."Admin"(ssn) ON UPDATE CASCADE NOT VALID;


--
-- Name: Private Trip Private Trip_d_ssn_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Private Trip"
    ADD CONSTRAINT "Private Trip_d_ssn_fkey" FOREIGN KEY (d_ssn) REFERENCES public."Driver"(ssn) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: Private Trip Private Trip_p_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Private Trip"
    ADD CONSTRAINT "Private Trip_p_id_fkey" FOREIGN KEY (p_id) REFERENCES public."Passenger"(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: Resign Resign_d_ssn_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resign"
    ADD CONSTRAINT "Resign_d_ssn_fkey" FOREIGN KEY (d_ssn) REFERENCES public."Driver"(ssn);


--
-- Name: Resign Resign_m_ssn_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resign"
    ADD CONSTRAINT "Resign_m_ssn_fkey" FOREIGN KEY (m_ssn) REFERENCES public."Manager"(ssn);


--
-- Name: Trip Trip_d_ssn_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Trip"
    ADD CONSTRAINT "Trip_d_ssn_fkey" FOREIGN KEY (d_ssn) REFERENCES public."Driver"(ssn) NOT VALID;


--
-- Name: Vacation Vacation_m_ssn_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vacation"
    ADD CONSTRAINT "Vacation_m_ssn_fkey" FOREIGN KEY (m_ssn) REFERENCES public."Manager"(ssn) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: Driver fkey_MSSN; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Driver"
    ADD CONSTRAINT "fkey_MSSN" FOREIGN KEY (m_ssn) REFERENCES public."Manager"(ssn) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;


--
-- Name: Station fkey_MSSN; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Station"
    ADD CONSTRAINT "fkey_MSSN" FOREIGN KEY (m_ssn) REFERENCES public."Manager"(ssn) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;


--
-- Name: Driver fkey_StationID; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Driver"
    ADD CONSTRAINT "fkey_StationID" FOREIGN KEY (s_id) REFERENCES public."Station"(station_id) ON UPDATE CASCADE ON DELETE SET NULL NOT VALID;


--
-- Name: Trip fkey_Trip_destination_station; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Trip"
    ADD CONSTRAINT "fkey_Trip_destination_station" FOREIGN KEY (destination_station) REFERENCES public."Station"(station_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: Trip fkey_Trip_source_station; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Trip"
    ADD CONSTRAINT "fkey_Trip_source_station" FOREIGN KEY (source_station) REFERENCES public."Station"(station_id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: Vacation fkey_Vacation_D_SSN; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vacation"
    ADD CONSTRAINT "fkey_Vacation_D_SSN" FOREIGN KEY (d_ssn) REFERENCES public."Driver"(ssn) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;


--
-- Name: Rejected Private Trip fkey_d_ssn; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rejected Private Trip"
    ADD CONSTRAINT fkey_d_ssn FOREIGN KEY (d_ssn) REFERENCES public."Driver"(ssn) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Passenger Trip fkey_p_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Passenger Trip"
    ADD CONSTRAINT fkey_p_id FOREIGN KEY (p_id) REFERENCES public."Passenger"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Rejected Private Trip fkey_pt_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Rejected Private Trip"
    ADD CONSTRAINT fkey_pt_id FOREIGN KEY (pt_id) REFERENCES public."Private Trip"(order_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Passenger Trip fkey_t_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Passenger Trip"
    ADD CONSTRAINT fkey_t_id FOREIGN KEY (t_id) REFERENCES public."Trip"(trip_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

