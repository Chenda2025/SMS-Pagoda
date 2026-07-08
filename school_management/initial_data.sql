--
-- PostgreSQL database dump
--

\restrict 1xOD14ysJpnarDG0MO5gcQa78s4xAU8cNDeGsKMbi3G1EJg23RUyLWIGe0uNHJL

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4 (Homebrew)

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

--
-- Data for Name: academic_years; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.academic_years (id, year_name, start_date, end_date, is_current, created_at) FROM stdin;
3	2028-2029	2028-05-05	2030-03-01	f	2026-06-18 04:05:07
1	2026-2027	2026-11-01	2027-10-31	t	2026-06-17 13:59:12
2	2027-2028	2027-05-05	2028-03-01	f	2026-06-18 18:04:12
\.


--
-- Data for Name: academic_periods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.academic_periods (id, academic_year_id, parent_id, period_type, period_number, name, start_date, end_date, created_at) FROM stdin;
19	2	\N	ប្រចាំខែ	1	ខែតុលា	2023-10-01	2023-10-31	\N
21	2	\N	ប្រចាំខែ	5	ខែកុម្ភៈ	2024-02-01	2024-02-28	\N
22	2	\N	ត្រីមាស	3	ត្រីមាសទី៣	2024-03-01	2024-05-31	\N
53	1	\N	ប្រចាំខែ	5	ខែកញ្ញា	2026-09-01	2026-09-30	\N
1	1	\N	ឆមាស	6	ឆមាសទី១	2026-10-01	2026-10-31	2026-06-20 22:49:56.412451
8	1	3	ប្រចាំខែ	7	ខែវិច្ឆិកា	2026-11-01	2026-11-30	2026-06-21 12:49:56.412451
13	1	5	ប្រចាំខែ	9	ខែមករា	2027-01-01	2027-01-30	2026-06-21 12:49:56.412451
5	1	2	ត្រីមាស	8	ត្រីមាសទី២	2026-12-01	2026-12-31	2026-06-20 15:49:56.412451
2	1	\N	ឆមាស	10	ឆមាសទី២	2027-02-01	2027-02-28	2026-06-20 22:49:56.412451
14	1	5	ប្រចាំខែ	1	ខែឧសភា	2026-05-28	2026-05-30	2026-06-21 05:49:56.412451
54	1	\N	ប្រចាំខែ	2	ខែមិថុនា	2026-06-28	2026-06-30	\N
3	1	1	ត្រីមាស	3	ត្រីមាសទី១	2026-07-19	2026-07-21	2026-06-20 08:49:56.412451
69	1	\N	វិសមកាលតូច	3	ចូលព្រះវស្សា	2026-07-23	2026-07-30	\N
70	1	\N	បុណ្យ	5	ភ្ជុំបិណ្ឌ	2026-09-10	2026-09-12	\N
\.


--
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provinces (province_code, name_kh, name_en) FROM stdin;
01	បន្ទាយមានជ័យ	Banteay Meanchey
02	បាត់ដំបង	Battambang
03	កំពង់ចាម	Kampong Cham
04	កំពង់ឆ្នាំង	Kampong Chhnang
05	កំពង់ស្ពឺ	Kampong Speu
06	កំពង់ធំ	Kampong Thom
07	កំពត	Kampot
08	កណ្ដាល	Kandal
09	កោះកុង	Koh Kong
10	ក្រចេះ	Kratie
11	មណ្ឌលគិរី	Mondul Kiri
12	រាជធានីភ្នំពេញ	Phnom Penh Capital
13	ព្រះវិហារ	Preah Vihear
14	ព្រៃវែង	Prey Veng
15	ពោធិ៍សាត់	Pursat
16	រតនគិរី	Ratanak Kiri
17	សៀមរាប	Siemreap
18	ព្រះសីហនុ	Preah Sihanouk
19	ស្ទឹងត្រែង	Stung Treng
20	ស្វាយរៀង	Svay Rieng
21	តាកែវ	Takeo
22	ឧត្ដរមានជ័យ	Oddar Meanchey
23	កែប	Kep
24	ប៉ៃលិន	Pailin
25	ត្បូងឃ្មុំ	Tboung Khmum
\.


--
-- Data for Name: districts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.districts (district_code, name_kh, name_en, province_id) FROM stdin;
000102	មង្គលបូរី	Mongkol Borei	01
000103	ភ្នំស្រុក	Phnum Srok	01
000104	ព្រះនេត្រព្រះ	Preah Netr Preah	01
000105	អូរជ្រៅ	Ou Chrov	01
000106	ក្រុងសិរីសោភ័ណ	Serei Saophoan Municipality	01
000107	ថ្មពួក	Thma Puok	01
000108	ស្វាយចេក	Svay Chek	01
000109	ម៉ាឡៃ	Malai	01
000110	ក្រុងប៉ោយប៉ែត	Paoy Paet Municipality	01
000201	បាណន់	Banan	02
000202	ថ្មគោល	Thma Koul	02
000203	ក្រុងបាត់ដំបង	Battambang Municipality	02
000204	បវេល	Bavel	02
000205	ឯកភ្នំ	Aek Phnum	02
000206	មោងឫស្សី	Moung Ruessei	02
000207	រតនមណ្ឌល	Rotonak Mondol	02
000208	សង្កែ	Sangkae	02
000209	សំឡូត	Samlout	02
000210	សំពៅលូន	Sampov Lun	02
000211	ភ្នំព្រឹក	Phnum Proek	02
000212	កំរៀង	Kamrieng	02
000213	គាស់ក្រឡ	Koas Krala	02
000214	រុក្ខគិរី	Rukh Kiri	02
000301	បាធាយ	Batheay	03
000302	ចំការលើ	Chamkar Leu	03
000303	ជើងព្រៃ	Cheung Prey	03
000305	ក្រុងកំពង់ចាម	Kampong Cham Municipality	03
000306	កំពង់សៀម	Kampong Siem	03
000307	កងមាស	Kang Meas	03
000308	កោះសូទិន	Kaoh Soutin	03
000313	ព្រៃឈរ	Prey Chhor	03
000314	ស្រីសន្ធរ	Srei Santhor	03
000315	ស្ទឹងត្រង់	Stueng Trang	03
000401	បរិបូណ៌	Baribour	04
000402	ជលគីរី	Chol Kiri	04
000403	ក្រុងកំពង់ឆ្នាំង	Kampong Chhnang Municipality	04
000404	កំពង់លែង	Kampong Leaeng	04
000405	កំពង់ត្រឡាច	Kampong Tralach	04
000406	រលាប្អៀរ	Rolea B'ier	04
000407	សាមគ្គីមានជ័យ	Sameakki Mean Chey	04
000408	ទឹកផុស	Tuek Phos	04
000501	បរសេដ្ឋ	Basedth	05
000502	ក្រុងច្បារមន	Chbar Mon Municipality	05
000503	គងពិសី	Kong Pisei	05
000504	ឱរ៉ាល់	Aoral	05
000505	ឧដុង្គ	Odongk	05
000506	ភ្នំស្រួច	Phnum Sruoch	05
000507	សំរោងទង	Samraong Tong	05
000508	ថ្ពង	Thpong	05
000601	បារាយណ៍	Baray	06
000602	កំពង់ស្វាយ	Kampong Svay	06
000603	ក្រុងស្ទឹងសែន	Stueng Saen Municipality	06
000604	ប្រាសាទបល្ល័ង្គ	Prasat Ballangk	06
000605	ប្រាសាទសំបូរ	Prasat Sambour	06
000606	សណ្ដាន់	Sandan	06
000607	សន្ទុក	Santuk	06
000608	ស្ទោង	Stoung	06
000701	អង្គរជ័យ	Angkor Chey	07
000702	បន្ទាយមាស	Banteay Meas	07
000703	ឈូក	Chhuk	07
000704	ជុំគិរី	Chum Kiri	07
000705	ដងទង់	Dang Tong	07
000706	កំពង់ត្រាច	Kampong Trach	07
000707	ទឹកឈូ	Tuek Chhou	07
000708	ក្រុងកំពត	Kampot Municipality	07
000801	កណ្ដាលស្ទឹង	Kandal Stueng	08
000802	កៀនស្វាយ	Kien Svay	08
000803	ខ្សាច់កណ្ដាល	Khsach Kandal	08
000804	កោះធំ	Kaoh Thum	08
000805	លើកដែក	Leuk Daek	08
000806	ល្វាឯម	Lvea Aem	08
000807	មុខកំពូល	Mukh Kampul	08
000808	អង្គស្នួល	Angk Snuol	08
000809	ពញាឮ	Ponhea Lueu	08
000810	ស្អាង	S'ang	08
000811	ក្រុងតាខ្មៅ	Ta Khmau Municipality	08
000901	បុទុមសាគរ	Botum Sakor	09
000902	គិរីសាគរ	Kiri Sakor	09
000903	កោះកុង	Kaoh Kong	09
000904	ក្រុងខេមរភូមិន្ទ	Khemara Phoumin Municipality	09
000905	មណ្ឌលសីមា	Mondol Seima	09
000906	ស្រែ អំបិល	Srae Ambel	09
000907	ថ្មបាំង	Thma Bang	09
001001	ឆ្លូង	Chhloung	10
001002	ក្រុងក្រចេះ	Kracheh Municipality	10
001003	ព្រែកប្រសព្វ	Prek Prasab	10
001004	សំបូរ	Sambour	10
001005	ស្នួល	Snuol	10
001006	ចិត្របុរី	Chetr Borei	10
001101	កែវសីមា	Kaev Seima	11
001102	កោះញែក	Kaoh Nheaek	11
001103	អូររាំង	Ou Reang	11
001104	ពេជ្រាដា	Pech Chreada	11
001105	ក្រុងសែនមនោរម្យ	Saen Monourom Municipality	11
001201	ខណ្ឌចំការមន	Chamkar Mon Khan	12
001202	ខណ្ឌដូនពេញ	Doun Penh Khan	12
001203	ខណ្ឌ៧មករា	Prampir Meakkakra Khan	12
001204	ខណ្ឌទួលគោក	Tuol Kouk Khan	12
001205	ខណ្ឌដង្កោ	Dangkao Khan	12
001206	ខណ្ឌមានជ័យ	Mean Chey Khan	12
001207	ខណ្ឌឫស្សីកែវ	Russey Keo Khan	12
001208	ខណ្ឌសែនសុខ	Saensokh Khan	12
001209	ខណ្ឌពោធិ៍សែនជ័យ	Pur SenChey Khan	12
001210	ខណ្ឌជ្រោយចង្វារ	Chraoy Chongvar Khan	12
001211	ខណ្ឌព្រែកព្នៅ	Praek Pnov Khan	12
001212	ខណ្ឌច្បារអំពៅ	Chbar Ampov Khan	12
001301	ជ័យសែន	Chey Saen	13
001302	ឆែប	Chhaeb	13
001303	ជាំក្សាន្ដ	Choam Ksant	13
001304	គូលែន	Kuleaen	13
001305	រវៀង	Rovieng	13
001306	សង្គមថ្មី	Sangkum Thmei	13
001307	ត្បែងមានជ័យ	Tbaeng Mean Chey	13
001308	ក្រុងព្រះវិហារ	Preah Vihear Municipality	13
001401	បាភ្នំ	Ba Phnum	14
001402	កំចាយមារ	Kamchay Mear	14
001403	កំពង់ត្របែក	Kampong Trabaek	14
001404	កញ្ជ្រៀច	Kanhchriech	14
001405	មេសាង	Me Sang	14
001406	ពាមជរ	Peam Chor	14
001407	ពាមរក៍	Peam Ro	14
001408	ពារាំង	Pea Reang	14
001409	ព្រះស្ដេច	Preah Sdach	14
001410	ក្រុងព្រៃវែង	Prey Veng Municipality	14
001411	ពោធិ៍រៀង	Pur Rieng	14
001412	ស៊ីធរកណ្ដាល	Sithor Kandal	14
001413	ស្វាយអន្ទរ	Svay Antor	14
001501	បាកាន	Bakan	15
001502	កណ្ដៀង	Kandieng	15
001503	ក្រគរ	Krakor	15
001504	ភ្នំក្រវ៉ាញ	Phnum Kravanh	15
001505	ក្រុងពោធិ៍សាត់	Pursat Municipality	15
001506	វាលវែង	Veal Veaeng	15
001601	អណ្ដូងមាស	Andoung Meas	16
001602	ក្រុងបានលុង	Ban Lung Municipality	16
001603	បរកែវ	Bar Kaev	16
001604	កូនមុំ	Koun Mom	16
001605	លំផាត់	Lumphat	16
001606	អូរជុំ	Ou Chum	16
001607	អូរយ៉ាដាវ	Ou Ya Dav	16
001608	តាវែង	Ta Veaeng	16
001609	វើនសៃ	Veun Sai	16
001701	អង្គរជុំ	Angkor Chum	17
001702	អង្គរធំ	Angkor Thum	17
001703	បន្ទាយស្រី	Banteay Srei	17
001704	ជីក្រែង	Chi Kraeng	17
001706	ក្រឡាញ់	Kralanh	17
001707	ពួក	Puok	17
001709	ប្រាសាទបាគង	Prasat Bakong	17
001710	ក្រុងសៀមរាប	Siem Reap Municipality	17
001711	សូទ្រនិគម	Soutr Nikom	17
001712	ស្រីស្នំ	Srei Snam	17
001713	ស្វាយលើ	Svay Leu	17
001714	វ៉ារិន	Varin	17
001801	ក្រុងព្រះសីហនុ	Preah Sihanouk Municipality	18
001802	ព្រៃនប់	Prey Nob	18
001803	ស្ទឹងហាវ	Stueng Hav	18
001804	កំពង់សីលា	Kampong Seila	18
001901	សេសាន	Sesan	19
001902	សៀមបូក	Siem Bouk	19
001903	សៀមប៉ាង	Siem Pang	19
001904	ក្រុងស្ទឹងត្រែង	Stueng Traeng Municipality	19
001905	ថាឡាបរិវ៉ាត់	Thala Barivat	19
002001	ចន្ទ្រា	Chantrea	20
002002	កំពង់រោទិ៍	Kampong Rou	20
002003	រំដួល	Rumduol	20
002004	រមាសហែក	Romeas Haek	20
002005	ស្វាយជ្រំ	Svay Chrum	20
002006	ក្រុងស្វាយរៀង	Svay Rieng Municipality	20
002007	ស្វាយទាប	Svay Teab	20
002008	ក្រុងបាវិត	Bavet Municipality	20
002101	អង្គរបូរី	Angkor Borei	21
002102	បាទី	Bati	21
002103	បូរីជលសារ	Borei Cholsar	21
002104	គីរីវង់	Kiri Vong	21
002105	កោះអណ្ដែត	Kaoh Andaet	21
002106	ព្រៃកប្បាស	Prey Kabbas	21
002107	សំរោង	Samraong	21
002108	ក្រុងដូនកែវ	Doun Kaev Municipality	21
002109	ត្រាំកក់	Tram Kak	21
002110	ទ្រាំង	Treang	21
002201	អន្លង់វែង	Anlong Veaeng	22
002202	បន្ទាយអំពិល	Banteay Ampil	22
002203	ចុងកាល់	Chong Kal	22
002204	ក្រុងសំរោង	Samraong Municipality	22
002205	ត្រពាំងប្រាសាទ	Trapeang Prasat	22
002301	ដំណាក់ចង្អើរ	Damnak Chang'aeur	23
002302	ក្រុងកែប	Kaeb Municipality	23
002401	ក្រុងប៉ៃលិន	Pailin Municipality	24
002402	សាលាក្រៅ	Sala Krau	24
002501	តំបែរ	Dambae	25
002502	ក្រូចឆ្មារ	Krouch Chhmar	25
002503	មេមត់	Memot	25
002504	អូររាំងឪ	Ou Reang Ov	25
002505	ពញាក្រែក	Ponhea Kraek	25
002506	ក្រុងសួង	Suong Municipality	25
002507	ត្បូងឃ្មុំ	Tboung Khmum	25
\.


--
-- Data for Name: communes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.communes (commune_code, name_kh, name_en, district_id) FROM stdin;
010211	សឿ	Soea	000102
050901	វាំងចាស់	Veang Chas	\N
050902	វាលពង់	Veal Pung	\N
050903	ត្រាចទង	Trach Tong	\N
050904	ព្រះស្រែ	Preah Srae	\N
050905	ក្សេមក្សាន្ដ	Khsem Khsan	\N
051001	ចាន់សែន	Chan Saen	\N
051002	ជើងរាស់	Cheung Roas	\N
051003	ជំពូព្រឹក្ស	Chumpu Proek	\N
051004	ក្រាំងចេក	Krang Chek	\N
051005	មានជ័យ	Mean Chey	\N
051006	ព្រៃក្រសាំង	Prey Krasang	\N
051007	យុទ្ធសាមគ្គី	Yut Sammeakki	\N
051008	ដំណាក់រាំង	Damnak Reang	\N
051009	ពាំងល្វា	Peang Lvea	\N
051010	ភ្នំតូច	Phnum Touch	\N
060901	ពង្រ	Pungro	\N
060902	ច្រនាង	Chraneang	\N
060903	ជ្រលង	Chrolong	\N
060904	ទ្រៀល	Triel	\N
060905	សូយោង	Sou Young	\N
060906	ស្រឡៅ	Sralau	\N
060907	ស្វាយភ្លើង	Svay Phleung	\N
060908	អណ្ដូងពោធិ៍	Andoung Pou	\N
060401	ដូង	Doung	000604
070901	បឹងទូក	Boeng Tuk	\N
070902	កោះតូច	Kaoh Touch	\N
070903	ព្រែកត្នោត	Preaek Tnaot	\N
081201	ឈើខ្មៅ	Chheu Khmau	\N
081202	ព្រែកជ្រៃ	Preaek Chrey	\N
081203	ព្រែកស្ដី	Preak Sdei	\N
081204	ជ្រោយតាកែវ	Chrouy Ta Kaev	\N
081205	សំពៅពូន	Sampov Pun	\N
081301	បាក់ដាវ	Bak Dav	\N
081302	កោះឧកញ៉ាតី	Kaoh Oknha Tei	\N
081303	ព្រែកអំពិល	Preaek Ampil	\N
081304	ព្រែកលួង	Preaek Luong	\N
081305	ព្រែកតាកូវ	Preaek Ta Kouv	\N
081306	ស្វាយជ្រំ	Svay Chrum	\N
081307	អរិយក្សត្រ	Akrey Ksat	\N
081308	សារិកាកែវ	Sarikakaev	\N
081309	ពាមឧកញ៉ាអុង	Peam Oknha Ong	\N
081310	ព្រែកក្មេង	Preaek Kmeng	\N
081311	បារុង	Barong	\N
080604	កោះកែវ	Kaoh Kaev	000806
100701	ក្បាលដំរី	Kbal Damrei	\N
100702	អូរគ្រៀង	Ou Krieng	\N
100703	អូរកណ្ដៀរសែនជ័យ	Ou Kandie Saen Chey	\N
100704	រលួសមានជ័យ	Roluos Mean Chey	\N
100705	ស្រែជិះ	Srae Chis	\N
121301	បឹងកេងកងទី ១	Boeng Keng Kang Ti Muoy	\N
121302	បឹងកេងកងទី ២	Boeng Keng Kang Ti Pir	\N
121303	បឹងកេងកងទី ៣	Boeng Keng Kang Ti Bei	\N
121304	អូឡាំពិក	Oulampik	\N
121305	ទំនប់ទឹក	Tumnub Tuek	\N
121306	ទួលស្វាយព្រៃទី ១	Tuol Svay Prey Ti Muoy	\N
121307	ទួលស្វាយព្រៃទី ២	Tuol Svay Prey Ti Pir	\N
121401	កំបូល	Kamboul	\N
121402	កន្ទោក	Kantaok	\N
121403	ឪឡោក	Ovlaok	\N
121404	ស្នោរ	Snaor	\N
121405	ភ្លើងឆេះរទេះ	Phleung Chheh Roteh	\N
121406	បឹងធំ	Boeng Thum	\N
121407	ប្រទះឡាង	Prateah Lang	\N
150701	តាលោ	Ta Lou	\N
150702	ផ្ទះរុង	Phteah Rung	\N
040808	ទួលខ្ពស់	Tuol Khpos	000408
040809	ក្តុលសែនជ័យ	Kdol Saen Chey	000408
050101	បរសេដ្ឋ	Basaed	000501
050102	កាត់ភ្លុក	Kat Phluk	000501
050103	និទាន	Nitean	000501
050104	ភក្ដី	Pheakdei	000501
050105	ភារីមានជ័យ	Pheari Mean Chey	000501
050106	ផុង	Phong	000501
050107	ពោធិអង្ក្រង	Pou Angkrang	000501
050108	ពោធិ៍ចំរើន	Pou Chamraeun	000501
050109	ពោធិ៍ម្រាល	Pou Mreal	000501
050110	ស្វាយចចិប	Svay Chacheb	000501
050111	ទួលអំពិល	Tuol Ampil	000501
050112	ទួលសាលា	Tuol Sala	000501
050113	កក់	Kak	000501
050114	ស្វាយរំពារ	Svay Rumpear	000501
050115	ព្រះខែ	Preah Khae	000501
050201	ច្បារមន	Chbar Mon	000502
050202	កណ្ដោលដុំ	Kandaol Dom	000502
050203	រការធំ	Rokar Thum	000502
050204	សុព័រទេព	Sopoar Tep	000502
050205	ស្វាយក្រវ៉ាន់	Svay Kravan	000502
050301	អង្គពពេល	Ang Popel	000503
050302	ជង្រុក	Chungruk	000503
050303	មហាឫស្សី	Moha Ruessei	000503
050304	ពេជ្រមុនី	Pech Muni	000503
050305	ព្រះនិព្វាន	Preah Nipean	000503
050306	ព្រៃញាតិ	Prey Nheat	000503
050307	ព្រៃវិហារ	Prey Vihea	000503
050308	រកាកោះ	Roka Kaoh	000503
050309	ស្ដុក	Sdok	000503
050310	ស្នំក្រពើ	Snam Krapeu	000503
050311	ស្រង់	Srang	000503
050312	ទឹកល្អក់	Tuek L'ak	000503
050313	វាល	Veal	000503
050401	ហោងសំណំ	Haong Samnam	000504
050402	រស្មីសាមគ្គី	Reaksmei Sammeakki	000504
050403	ត្រពាំងជោ	Trapeang Chou	000504
050404	សង្កែសាទប	Sangkae Satob	000504
050405	តាសាល	Ta Sal	000504
050601	ចំបក់	Chambak	000506
050602	ជាំសង្កែ	Choam Sangkae	000506
050603	ដំបូករូង	Dambouk Rung	000506
050604	គិរីវន្ដ	Kiri Voan	000506
050605	ក្រាំងដីវ៉ាយ	Krang Dei Vay	000506
050606	មហាសាំង	Moha Sang	000506
050607	អូរ	Ou	000506
050608	ព្រៃរំដួល	Prey Rumduol	000506
050609	ព្រៃក្មេង	Prey Kmeng	000506
050610	តាំងសំរោង	Tang Samraong	000506
050611	តាំងស្យា	Tang Sya	000506
050613	ត្រែងត្រយឹង	Traeng Trayueng	000506
050614	យាយម៉ៅពេជ្រនិល	Yeay Mau Pech Nil	000506
050701	រលាំងចក	Roleang Chak	000507
050702	កាហែង	Kahaeng	000507
050703	ខ្ទុំក្រាំង	Khtum Krang	000507
050704	ក្រាំងអំពិល	Krang Ampil	000507
050705	ព្នាយ	Pneay	000507
050706	រលាំងគ្រើល	Roleang Kreul	000507
050707	សំរោងទង	Samrong Tong	000507
171501	រុនតាឯក	Run Ta Aek	\N
171502	បល្ល័ង្ក	Ballang	\N
050708	សំបូរ	Sambour	000507
050709	សែងដី	Saen Dei	000507
010201	បន្ទាយនាង	Banteay Neang	000102
010202	បត់ត្រង់	Bat Trang	000102
010203	ចំណោម	Chamnaom	000102
010204	គោកបល្ល័ង្គ	Kouk Ballang	000102
180501	កោះរ៉ុង	Kaoh Rung	\N
180502	កោះរ៉ុងសន្លឹម	Koah Rung Sonlem	\N
180601	បឹងតាព្រហ្ម	Boeng Ta Prum	\N
180602	បិតត្រាង	Bet Trang	\N
180603	អូរជ្រៅ	Ou Chrov	\N
180604	អូរឧកញ៉ាហេង	Ou Oknha Heng	\N
180605	រាម	Ream	\N
010205	គយម៉ែង	Koy Maeng	000102
010206	អូរប្រាសាទ	Ou Prasat	000102
010207	ភ្នំតូច	Phnum Touch	000102
010208	រហាត់ទឹក	Rohat Tuek	000102
010209	ឫស្សីក្រោក	Ruessei Kraok	000102
010210	សំបួរ	Sambuor	000102
010212	ស្រះរាំង	Srah Reang	000102
010213	តាឡំ	Ta Lam	000102
010301	ណាំតៅ	Nam Tau	000103
010302	ប៉ោយចារ	Paoy Char	000103
010303	ពន្លៃ	Punley	000103
010304	ស្ពានស្រែង	Spean Sraeng	000103
010305	ស្រះជីក	Srah Chik	000103
010306	ភ្នំដី	Phnum Dei	000103
010401	ឈ្នួរមានជ័យ	Chhnuo Mean Chey	000104
010402	ជប់វារី	Chub Vari	000104
010403	ភ្នំលៀប	Phnum Lieb	000104
010404	ប្រាសាទ	Prasat	000104
010405	ព្រះនេត្រព្រះ	Preah Net Preah	000104
010406	រហាល	Rohal	000104
010407	ទានកាំ	Tean Kam	000104
010408	ទឹកជោរ	Tuek Chour	000104
010409	បុស្បូវ	Bos Sbouv	000104
010501	ចង្ហា	Changha	000105
010502	កូប	Koub	000105
010503	គុត្ដសត	Kuttasat	000105
010505	សំរោង	Samraong	000105
010506	សូភី	Souphi	000105
010507	សឹង្ហ	Soeng	000105
010509	អូរបីជាន់	Ou Beichoan	000105
010602	កំពង់ស្វាយ	Kampong Svay	000106
190601	អូរស្វាយ	Ou Svay	\N
190602	កោះស្នែង	Kaoh Snaeng	\N
190603	ព្រះរំកិល	Preah Rumkel	\N
010603	កោះពងសត្វ	Kaoh Pong Sat	000106
010604	ម្កាក់	Mkak	000106
010605	អូរអំបិល	Ou Ambel	000106
010606	ភ្នៀត	Phniet	000106
010607	ព្រះពន្លា	Preah Punlea	000106
010608	ទឹកថ្លា	Tuek Thla	000106
010701	បន្ទាយឆ្មារ	Banteay Chhmar	000107
010702	គោករមៀត	Kouk Romiet	000107
010703	ភូមិថ្មី	Phum Thmei	000107
010704	ថ្មពួក	Thma Puok	000107
010705	គោកកឋិន	Kouk Kakthen	000107
010706	គំរូ	Kumru	000107
010801	ផ្គាំ	Phkoam	000108
010802	សារង្គ	Sarongk	000108
010803	ស្លក្រាម	Sla Kram	000108
010804	ស្វាយចេក	Svay Chek	000108
010805	តាបែន	Ta Baen	000108
010806	តាផូ	Ta Phou	000108
010807	ទ្រាស	Treas	000108
010808	រលួស	Roluos	000108
010901	បឹងបេង	Boeng Beng	000109
010902	ម៉ាឡៃ	Malai	000109
010903	អូរសំព័រ	Ou Sampoar	000109
010904	អូរស្រឡៅ	Ou Sralau	000109
010905	ទួលពង្រ	Tuol Pongro	000109
010906	តាគង់	Ta Kong	000109
011001	និមិត្ដ	Nimit	000110
011002	ប៉ោយប៉ែត	Paoy Paet	000110
011003	ផ្សារកណ្តាល	Phsar Kandal	000110
011004	អូរជ្រៅ	Ou Chrov	000110
011005	អូរឫស្សី	Ou Ruessei	000110
020101	កន្ទឺ ១	Kantueu Muoy	000201
020102	កន្ទឺ ២	Kantueu Pir	000201
020103	បាយដំរាំ	Bay Damram	000201
020104	ឈើទាល	Chheu Teal	000201
020105	ចែងមានជ័យ	Chaeng Mean Chey	000201
020106	ភ្នំសំពៅ	Phnum Sampov	000201
020107	ស្នឹង	Snoeng	000201
020108	តាគ្រាម	Ta Kream	000201
020201	តាពូង	Ta Pung	000202
020202	តាម៉ឺន	Ta Meun	000202
020203	អូរតាគី	Ou Ta Ki	000202
020204	ជ្រៃ	Chrey	000202
020205	អន្លង់រុន	Anlung Run	000202
020206	ជ្រោយស្ដៅ	Chrouy Sdau	000202
020207	បឹងព្រីង	Boeng Pring	000202
020208	គោកឃ្មុំ	Kouk Khmum	000202
020209	បន្សាយត្រែង	Bansay Traeng	000202
020210	រូងជ្រៃ	Rung Chrey	000202
020301	ទួលតាឯក	Tuol Ta Ek	000203
020302	ព្រែកព្រះស្ដេច	Prek Preah Sdach	000203
020303	រតនៈ	Rottaknak	000203
020304	ចំការសំរោង	Chomkar Somraong	000203
020305	ស្លាកែត	Sla Ket	000203
020306	ក្ដុលដូនទាវ	Kdol Doun Teav	000203
020307	អូរម៉ាល់	OMal	000203
020308	វត្ដគរ	wat Kor	000203
020309	អូរចារ	Ou Char	000203
020310	ស្វាយប៉ោ	Svay Por	000203
020401	បវេល	Bavel	000204
020402	ខ្នាចរមាស	Khnach Romeas	000204
020403	ល្វា	Lvea	000204
020404	ព្រៃខ្ពស់	Prey Khpos	000204
020405	អំពិលប្រាំដើម	Ampil Pram Daeum	000204
020406	ក្ដុលតាហែន	Kdol Ta Haen	000204
020407	បឹងប្រាំ	Boeung Pram	000204
020408	ឃ្លាំងមាស	Khlaeng Meas	000204
020409	បូវិល	Buovel	000204
020501	ព្រែកនរិន្ទ	Preaek Norin	000205
020502	សំរោងក្នុង	Samraong Knong	000205
020503	ព្រែកខ្ពប	Preaek Khpob	000205
020504	ព្រែកហ្លួង	Preaek Luong	000205
020505	ពាមឯក	Peam Aek	000205
020506	ព្រៃចាស់	Prey Chas	000205
020507	កោះជីវាំង	Kaoh Chiveang	000205
020601	មោង	Moung	000206
020602	គារ	Kear	000206
020603	ព្រៃស្វាយ	Prey Svay	000206
020604	ឫស្សីក្រាំង	Ruessei Krang	000206
020605	ជ្រៃ	Chrey	000206
020606	តាលាស់	Ta Loas	000206
020607	កកោះ	Kakaoh	000206
020608	ព្រៃតូច	Prey Touch	000206
020609	របស់មង្គល	Robas Mongkol	000206
020701	ស្ដៅ	Sdau	000207
020702	អណ្ដើកហែប	Andaeuk Haeb	000207
020703	ផ្លូវមាស	Phlov Meas	000207
020704	ត្រែង	Traeng	000207
020705	រស្មីសង្ហារ	Reaksmei Songha	000207
020801	អន្លង់វិល	Anlung Vil	000208
020802	នរា	Norea	000208
020803	តាប៉ុន	Ta Pon	000208
020804	រកា	Roka	000208
020805	កំពង់ព្រះ	Kampong Preah	000208
020806	កំពង់ព្រៀង	Kampong Prieng	000208
020807	រាំងកេសី	Reang Kesei	000208
020808	អូរដំបង ១	Ou Dambang Muoy	000208
020809	អូរដំបង ២	Ou Dambang Pir	000208
020810	វត្ដតាមិម	Vaot Ta Muem	000208
020901	តាតោក	Ta Taok	000209
020902	កំពង់ល្ពៅ	Kampong Lpov	000209
020903	អូរសំរិល	Ou Samrel	000209
020904	ស៊ុង	Sung	000209
020905	សំឡូត	Samlout	000209
020906	មានជ័យ	Mean Chey	000209
020907	តាសាញ	Ta Sanh	000209
021001	សំពៅលូន	Sampov Lun	000210
021002	អង្គរបាន	Angkor Ban	000210
021003	តាស្ដា	Ta Sda	000210
021004	សន្ដិភាព	Santepheap	000210
021005	សេរីមានជ័យ	Serei Mean Chey	000210
021006	ជ្រៃសីមា	Chrey Seima	000210
021101	ភ្នំព្រឹក	Phnum Proek	000211
021102	ពេជ្រចិន្ដា	Pech Chenda	000211
021104	បារាំងធ្លាក់	Barang Thleak	000211
021105	អូររំដួល	Ou Rumduol	000211
021106	បួរ	Bour	000211
021201	កំរៀង	Kamrieng	000212
021202	បឹងរាំង	Boeng Reang	000212
021203	អូរដា	Ou Da	000212
021204	ត្រាង	Trang	000212
021205	តាសែន	Ta Saen	000212
021206	តាក្រី	Ta Krei	000212
021301	ធិបតី	Thipakdei	000213
021302	គាស់ក្រឡ	Kaos Krala	000213
021303	ហប់	Hab	000213
021304	ព្រះផុស	Preah Phos	000213
021305	ដូនបា	Doun Ba	000213
021306	ឆ្នាល់មាន់	Chhnal Moan	000213
021401	ព្រែកជីក	Preaek Chik	000214
021402	ព្រៃត្រឡាច	Prey Tralach	000214
021403	បាសាក់	Basak	000214
021404	មុខរាហ៍	Mukh Rea	000214
021405	ស្តុកប្រវឹក	Sdok Pravoek	000214
030101	បាធាយ	Batheay	000301
030102	ច្បារអំពៅ	Chbar Ampov	000301
030103	ជាលា	Chealea	000301
030104	ជើងព្រៃ	Cheung Prey	000301
030105	មេព្រីង	Me Pring	000301
030106	ផ្អាវ	Phav	000301
030107	សំបូរ	Sambour	000301
030108	សណ្ដែក	Sandaek	000301
030109	តាំងក្រាំង	Tang Krang	000301
030110	តាំងក្រសាំង	Tang Krasang	000301
030111	ត្រប់	Trab	000301
030112	ទំនប់	Tumnob	000301
030201	បុសខ្នុរ	Bos Khnor	000302
030202	ចំការអណ្ដូង	Chamkar Andoung	000302
030203	ជយោ	Cheyyou	000302
030204	ល្វាលើ	Lvea Leu	000302
030205	ស្ពឺ	Spueu	000302
030206	ស្វាយទាប	Svay Teab	000302
030207	តាអុង	Ta Ong	000302
030208	តាប្រុក	Ta Prok	000302
030301	ខ្នុរដំបង	Khnor Dambang	000303
030302	គោករវៀង	Kouk Rovieng	000303
030303	ផ្ដៅជុំ	Pdau Chum	000303
030304	ព្រៃចារ	Prey Char	000303
030305	ព្រីងជ្រុំ	Pring Chrum	000303
030306	សំពងជ័យ	Sampong Chey	000303
030307	ស្ដើងជ័យ	Sdaeung Chey	000303
030308	សូទិព្វ	Soutib	000303
030309	ស្រម៉រ	Sramar	000303
030310	ត្រពាំងគរ	Trapeang Kor	000303
030501	បឹងកុក	Boeng Kok	000305
030502	កំពង់ចាម	Kampong Cham	000305
030503	សំបួរមាស	Sambuor Meas	000305
030504	វាលវង់	Veal Vung	000305
030601	អំពិល	Ampil	000306
030602	ហាន់ជ័យ	Hanchey	000306
030603	កៀនជ្រៃ	Kien Chrey	000306
030604	គគរ	Kokor	000306
030605	កោះមិត្ដ	Kaoh Mitt	000306
030606	កោះរកា	Kaoh Roka	000306
030607	កោះសំរោង	Kaoh Samraong	000306
030608	កោះទន្ទឹម	Kaoh Tontuem	000306
030609	ក្រឡា	Krala	000306
030610	អូរស្វាយ	Ou Svay	000306
030611	រអាង	Ro'ang	000306
030612	រំចេក	Rumchek	000306
030613	ស្រក	Srak	000306
030614	ទ្រាន	Trean	000306
030615	វិហារធំ	Vihea Thum	000306
030701	អង្គរបាន	Angkor Ban	000307
030702	កងតាណឹង	Kang Ta Noeng	000307
030703	ខ្ចៅ	Khchau	000307
030704	ពាមជីកង	Peam Chi Kang	000307
030705	ព្រែកកុយ	Preaek Koy	000307
030706	ព្រែកក្របៅ	Preaek Krabau	000307
030707	រាយប៉ាយ	Reay Pay	000307
030708	រកាអារ	Roka Ar	000307
030709	រកាគយ	Roka Koy	000307
030710	ស្ដៅ	Sdau	000307
030711	សូរគង	Sour Kong	000307
030801	កំពង់រាប	Kampong Reab	000308
030802	កោះសូទិន	Kaoh Sotin	000308
030803	ល្វេ	Lve	000308
030804	មហាលាភ	Moha Leaph	000308
030805	មហាខ្ញូង	Moha Khnhoung	000308
030806	ពាមប្រធ្នោះ	Peam Prathnuoh	000308
030807	ពង្រ	Pongro	000308
030808	ព្រែកតានង់	Preaek Ta Nong	000308
031301	បារាយណ៍	Baray	000313
031302	បឹងណាយ	Boeng Nay	000313
031303	ជ្រៃវៀន	Chrey Vien	000313
031304	ខ្វិតធំ	Khvet Thum	000313
031305	គរ	Kor	000313
031306	ក្រូច	Krouch	000313
031307	ល្វា	Lvea	000313
031308	មៀន	Mien	000313
031309	ព្រៃឈរ	Prey Chhor	000313
031310	សូរ្យសែន	Sou Saen	000313
031311	សំរោង	Samraong	000313
031312	ស្រង៉ែ	Srangae	000313
031313	ថ្មពូន	Thma Pun	000313
031314	តុងរ៉ុង	Tong Rong	000313
031315	ត្រពាំងព្រះ	Trapeang Preah	000313
031401	បារាយណ៍	Baray	000314
031402	ជីបាល	Chi Bal	000314
031403	ខ្នារស	Khnar Sa	000314
031404	កោះអណ្ដែត	Kaoh Andaet	000314
031405	មានជ័យ	Mean Chey	000314
031406	ផ្ទះកណ្ដាល	Phteah Kandal	000314
031407	ប្រាំយ៉ាម	Pram Yam	000314
031408	ព្រែកដំបូក	Preaek Dambouk	000314
031409	ព្រែកពោធិ	Preaek Pou	000314
031410	ព្រែករំដេង	Preaek Rumdeng	000314
031411	ឫស្សីស្រុក	Ruessei Srok	000314
031412	ស្វាយពោធិ	Svay Pou	000314
031413	ស្វាយខ្សាច់ភ្នំ	Svay Khsach Phnum	000314
031414	ទងត្រឡាច	Tong Tralach	000314
031501	អារក្សត្នោត	Areak Tnaot	000315
031503	ដងក្ដារ	Dang Kdar	000315
031504	ខ្ពបតាងួន	Khpob Ta Nguon	000315
031505	មេសរជ្រៃ	Me Sar Chrey	000315
031506	អូរម្លូ	Ou Mlu	000315
031507	ពាមកោះស្នា	Peam Kaoh Sna	000315
031508	ព្រះអណ្ដូង	Preah Andoung	000315
031509	ព្រែកបាក់	Preaek Bak	000315
031510	ព្រែកកក់	Preak Kak	000315
031512	សូភាស	Soupheas	000315
031513	ទួលព្រះឃ្លាំង	Tuol Preah Khleang	000315
031514	ទួលសំបួរ	Tuol Sambuor	000315
040101	អញ្ចាញរូង	Anhchanh Rung	000401
040102	ឆ្នុកទ្រូ	Chhnok Tru	000401
040103	ចក	Chak	000401
040104	ខុនរ៉ង	Khon Rang	000401
040105	កំពង់ព្រះគគីរ	Kampong Preah Kokir	000401
040106	មេលំ	Melum	000401
040107	ផ្សារ	Phsar	000401
050710	ស្គុះ	Skuh	000507
10201	បន្ទាយនាង	Banteay Neang	\N
10202	បត់ត្រង់	Bat Trang	\N
10203	ចំណោម	Chamnaom	\N
10204	គោកបល្ល័ង្គ	Kouk Ballangk	\N
10205	គយម៉ែង	Koy Maeng	\N
10206	អូរប្រាសាទ	Ou Prasat	\N
10207	ភ្នំតូច	Phnum Touch	\N
10208	រហាត់ទឹក	Rohat Tuek	\N
10209	ឫស្សីក្រោក	Ruessei Kraok	\N
10210	សំបួរ	Sambuor	\N
10211	សឿ	Soea	\N
10212	ស្រះរាំង	Srah Reang	\N
10213	តាឡំ	Ta Lam	\N
10301	ណាំតៅ	Nam Tau	\N
10302	ប៉ោយចារ	Poy Char	\N
10303	ពន្លៃ	Ponley	\N
10304	ស្ពានស្រែង	Spean Sraeng	\N
10305	ស្រះជីក	Srah Chik	\N
10306	ភ្នំដី	Phnum Dei	\N
10401	ឈ្នួរមានជ័យ	Chnuor Mean Chey	\N
10402	ជប់វារី	Chob Vari	\N
10403	ភ្នំលៀប	Phnum Lieb	\N
10404	ប្រាសាទ	Prasat	\N
10405	ព្រះនេត្រព្រះ	Preak Netr Preah	\N
10406	រហាល	Rohal	\N
10407	ទានកាំ	Tean Kam	\N
10408	ទឹកជោរ	Tuek Chour	\N
10409	បុស្បូវ	Bos Sbov	\N
10501	ចង្ហា	Changha	\N
10502	កូប	Koub	\N
10503	គុត្ដសត	Kuttasat	\N
10505	សំរោង	Samraong	\N
10506	សូភី	Souphi	\N
10507	សឹង្ហ	Soengh	\N
10509	អូរបីជាន់	Ou Beichoan	\N
10602	សង្កាត់កំពង់ស្វាយ	Kampong Svay Sangkat	\N
10603	សង្កាត់កោះពងសត្វ	Kaoh Pong Satv Sangkat	\N
10604	សង្កាត់ម្កាក់	Mkak Sangkat	\N
10605	សង្កាត់អូរអំបិល	Ou Ambel Sangkat	\N
10606	សង្កាត់ភ្នៀត	Phniet Sangkat	\N
10607	សង្កាត់ព្រះពន្លា	Preah Ponlea Sangkat	\N
10608	សង្កាត់ទឹកថ្លា	Tuek Thla Sangkat	\N
10701	បន្ទាយឆ្មារ	Banteay Chhmar	\N
10702	គោករមៀត	Kouk Romiet	\N
10703	ភូមិថ្មី	Phum Thmei	\N
10704	ថ្មពួក	Thma Puok	\N
10705	គោកកឋិន	Kouk Kakthen	\N
10706	គំរូ	Kumru	\N
10801	ផ្គាំ	Phkoam	\N
10802	សារង្គ	Sarongk	\N
10803	ស្លក្រាម	Sla Kram	\N
10804	ស្វាយចេក	Svay Chek	\N
10805	តាបែន	Ta Baen	\N
10806	តាផូ	Ta Phou	\N
10807	ទ្រាស	Treas	\N
10808	រលួស	Roluos	\N
10901	បឹងបេង	Boeng Beng	\N
10902	ម៉ាឡៃ	Malai	\N
10903	អូរសំព័រ	Ou Sampoar	\N
10904	អូរស្រឡៅ	Ou Sralau	\N
10905	ទួលពង្រ	Tuol Pongro	\N
10906	តាគង់	Ta Kong	\N
11001	សង្កាត់និមិត្ដ	Nimitt Sangkat	\N
11002	សង្កាត់ប៉ោយប៉ែត	Paoy Paet Sangkat	\N
11003	សង្កាត់ផ្សារកណ្តាល	Phsar Kandal Sangkat	\N
20101	កន្ទឺ ១	Kantueu Muoy	\N
20102	កន្ទឺ ២	Kantueu Pir	\N
20103	បាយដំរាំ	Bay Damram	\N
20104	ឈើទាល	Chheu Teal	\N
20105	ចែងមានជ័យ	Chaeng Mean Chey	\N
20106	ភ្នំសំពៅ	Phnum Sampov	\N
20107	ស្នឹង	Snoeng	\N
20108	តាគ្រាម	Ta Kream	\N
20201	តាពូង	Ta Pung	\N
20202	តាម៉ឺន	Ta Meun	\N
20203	អូរតាគី	Ou Ta Ki	\N
20204	ជ្រៃ	Chrey	\N
20205	អន្លង់រុន	Anlong Run	\N
20206	ជ្រោយស្ដៅ	Chrouy Sdau	\N
20207	បឹងព្រីង	Boeng Pring	\N
20208	គោកឃ្មុំ	Kouk Khmum	\N
20209	បន្សាយត្រែង	Bansay Traeng	\N
20210	រូងជ្រៃ	Rung Chrey	\N
20301	សង្កាត់ទួលតាឯក	Tuol Ta Ek Sangkat	\N
20302	សង្កាត់ព្រែកព្រះស្ដេច	Prek Preah Sdach Sangkat	\N
20303	សង្កាត់រតនៈ	Rottanak Sangkat	\N
20304	សង្កាត់ចំការសំរោង	Chomkar Somraong Sangkat	\N
20305	សង្កាត់ស្លាកែត	Sla Ket Sangkat	\N
20306	សង្កាត់ក្ដុលដូនទាវ	Kdol Doun Teav Sangkat	\N
20307	សង្កាត់អូរម៉ាល់	OMal Sangkat	\N
20308	សង្កាត់វត្ដគរ	wat Kor Sangkat	\N
20309	សង្កាត់អូរចារ	Ou Char Sangkat	\N
20310	សង្កាត់ស្វាយប៉ោ	Svay Por Sangkat	\N
20401	បវេល	Bavel	\N
20402	ខ្នាចរមាស	Khnach Romeas	\N
20403	ល្វា	Lvea	\N
20404	ព្រៃខ្ពស់	Prey Khpos	\N
20405	អំពិលប្រាំដើម	Ampil Pram Daeum	\N
20406	ក្ដុលតាហែន	Kdol Ta Haen	\N
20407	ឃ្លាំងមាស	Khlaeng Meas	\N
20408	បឹងប្រាំ	Boeung Pram	\N
20501	ព្រែកនរិន្ទ	Preaek Norint	\N
20502	សំរោងក្នុង	Samraong Knong	\N
20503	ព្រែកខ្ពប	Preaek Khpob	\N
20504	ព្រែកហ្លួង	Preaek Luong	\N
20505	ពាមឯក	Peam Aek	\N
20506	ព្រៃចាស់	Prey Chas	\N
20507	កោះជីវាំង	Kaoh Chiveang	\N
20601	មោង	Moung	\N
20602	គារ	Kear	\N
20603	ព្រៃស្វាយ	Prey Svay	\N
20604	ឫស្សីក្រាំង	Ruessei Krang	\N
20605	ជ្រៃ	Chrey	\N
20606	តាលាស់	Ta Loas	\N
20607	កកោះ	Kakaoh	\N
20608	ព្រៃតូច	Prey Touch	\N
20609	របស់មង្គល	Robas Mongkol	\N
20701	ស្ដៅ	Sdau	\N
20702	អណ្ដើកហែប	Andaeuk Haeb	\N
20703	ផ្លូវមាស	Phlov Meas	\N
20704	ត្រែង	Traeng	\N
20705	រស្មីសង្ហារ	Reaksmei Songha	\N
20801	អន្លង់វិល	Anlong Vil	\N
20802	នរា	Norea	\N
20803	តាប៉ុន	Ta Pon	\N
20804	រកា	Roka	\N
20805	កំពង់ព្រះ	Kampong Preah	\N
20806	កំពង់ព្រៀង	Kampong Prieng	\N
20807	រាំងកេសី	Reang Kesei	\N
20808	អូរដំបង ១	Ou Dambang Muoy	\N
20809	អូរដំបង ២	Ou Dambang Pir	\N
20810	វត្ដតាមិម	Vaot Ta Muem	\N
20901	តាតោក	Ta Taok	\N
20902	កំពង់ល្ពៅ	Kampong Lpov	\N
20903	អូរសំរិល	Ou Samril	\N
20904	ស៊ុង	Sung	\N
20905	សំឡូត	Samlout	\N
20906	មានជ័យ	Mean Chey	\N
20907	តាសាញ	Ta Sanh	\N
21001	សំពៅលូន	Sampov Lun	\N
21002	អង្គរបាន	Angkor Ban	\N
21003	តាស្ដា	Ta Sda	\N
21004	សន្ដិភាព	Santepheap	\N
21005	សេរីមានជ័យ	Serei Mean Chey	\N
21006	ជ្រៃសីមា	Chrey Seima	\N
21201	កំរៀង	Kamrieng	\N
21202	បឹងរាំង	Boeng Reang	\N
21203	អូរដា	Ou Da	\N
21204	ត្រាង	Trang	\N
21205	តាសែន	Ta Saen	\N
21206	តាក្រី	Ta Krei	\N
21301	ធិបតី	Thipakdei	\N
21302	គាស់ក្រឡ	Kaos Krala	\N
21303	ហប់	Hab	\N
21304	ព្រះផុស	Preah Phos	\N
21305	ដូនបា	Doun Ba	\N
21306	ឆ្នាល់មាន់	Chhnal Moan	\N
21401	ព្រែកជីក	Preaek Chik	\N
21402	ព្រៃត្រឡាច	Prey Tralach	\N
21403	មុខរាហ៍	Mukh Reah	\N
21404	ស្តុកប្រវឹក	Sdok Pravoek	\N
21405	បាសាក់	Basak	\N
30101	បាធាយ	Batheay	\N
30102	ច្បារអំពៅ	Chbar Ampov	\N
30103	ជាលា	Chealea	\N
30104	ជើងព្រៃ	Cheung Prey	\N
30105	មេព្រីង	Me Pring	\N
30106	ផ្អាវ	Ph'av	\N
30107	សំបូរ	Sambour	\N
30108	សណ្ដែក	Sandaek	\N
30109	តាំងក្រាំង	Tang Krang	\N
30110	តាំងក្រសាំង	Tang Krasang	\N
30111	ត្រប់	Trab	\N
30112	ទំនប់	Tumnob	\N
30201	បុសខ្នុរ	Bos Khnor	\N
30202	ចំការអណ្ដូង	Chamkar Andoung	\N
30203	ជយោ	Cheyyou	\N
30204	ល្វាលើ	Lvea Leu	\N
30205	ស្ពឺ	Spueu	\N
30206	ស្វាយទាប	Svay Teab	\N
30207	តាអុង	Ta Ong	\N
30208	តាប្រុក	Ta Prok	\N
30301	ខ្នុរដំបង	Khnor Dambang	\N
30302	គោករវៀង	Kouk Rovieng	\N
30303	ផ្ដៅជុំ	Pdau Chum	\N
30304	ព្រៃចារ	Prey Char	\N
30305	ព្រីងជ្រុំ	Pring Chrum	\N
30306	សំពងជ័យ	Sampong Chey	\N
30307	ស្ដើងជ័យ	Sdaeung Chey	\N
30308	សូទិព្វ	Soutib	\N
30309	ស្រម៉រ	Sramar	\N
30310	ត្រពាំងគរ	Trapeang Kor	\N
30501	សង្កាត់បឹងកុក	Boeng Kok Sangkat	\N
30502	សង្កាត់កំពង់ចាម	Kampong Cham Sangkat	\N
30503	សង្កាត់សំបួរមាស	Sambuor Meas Sangkat	\N
30504	សង្កាត់វាលវង់	Veal Vong Sangkat	\N
30601	អំពិល	Ampil	\N
30602	ហាន់ជ័យ	Hanchey	\N
30603	កៀនជ្រៃ	Kien Chrey	\N
30604	គគរ	Kokor	\N
30605	កោះមិត្ដ	Kaoh Mitt	\N
30606	កោះរកា	Kaoh Roka	\N
30607	កោះសំរោង	Kaoh Samraong	\N
30608	កោះទន្ទឹម	Kaoh Tontuem	\N
30609	ក្រឡា	Krala	\N
30610	អូរស្វាយ	Ou Svay	\N
30611	រអាង	Ro'ang	\N
30612	រំចេក	Rumchek	\N
30613	ស្រក	Srak	\N
30614	ទ្រាន	Trean	\N
30615	វិហារធំ	Vihear Thum	\N
30701	អង្គរបាន	Angkor Ban	\N
30702	កងតាណឹង	Kang Ta Noeng	\N
30703	ខ្ចៅ	Khchau	\N
30704	ពាមជីកង	Peam Chi Kang	\N
30705	ព្រែកកុយ	Preaek Koy	\N
30706	ព្រែកក្របៅ	Preaek Krabau	\N
30707	រាយប៉ាយ	Reay Pay	\N
30708	រកាអារ	Roka Ar	\N
30709	រកាគយ	Roka Koy	\N
30710	ស្ដៅ	Sdau	\N
30711	សូរគង	Sour Kong	\N
30801	កំពង់រាប	Kampong Reab	\N
30802	កោះសូទិន	Kaoh Sotin	\N
30803	ល្វេ	Lve	\N
30804	មហាលាភ	Moha Leaph	\N
30805	មហាខ្ញូង	Moha Khnhoung	\N
30806	ពាមប្រធ្នោះ	Peam Prathnuoh	\N
30807	ពង្រ	Pongro	\N
30808	ព្រែកតានង់	Preaek Ta Nong	\N
31301	បារាយណ៍	Baray	\N
31302	បឹងណាយ	Boeng Nay	\N
31303	ជ្រៃវៀន	Chrey Vien	\N
31304	ខ្វិតធំ	Khvet Thum	\N
31305	គរ	Kor	\N
31306	ក្រូច	Krouch	\N
31307	ល្វា	Lvea	\N
31308	មៀន	Mien	\N
31309	ព្រៃឈរ	Prey Chhor	\N
31310	សូរ្យសែន	Sour Saen	\N
31311	សំរោង	Samraong	\N
31312	ស្រង៉ែ	Sragnae	\N
31313	ថ្មពូន	Thma Pun	\N
31314	តុងរ៉ុង	Tong Rong	\N
31315	ត្រពាំងព្រះ	Trapeang Preah	\N
31401	បារាយណ៍	Baray	\N
31402	ជីបាល	Chi Bal	\N
31403	ខ្នារស	Khnar Sa	\N
31404	កោះអណ្ដែត	Kaoh Andaet	\N
31405	មានជ័យ	Mean Chey	\N
31406	ផ្ទះកណ្ដាល	Phteah Kandal	\N
31407	ប្រាំយ៉ាម	Pram Yam	\N
31408	ព្រែកដំបូក	Preaek Dambouk	\N
31409	ព្រែកពោធិ	Preaek Pou	\N
31410	ព្រែករំដេង	Preaek Rumdeng	\N
31411	ឫស្សីស្រុក	Ruessei Srok	\N
31412	ស្វាយពោធិ	Svay Pou	\N
31413	ស្វាយខ្សាច់ភ្នំ	Svay Khsach Phnum	\N
31414	ទងត្រឡាច	Tong Tralach	\N
31501	អារក្សត្នោត	Areaks Tnot	\N
31503	ដងក្ដារ	Dang Kdar	\N
31504	ខ្ពបតាងួន	Khpob Ta Nguon	\N
31505	មេសរជ្រៃ	Me Sar Chrey	\N
31506	អូរម្លូ	Ou Mlu	\N
31507	ពាមកោះស្នា	Peam Kaoh Snar	\N
31508	ព្រះអណ្ដូង	Preah Andoung	\N
31509	ព្រែកបាក់	Preaek Bak	\N
31510	ព្រែកកក់	Preak Kak	\N
31512	សូភាស	Soupheas	\N
31513	ទួលព្រះឃ្លាំង	Tuol Preah Khleang	\N
31514	ទួលសំបួរ	Tuol Sambuor	\N
40101	អញ្ចាញរូង	Anhchanh Rung	\N
40102	ឆ្នុកទ្រូ	Chhnok Tru	\N
40103	ចក	Chak	\N
40104	ខុនរ៉ង	Khon Rang	\N
40105	កំពង់ព្រះគគីរ	Kampong Preah Kokir	\N
40106	មេលំ	Melum	\N
40107	ផ្សារ	Phsar	\N
40108	ពេជចង្វារ	Pech Changvar	\N
40109	ពពេល	Popel	\N
40110	ពន្លៃ	Ponley	\N
40111	ត្រពាំងចាន់	Trapeang Chan	\N
40201	ជលសា	Chol Sar	\N
40202	កោះថ្កូវ	Kaoh Thkov	\N
40203	កំពង់អុស	Kampong Ous	\N
40204	ពាមឆ្កោក	Peam Chhkaok	\N
40205	ព្រៃគ្រី	Prey Kri	\N
40301	សង្កាត់ផ្សារឆ្នាំង	Phsar Chhnang Sangkat	\N
40302	សង្កាត់កំពង់ឆ្នាំង	Kampong Chhnang Sangkat	\N
40303	សង្កាត់ប្អេរ	B'er Sangkat	\N
40304	សង្កាត់ខ្សាម	Khsam Sangkat	\N
40401	ច្រណូក	Chranouk	\N
40402	ដារ	Dar	\N
40403	កំពង់ហៅ	Kampong Hau	\N
40404	ផ្លូវទូក	Phlov Tuk	\N
40405	ពោធិ៍	Pou	\N
40406	ប្រឡាយមាស	Pralay Meas	\N
40407	សំរោងសែន	Samraong Saen	\N
40408	ស្វាយរំពារ	Svay Rumpear	\N
40409	ត្រងិល	Trangel	\N
40501	អំពិលទឹក	Ampil Tuek	\N
40502	ឈូកស	Chhuk Sa	\N
40503	ច្រេស	Chres	\N
40504	កំពង់ត្រឡាច	Kampong Tralach	\N
40505	លង្វែក	Longveaek	\N
40506	អូរឫស្សី	Ou Ruessei	\N
40507	ពានី	Peani	\N
40508	សែប	Saeb	\N
40509	តាជេស	Ta Ches	\N
40510	ថ្មឥដ្ឋ	Thma Edth	\N
40601	អណ្ដូងស្នាយ	Andoung Snay	\N
40602	បន្ទាយព្រាល	Banteay Preal	\N
40603	ជើងគ្រាវ	Cheung Kreav	\N
40604	ជ្រៃបាក់	Chrey Bak	\N
40605	គោកបន្ទាយ	Kouk Banteay	\N
40606	ក្រាំងលាវ	Krang Leav	\N
40607	ពង្រ	Pongro	\N
40608	ប្រស្នឹប	Prasnoeb	\N
40609	ព្រៃមូល	Prey Mul	\N
40610	រលាប្អៀរ	Rolea B'ier	\N
40611	ស្រែថ្មី	Srae Thmei	\N
40612	ស្វាយជ្រុំ	Svay Chrum	\N
40613	ទឹកហូត	Tuek Hout	\N
40701	ឈានឡើង	Chhean Laeung	\N
40702	ខ្នារឆ្មារ	Khnar Chhmar	\N
40703	ក្រាំងល្វា	Krang Lvea	\N
40704	ពាម	Peam	\N
40705	សេដ្ឋី	Sedthei	\N
40706	ស្វាយ	Svay	\N
40707	ស្វាយជុក	Svay Chuk	\N
40708	ត្បែងខ្ពស់	Tbaeng Khpos	\N
40709	ធ្លកវៀន	Thlok Vien	\N
40801	អភិវឌ្ឍន៍	Akphivoadth	\N
40802	ជៀប	Chieb	\N
40803	ចោងម៉ោង	Chaong Maong	\N
40804	ក្បាលទឹក	Kbal Tuek	\N
40805	ខ្លុងពពក	Khlong Popok	\N
40806	ក្រាំងស្គារ	Krang Skear	\N
40807	តាំងក្រសាំង	Tang Krasang	\N
40808	ទួលខ្ពស់	Tuol Khpos	\N
40809	ក្តុលសែនជ័យ	Kdol Saen Chey	\N
50101	បរសេដ្ឋ	Basedth	\N
50102	កាត់ភ្លុក	Kat Phluk	\N
50103	និទាន	Nitean	\N
50104	ភក្ដី	Pheakdei	\N
50105	ភារីមានជ័យ	Pheari Mean Chey	\N
50106	ផុង	Phong	\N
50107	ពោធិអង្ក្រង	Pou Angkrang	\N
50108	ពោធិ៍ចំរើន	Pou Chamraeun	\N
50109	ពោធិ៍ម្រាល	Pou Mreal	\N
50110	ស្វាយចចិប	Svay Chacheb	\N
50111	ទួលអំពិល	Tuol Ampil	\N
50112	ទួលសាលា	Tuol Sala	\N
50113	កក់	Kak	\N
50114	ស្វាយរំពារ	Svay Rumpear	\N
50115	ព្រះខែ	Preah Khae	\N
50201	សង្កាត់ច្បារមន	Chbar Mon Sangkat	\N
50202	សង្កាត់កណ្ដោលដុំ	Kandaol Dom Sangkat	\N
50203	សង្កាត់រការធំ	Rokar Thum Sangkat	\N
50204	សង្កាត់សុព័រទេព	Sopoar Tep Sangkat	\N
50205	សង្កាត់ស្វាយក្រវ៉ាន់	Svay Kravan Sangkat	\N
50301	អង្គពពេល	Angk Popel	\N
50302	ជង្រុក	Chongruk	\N
50303	មហាឫស្សី	Moha Ruessei	\N
50304	ពេជ្រមុនី	Pechr Muni	\N
50305	ព្រះនិព្វាន	Preah Nipean	\N
50306	ព្រៃញាតិ	Prey Nheat	\N
50307	ព្រៃវិហារ	Prey Vihear	\N
50308	រកាកោះ	Roka Kaoh	\N
50309	ស្ដុក	Sdok	\N
50310	ស្នំក្រពើ	Snam Krapeu	\N
50311	ស្រង់	Srang	\N
50312	ទឹកល្អក់	Tuek L'ak	\N
50313	វាល	Veal	\N
50401	ហោងសំណំ	Haong Samnam	\N
50402	រស្មីសាមគ្គី	Reaksmei Sameakki	\N
50403	ត្រពាំងជោ	Trapeang Chour	\N
50404	សង្កែសាទប	Sangkae Satob	\N
50405	តាសាល	Ta Sal	\N
50501	ចាន់សែន	Chan Saen	\N
50502	ជើងរាស់	Cheung Roas	\N
50503	ជំពូព្រឹក្ស	Chumpu Proeks	\N
50504	ក្សេមក្សាន្ដ	Khsem Khsant	\N
50505	ក្រាំងចេក	Krang Chek	\N
50506	មានជ័យ	Mean Chey	\N
50507	ព្រះស្រែ	Preah Srae	\N
50508	ព្រៃក្រសាំង	Prey Krasang	\N
50509	ត្រាចទង	Trach Tong	\N
50510	វាលពង់	Veal Pong	\N
50511	វាំងចាស់	Veang Chas	\N
50512	យុទ្ធសាមគ្គី	Yutth Sameakki	\N
50513	ដំណាក់រាំង	Damnak Reang	\N
50514	ពាំងល្វា	Peang Lvea	\N
50515	ភ្នំតូច	Phnom Touch	\N
50601	ចំបក់	Chambak	\N
50602	ជាំសង្កែ	Choam Sangkae	\N
50603	ដំបូករូង	Dambouk Rung	\N
50604	គិរីវន្ដ	Kiri Voan	\N
50605	ក្រាំងដីវ៉ាយ	Krang Dei Vay	\N
50606	មហាសាំង	Moha Sang	\N
50607	អូរ	Ou	\N
50608	ព្រៃរំដួល	Prey Rumduol	\N
50609	ព្រៃក្មេង	Prey Kmeng	\N
50610	តាំងសំរោង	Tang Samraong	\N
50611	តាំងស្យា	Tang Sya	\N
50613	ត្រែងត្រយឹង	Traeng Trayueng	\N
50701	រលាំងចក	Roleang Chak	\N
50702	កាហែង	Kahaeng	\N
50703	ខ្ទុំក្រាំង	Khtum Krang	\N
50704	ក្រាំងអំពិល	Krang Ampil	\N
50705	ព្នាយ	Pneay	\N
50706	រលាំងគ្រើល	Roleang Kreul	\N
50707	សំរោងទង	Samrong Tong	\N
50708	សំបូរ	Sambour	\N
50709	សែងដី	Saen Dei	\N
50710	ស្គុះ	Skuh	\N
50711	តាំងក្រូច	Tang Krouch	\N
50712	ធម្មតាអរ	Thummoda Ar	\N
50713	ត្រពាំងគង	Trapeang Kong	\N
50714	ទំព័រមាស	Tumpoar Meas	\N
50715	វល្លិសរ	Voa Sar	\N
50801	អមលាំង	Amleang	\N
50802	មនោរម្យ	Monourom	\N
50804	ប្រាំបីមុម	Prambei Mum	\N
50805	រុងរឿង	Rung Roeang	\N
50806	ទ័ពមាន	Toap Mean	\N
50807	វាលពន់	Veal Pon	\N
50808	យាអង្គ	Yea Angk	\N
60101	បាក់ស្នា	Bak Sna	\N
60102	បល្ល័ង្គ	Ballangk	\N
60103	បារាយណ៍	Baray	\N
60104	បឹង	Boeng	\N
60105	ចើងដើង	Chaeung Daeung	\N
60106	ច្រនាង	Chraneang	\N
60107	ឈូកខ្សាច់	Chhuk Khsach	\N
60108	ចុងដូង	Chong Doung	\N
60109	ជ្រលង	Chrolong	\N
60110	គគីធំ	Kokir Thum	\N
60111	ក្រវ៉ា	Krava	\N
60112	អណ្ដូងពោធិ៍	Andoung Pou	\N
60113	ពង្រ	Pongro	\N
60114	សូយោង	Sou Young	\N
60115	ស្រឡៅ	Sralau	\N
60116	ស្វាយភ្លើង	Svay Phleung	\N
60117	ត្នោតជុំ	Tnaot Chum	\N
60118	ទ្រៀល	Triel	\N
60201	ជ័យ	Chey	\N
60202	ដំរីស្លាប់	Damrei Slab	\N
60203	កំពង់គោ	Kampong Kou	\N
60204	កំពង់ស្វាយ	Kampong Svay	\N
60205	នីពេជ	Nipech	\N
60206	ផាត់សណ្ដាយ	Phat Sanday	\N
60207	សាន់គ	San Kor	\N
60208	ត្បែង	Tbaeng	\N
60209	ត្រពាំងឫស្សី	Trapeang Ruessei	\N
60210	ក្ដីដូង	Kdei Doung	\N
60211	ព្រៃគុយ	Prey Kuy	\N
60301	សង្កាត់ដំរីជាន់ខ្លា	Damrei Choan Khla Sangkat	\N
60302	សង្កាត់កំពង់ធំ	Kampong Thum Sangkat	\N
60303	សង្កាត់កំពង់រទេះ	Kampong Roteh Sangkat	\N
60304	សង្កាត់អូរកន្ធរ	Ou Kanthor Sangkat	\N
60306	សង្កាត់កំពង់ក្របៅ	Kampong Krabau Sangkat	\N
60308	សង្កាត់ព្រៃតាហ៊ូ	Prey Ta Hu Sangkat	\N
60309	សង្កាត់អាចារ្យលាក់	Achar Leak Sangkat	\N
60310	សង្កាត់ស្រយ៉ូវ	Srayov Sangkat	\N
60401	ដូង	Doung	\N
60402	ក្រយា	Kraya	\N
60403	ផាន់ញើម	Phan Nheum	\N
60404	សាគ្រាម	Sakream	\N
60405	សាលាវិស័យ	Sala Visai	\N
60406	សាមគ្គី	Sameakki	\N
60407	ទួលគ្រើល	Tuol Kreul	\N
60501	ឈូក	Chhuk	\N
60502	គោល	Koul	\N
60503	សំបូរណ៍	Sambour	\N
60504	ស្រើង	Sraeung	\N
60505	តាំងក្រសៅ	Tang Krasau	\N
60601	ឈើទាល	Chheu Teal	\N
60602	ដងកាំបិត	Dang Kambet	\N
60603	ក្លែង	Klaeng	\N
60604	មានរិទ្ធ	Mean Rith	\N
60605	មានជ័យ	Mean Chey	\N
60606	ងន	Ngan	\N
60607	សណ្ដាន់	Sandan	\N
60608	សុចិត្រ	Sochet	\N
60609	ទំរីង	Tum Ring	\N
60701	បឹងល្វា	Boeng Lvea	\N
60702	ជ្រាប់	Chroab	\N
60703	កំពង់ថ្ម	Kampong Thma	\N
60704	កកោះ	Kakaoh	\N
60705	ក្រយា	Kraya	\N
60706	ព្នៅ	Pnov	\N
60707	ប្រាសាទ	Prasat	\N
60708	តាំងក្រសាំង	Tang Krasang	\N
60709	ទីពោ	Ti Pou	\N
60710	ត្បូងក្រពើ	Tboung Krapeu	\N
60801	បន្ទាយស្ទោង	Banteay Stoung	\N
60802	ចំណាក្រោម	Chamna Kraom	\N
60803	ចំណាលើ	Chamna Leu	\N
60804	កំពង់ចិនជើង	Kampong Chen Cheung	\N
60805	កំពង់ចិនត្បូង	Kampong Chen Tboung	\N
60806	ម្សាក្រង	Msa Krang	\N
60807	ពាមបាង	Peam Bang	\N
60808	ពពក	Popok	\N
60809	ប្រឡាយ	Pralay	\N
60810	ព្រះដំរី	Preah Damrei	\N
60811	រុងរឿង	Rung Roeang	\N
60812	សំព្រោជ	Samprouch	\N
60813	ទ្រា	Trea	\N
70101	អង្គភ្នំតូច	Angk Phnum Touch	\N
70102	អង្គរជ័យ	Ankor Chey	\N
70103	ចំប៉ី	Champei	\N
70104	ដំបូកខ្ពស់	Dambouk Khpos	\N
70105	ដានគោម	Dan Koum	\N
70106	ដើមដូង	Daeum Doung	\N
70107	ម្រោម	Mroum	\N
70108	ភ្នំកុង	Phnum Kong	\N
70109	ប្រភ្នំ	Praphnum	\N
70110	សំឡាញ	Samlanh	\N
70111	តានី	Tani	\N
70201	បន្ទាយមាសខាងកើត	Banteay Meas Khang Kaeut	\N
70202	បន្ទាយមាសខាងលិច	Banteay Meas Khang lech	\N
70203	ព្រៃទន្លេ	Prey Tonle	\N
70204	សំរោងក្រោម	Samraong Kraom	\N
70205	សំរោងលើ	Samraong Leu	\N
70206	ស្ដេចគង់ខាងជើង	Sdach Kong Khang Cheung	\N
70207	ស្ដេចគង់ខាងលិច	Sdach Kong Khang lech	\N
70208	ស្ដេចគង់ខាងត្បូង	Sdach Kong Khang Tboung	\N
70209	ត្នោតចុងស្រង់	Tnoat Chong Srang	\N
70210	ត្រពាំងសាលាខាងកើត	Trapeang Sala Khang Kaeut	\N
70211	ត្រពាំងសាលាខាងលិច	Trapeang Sala Khang Lech	\N
70212	ទូកមាសខាងកើត	Tuk Meas Khang Kaeut	\N
70213	ទូកមាសខាងលិច	Tuk Meas Khang Lech	\N
70214	វត្ដអង្គខាងជើង	Voat Angk Khang Cheung	\N
70215	វត្ដអង្គខាងត្បូង	Voat Angk Khang Tboung	\N
70301	បានៀវ	Baniev	\N
70302	តាកែន	Takaen	\N
70303	បឹងនិមល	Boeng Nimol	\N
70304	ឈូក	Chhuk	\N
70305	ដូនយ៉យ	Doun Yay	\N
70306	ក្រាំងស្បូវ	Krang Sbov	\N
70307	ក្រាំងស្នាយ	Krang Snay	\N
70308	ល្បើក	Lbaeuk	\N
70309	ត្រពាំងភ្លាំង	Trapeang Phleang	\N
70310	មានជ័យ	Mean Chey	\N
70311	នារាយណ៍	Neareay	\N
70312	សត្វពង	Satv Pong	\N
70313	ត្រពាំងបី	Trapeang Bei	\N
70314	ត្រមែង	Tramaeng	\N
70315	តេជោអភិវឌ្ឍន៍	Dechou Akphivoadth	\N
70401	ច្រេស	Chres	\N
70402	ជំពូវន្ដ	Chumpu Voan	\N
70403	ស្នាយអញ្ជិត	Snay Anhchit	\N
70404	ស្រែចែង	Srae Chaeng	\N
70405	ស្រែក្នុង	Srae Knong	\N
70406	ស្រែសំរោង	Srae Samraong	\N
70407	ត្រពាំងរាំង	Trapeang Reang	\N
70501	ដំណាក់សុក្រំ	Damnak Sokram	\N
70502	ដងទង់	Dang Tong	\N
70503	ឃ្ជាយខាងជើង	Khcheay Khang Cheung	\N
70504	ខ្ជាយខាងត្បូង	Khcheay Khang Tboung	\N
70505	មានរិទ្ធិ	Mean Ritth	\N
70506	ស្រែជាខាងជើង	Srae Chea Khang Cheung	\N
70507	ស្រែជាខាងត្បូង	Srae Chea Khang Tboung	\N
70508	ទទុង	Totung	\N
70509	អង្គ រមាស	Angk  Romeas	\N
70510	ល្អាង	L'ang	\N
70601	បឹងសាលាខាងជើង	Boeng Sala Khang Cheung	\N
70602	បឹងសាលាខាងត្បូង	Boeng Sala Khang Tboung	\N
70603	ដំណាក់កន្ទួតខាងជើង	Damnak Kantuot Khang Cheung	\N
70604	ដំណាក់កន្ទួតខាងត្បូង	Damnak Kantuot Khang Tboung	\N
70605	កំពង់ត្រាចខាងកើត	Kampong Trach Khang Kaeut	\N
70606	កំពង់ត្រាចខាងលិច	Kampong Trach Khang Lech	\N
70607	ប្រាសាទភ្នំខ្យង	Prasat Phnom Khyang	\N
70608	ភ្នំប្រាសាទ	Phnom Prasat	\N
70609	អង្គសុរភី	Ang Sophy	\N
70612	ព្រែកក្រឹស	Preaek Kroes	\N
70613	ឫស្សីស្រុកខាងកើត	Ruessei Srok Khang Kaeut	\N
70614	ឫស្សីស្រុកខាងលិច	Ruessei Srok Khang Lech	\N
70615	ស្វាយទងខាងជើង	Svay Tong Khang Cheung	\N
70616	ស្វាយទងខាងត្បូង	Svay Tong Khang Tboung	\N
70701	បឹងទូក	Boeng Tuk	\N
70702	ជុំគ្រៀល	Chum Kriel	\N
70703	កំពង់ក្រែង	Kampong Kraeng	\N
70704	កំពង់សំរោង	Kampong Samraong	\N
70705	កណ្ដោល	Kandaol	\N
70707	កោះតូច	Kaoh Touch	\N
70708	កូនសត្វ	Koun Satv	\N
70709	ម៉ាក់ប្រាង្គ	Makprang	\N
70711	ព្រែកត្នោត	Preaek Tnoat	\N
70712	ព្រៃឃ្មុំ	Prey Khmum	\N
70713	ព្រៃថ្នង	Prey Thnang	\N
70715	ស្ទឹងកែវ	Stueng Kaev	\N
70716	ថ្មី	Thmei	\N
70717	ត្រពាំងព្រីង	Trapeang Pring	\N
70718	ត្រពាំងសង្កែ	Trapeang Sangkae	\N
70719	ត្រពាំងធំ	Trapeang Thum	\N
70801	សង្កាត់កំពង់កណ្ដាល	Kampong Kandal Sangkat	\N
70802	សង្កាត់ក្រាំងអំពិល	Krang Ampil Sangkat	\N
70803	សង្កាត់កំពង់បាយ	Kampong Bay Sangkat	\N
70804	សង្កាត់អណ្ដូងខ្មែរ	Andoung Khmer Sangkat	\N
70805	សង្កាត់ត្រើយកោះ	Traeuy Kaoh Sangkat	\N
80101	អំពៅព្រៃ	Ampov Prey	\N
80102	អន្លង់រមៀត	Anlong Romiet	\N
80103	បារគូ	Barku	\N
80104	បឹងខ្យាង	Boeng Khyang	\N
80105	ជើងកើប	Cheung Kaeub	\N
80106	ដើមឫស	Daeum Rues	\N
80107	កណ្ដោក	Kandaok	\N
80108	ថ្មី	Thmei	\N
80109	គោកត្រប់	Kouk Trab	\N
80113	ព្រះពុទ្ធ	Preah Putth	\N
80115	ព្រែករកា	Preaek Roka	\N
80116	ព្រែកស្លែង	Preaek Slaeng	\N
80117	រកា	Roka	\N
80118	រលាំងកែន	Roleang Kaen	\N
80122	សៀមរាប	Siem Reab	\N
80125	ត្បែង	Tbaeng	\N
80127	ត្រពាំងវែង	Trapeang Veaeng	\N
80128	ទ្រា	Trea	\N
80201	បន្ទាយដែក	Banteay Daek	\N
80202	ឈើទាល	Chheu Teal	\N
80203	ដីឥដ្ឋ	Dei Edth	\N
80204	កំពង់ស្វាយ	Kampong Svay	\N
80206	គគីរ	Kokir	\N
80207	គគីរធំ	Kokir Thum	\N
80208	ភូមិធំ	Phum Thum	\N
80211	សំរោងធំ	Samraong Thum	\N
80301	បាក់ដាវ	Bak Dav	\N
80302	ជ័យធំ	Chey Thum	\N
80303	កំពង់ចំលង	Kampong Chamlang	\N
80304	កោះចូរ៉ាម	Kaoh Chouram	\N
80305	កោះឧកញ៉ាតី	Kaoh Oknha Tei	\N
80306	ព្រះប្រសប់	Preah Prasab	\N
80307	ព្រែកអំពិល	Preaek Ampil	\N
80308	ព្រែកលួង	Preaek Luong	\N
80309	ព្រែកតាកូវ	Preaek Ta kov	\N
80310	ព្រែកតាមាក់	Preaek Ta Meak	\N
80311	ពុកឫស្សី	Puk Ruessei	\N
80312	រកាជន្លឹង	Roka Chonlueng	\N
80313	សន្លុង	Sanlung	\N
80314	ស៊ីធរ	Sithor	\N
80315	ស្វាយជ្រំ	Svay Chrum	\N
80316	ស្វាយរមៀត	Svay Romiet	\N
80317	តាឯក	Ta Aek	\N
80318	វិហារសួគ៌	Vihear Suork	\N
80401	ឈើខ្មៅ	Chheu Kmau	\N
80402	ជ្រោយតាកែវ	Chrouy Ta Kaev	\N
80403	កំពង់កុង	Kampong Kong	\N
80404	កោះធំ ‹ក›	Kaoh Thum Ka	\N
80405	កោះធំ ‹ខ›	Kaoh Thum Kha	\N
80407	លើកដែក	Leuk Daek	\N
80408	ពោធិ៍បាន	Pouthi Ban	\N
80409	ព្រែកជ្រៃ	Prea​ek Chrey	\N
80410	ព្រែកស្ដី	Preaek Sdei	\N
80411	ព្រែកថ្មី	Preaek Thmei	\N
80412	សំពៅពូន	Sampeou Poun	\N
80501	កំពង់ភ្នំ	Kampong Phnum	\N
80502	ក្អមសំណរ	K'am Samnar	\N
80503	ខ្ពបអាទាវ	Khpob Ateav	\N
80504	ពាមរាំង	Peam Reang	\N
80505	ព្រែកដាច់	Preaek Dach	\N
80506	ព្រែកទន្លាប់	Preaek Tonloab	\N
80507	សណ្ដារ	Sandar	\N
80601	អរិយក្សត្រ	Akreiy Ksatr	\N
80602	បារុង	Barong	\N
80603	បឹងគ្រំ	Boeng Krum	\N
80604	កោះកែវ	Kaoh Kaev	\N
80605	កោះរះ	Kaoh Reah	\N
80606	ល្វាសរ	Lvea Sar	\N
80607	ពាមឧកញ៉ាអុង	Peam Oknha Ong	\N
80608	ភូមិធំ	Phum Thum	\N
80609	ព្រែកក្មេង	Preaek Kmeng	\N
80610	ព្រែករៃ	Preaek Rey	\N
80611	ព្រែកឫស្សី	Preaek Ruessei	\N
80612	សំបួរ	Sambuor	\N
80613	សារិកាកែវ	Sarikakaev	\N
80614	ថ្មគរ	Thma Kor	\N
80615	ទឹកឃ្លាំង	Tuek Khleang	\N
80703	ព្រែកអញ្ចាញ	Preaek Anhchanh	\N
80704	ព្រែកដំបង	Preaek Dambang	\N
80707	រកាកោង ទី ១	Roka Kong Ti Muoy	\N
80708	រកាកោង ទី ២	Roka Kong Ti Pir	\N
80709	ឫស្សីជ្រោយ	Ruessei Chrouy	\N
80710	សំបួរមាស	Sambuor Meas	\N
80711	ស្វាយអំពារ	Svay Ampear	\N
80801	បែកចាន	Baek Chan	\N
80803	ឆក់ឈើនាង	Chhak Chheu Neang	\N
80804	ដំណាក់អំពិល	Damnak Ampil	\N
80807	ក្រាំងម្កាក់	Krang Mkak	\N
80808	លំហាច	Lumhach	\N
80809	ម្កាក់	Mkak	\N
80811	ពើក	Peuk	\N
80813	ព្រៃពួច	Prey Puoch	\N
80814	សំរោងលើ	Samraong Leu	\N
80816	ទួលព្រេជ	Tuol Prech	\N
80901	ឈ្វាំង	Chhveang	\N
80902	ជ្រៃលាស់	Chrey Loas	\N
80903	កំពង់ហ្លួង	Kampong Luong	\N
80904	កំពង់អុស	Kampong Os	\N
80905	កោះចិន	Kaoh Chen	\N
80906	ភ្នំបាត	Phnum Bat	\N
80907	ពញាឮ	Ponhea Lueu	\N
80910	ព្រែកតាទែន	Preaek Ta Teaen	\N
80911	ផ្សារដែក	Phsar Daek	\N
80913	ទំនប់ធំ	Tumnob Thum	\N
80914	វិហារហ្លួង	Vihear Luong	\N
81001	ខ្ពប	Khpob	\N
81002	កោះអន្លង់ចិន	Kaoh Anlong Chen	\N
81003	កោះខែល	Kaoh Khael	\N
81004	កោះខ្សាច់ទន្លា	Kaoh Khsach Tonlea	\N
81005	ក្រាំងយ៉ូវ	Krang Yov	\N
81006	ប្រាសាទ	Prasat	\N
81007	ព្រែកអំបិល	Preaek Ambel	\N
81008	ព្រែកគយ	Preaek Koy	\N
81009	រកាខ្ពស់	Roka Khpos	\N
81010	ស្អាងភ្នំ	S'ang Phnum	\N
81011	សិត្បូ	Setbou	\N
81012	ស្វាយប្រទាល	Svay Prateal	\N
81013	ស្វាយរលំ	Svay Rolum	\N
81014	តាលន់	Ta Lon	\N
81015	ត្រើយស្លា	Traeuy Sla	\N
81016	ទឹកវិល	Tuek Vil	\N
81101	សង្កាត់តាក្ដុល	Ta Kdol Sangkat	\N
81102	សង្កាត់ព្រែកឫស្សី	Prek Ruessey Sangkat	\N
81103	សង្កាត់ដើមមៀន	Doeum Mien Sangkat	\N
81104	សង្កាត់តាខ្មៅ	Ta Khmao Sangkat	\N
81105	សង្កាត់ព្រែកហូរ	Prek Ho Sangkat	\N
81106	សង្កាត់កំពង់សំណាញ់	Kampong Samnanh Sangkat	\N
90101	អណ្ដូងទឹក	Andoung Tuek	\N
90102	កណ្ដោល	Kandaol	\N
90103	តានូន	Ta Noun	\N
90104	ថ្មស	Thma Sa	\N
90201	កោះស្ដេច	Kaoh Sdach	\N
90202	ភ្ញីមាស	Phnhi Meas	\N
90203	ព្រែកខ្សាច់	Preaek Khsach	\N
90301	ជ្រោយប្រស់	Chrouy Pras	\N
90302	កោះកាពិ	Kaoh Kapi	\N
90303	តាតៃក្រោម	Ta Tai Kraom	\N
90304	ត្រពាំងរូង	Trapeang Rung	\N
90401	សង្កាត់ស្មាច់មានជ័យ	Smach Mean Chey Sangkat	\N
90402	សង្កាត់ដងទង់	Dang Tong Sangkat	\N
90403	សង្កាត់ស្ទឹងវែង	Stueng Veaeng Sangkat	\N
90501	ប៉ាក់ខ្លង	Pak Khlang	\N
90502	ពាមក្រសោប	Peam Krasaob	\N
90503	ទួលគគីរ	Tuol Kokir	\N
90601	បឹងព្រាវ	Boeng Preav	\N
90602	ជី ខ ក្រោម	Chi Kha Kraom	\N
90603	ជី ខ លើ	Chi kha Leu	\N
90604	ជ្រោយស្វាយ	Chrouy Svay	\N
90605	ដងពែង	Dang Peaeng	\N
90606	ស្រែអំបិល	Srae Ambel	\N
90701	តាទៃលើ	Ta Tey Leu	\N
90702	ប្រឡាយ	Pralay	\N
90703	ជំនាប់	Chumnoab	\N
90704	ឫស្សីជ្រុំ	Ruessei Chrum	\N
90705	ជីផាត	Chi Phat	\N
90706	ថ្មដូនពៅ	Thma Doun Pov	\N
040108	ពេជចង្វារ	Pech Changvar	000401
040109	ពពេល	Popel	000401
040110	ពន្លៃ	Punley	000401
040111	ត្រពាំងចាន់	Trapeang Chan	000401
040201	ជលសា	Chul Sar	000402
040202	កោះថ្កូវ	Kaoh Thkouv	000402
040203	កំពង់អុស	Kampong Os	000402
040204	ពាមឆ្កោក	Peam Chhkaok	000402
040205	ព្រៃគ្រី	Prey Kri	000402
040301	ផ្សារឆ្នាំង	Phsar Chhnang	000403
040302	កំពង់ឆ្នាំង	Kampong Chhnang	000403
040303	ប្អេរ	B'er	000403
040304	ខ្សាម	Khsam	000403
040401	ច្រណូក	Chranouk	000404
040402	ដារ	Dar	000404
040403	កំពង់ហៅ	Kampong Hau	000404
040404	ផ្លូវទូក	Phlov Tuk	000404
040405	ពោធិ៍	Pou	000404
040406	ប្រឡាយមាស	Pralay Meas	000404
040407	សំរោងសែន	Samraong Saen	000404
040408	ស្វាយរំពារ	Svay Rumpear	000404
040409	ត្រងិល	Trangel	000404
040501	អំពិលទឹក	Ampil Tuek	000405
040502	ឈូកស	Chhuk Sa	000405
040503	ច្រេស	Chres	000405
040504	កំពង់ត្រឡាច	Kampong Tralach	000405
040505	លង្វែក	Lungveaek	000405
040506	អូរឫស្សី	Ou Ruessei	000405
040507	ពានី	Peani	000405
040508	សែប	Saeb	000405
040509	តាជេស	Ta Ches	000405
040510	ថ្មឥដ្ឋ	Thma Ed	000405
040601	អណ្ដូងស្នាយ	Andoung Snay	000406
040602	បន្ទាយព្រាល	Banteay Preal	000406
040603	ជើងគ្រាវ	Cheung Kreav	000406
040604	ជ្រៃបាក់	Chrey Bak	000406
040605	គោកបន្ទាយ	Kouk Banteay	000406
040606	ក្រាំងលាវ	Krang Leav	000406
040607	ពង្រ	Pongro	000406
040608	ប្រស្នឹប	Prasnoeb	000406
040609	ព្រៃមូល	Prey Mul	000406
040610	រលាប្អៀរ	Rolea B'ier	000406
040611	ស្រែថ្មី	Srae Thmei	000406
040612	ស្វាយជ្រុំ	Svay Chrum	000406
040613	ទឹកហូត	Tuek Hout	000406
040614	ភ្នំក្រាំងដីមាស	Phnum Krang Dei Meas	000406
040701	ឈានឡើង	Chhean Laeung	000407
040702	ខ្នារឆ្មារ	Khna Chhmar	000407
040703	ក្រាំងល្វា	Krang Lvea	000407
040704	ពាម	Peam	000407
040705	សេដ្ឋី	Sedthei	000407
040706	ស្វាយ	Svay	000407
040707	ស្វាយជុក	Svay Chuk	000407
040708	ត្បែងខ្ពស់	Tbaeng Khpuos	000407
040709	ធ្លកវៀន	Thlok Vien	000407
040801	អភិវឌ្ឍន៍	Akphivoad	000408
040802	ជៀប	Chieb	000408
040803	ចោងម៉ោង	Chaong Maong	000408
040804	ក្បាលទឹក	Kbal Tuek	000408
040805	ខ្លុងពពក	Khlong Popok	000408
040806	ក្រាំងស្គារ	Krang Skear	000408
040807	តាំងក្រសាំង	Tang Krasang	000408
250302	ជាំ	Choam	002503
050711	តាំងក្រូច	Tang Krouch	000507
050712	ធម្មតាអរ	Thoam Ta Ar	000507
050713	ត្រពាំងគង	Trapeang Kong	000507
050714	ទំព័រមាស	Tumpoar Meas	000507
050715	វល្លិសរ	Voa Sar	000507
050801	អមលាំង	Amleang	000508
050802	មនោរម្យ	Meaknourum	000508
050804	ប្រាំបីមុម	Prambei Mum	000508
050805	រុងរឿង	Rung Roeang	000508
050806	ទ័ពមាន	Toap Mean	000508
050807	វាលពន់	Veal Pun	000508
050808	យាអង្គ	Yea Ang	000508
060101	បាក់ស្នា	Bak Sna	000601
060102	បល្ល័ង្គ	Ballang	000601
060103	បារាយណ៍	Baray	000601
060104	បឹង	Boeng	000601
060105	ចើងដើង	Chaeung Daeung	000601
060107	ឈូកខ្សាច់	Chhuk Khsach	000601
060108	ចុងដូង	Chong Doung	000601
060110	គគីធំ	Kokir Thum	000601
060111	ក្រវ៉ា	Krava	000601
060117	ត្នោតជុំ	Tnaot Chum	000601
060201	ជ័យ	Chey	000602
060202	ដំរីស្លាប់	Damrei Slab	000602
060203	កំពង់គោ	Kampong Kou	000602
060204	កំពង់ស្វាយ	Kampong Svay	000602
060205	នីពេជ	Nipech	000602
060206	ផាត់សណ្ដាយ	Phat Sanday	000602
060207	សាន់គ	San Ko	000602
060208	ត្បែង	Tbaeng	000602
060209	ត្រពាំងឫស្សី	Trapeang Ruessei	000602
060210	ក្ដីដូង	Kdei Doung	000602
060211	ព្រៃគុយ	Prey Kuy	000602
060301	ដំរីជាន់ខ្លា	Damrei Choan Khla	000603
060302	កំពង់ធំ	Kampong Thum	000603
060303	កំពង់រទេះ	Kampong Roteh	000603
060304	អូរកន្ធរ	Ou Kanthor	000603
060306	កំពង់ក្របៅ	Kampong Krabau	000603
060308	ព្រៃតាហ៊ូ	Prey Ta Hu	000603
060309	អាចារ្យលាក់	Achar Leak	000603
060310	ស្រយ៉ូវ	Srayouv	000603
060402	ក្រយា	Kraya	000604
060403	ផាន់ញើម	Phan Nheum	000604
060404	សាគ្រាម	Sakream	000604
060405	សាលាវិស័យ	Sala Visai	000604
060406	សាមគ្គី	Sammeakki	000604
060407	ទួលគ្រើល	Tuol Kreul	000604
060501	ឈូក	Chhuk	000605
060502	គោល	Koul	000605
060503	សំបូរណ៍	Sambour	000605
060504	ស្រើង	Sraeung	000605
060505	តាំងក្រសៅ	Tang Krasau	000605
060601	ឈើទាល	Chheu Teal	000606
060602	ដងកាំបិត	Dang Kambet	000606
060603	ក្លែង	Klaeng	000606
060604	មានរិទ្ធ	Mean Rit	000606
060605	មានជ័យ	Mean Chey	000606
060606	ងន	Ngon	000606
060607	សណ្ដាន់	Sandan	000606
060608	សុចិត្រ	Sochet	000606
060609	ទំរីង	Tum Ring	000606
060701	បឹងល្វា	Boeng Lvea	000607
060702	ជ្រាប់	Chroab	000607
060703	កំពង់ថ្ម	Kampong Thma	000607
060704	កកោះ	Kakaoh	000607
060705	ក្រយា	Kraya	000607
060706	ព្នៅ	Pnov	000607
060707	ប្រាសាទ	Prasat	000607
060708	តាំងក្រសាំង	Tang Krasang	000607
060709	ទីពោ	Ti Pou	000607
060710	ត្បូងក្រពើ	Tboung Krapeu	000607
060801	បន្ទាយស្ទោង	Banteay Stoung	000608
060802	ចំណាក្រោម	Chamna Kraom	000608
060803	ចំណាលើ	Chamna Leu	000608
060804	កំពង់ចិនជើង	Kampong Chen Cheung	000608
060805	កំពង់ចិនត្បូង	Kampong Chen Tboung	000608
060806	ម្សាក្រង	Msa Krang	000608
060807	ពាមបាង	Peam Bang	000608
060808	ពពក	Popok	000608
060809	ប្រឡាយ	Pralay	000608
060810	ព្រះដំរី	Preah Damrei	000608
060811	រុងរឿង	Rung Roeang	000608
060812	សំព្រោជ	Samprouch	000608
060813	ទ្រា	Trea	000608
070101	អង្គភ្នំតូច	Ang Phnum Touch	000701
070102	អង្គរជ័យ	Ankor Chey	000701
070103	ចំប៉ី	Champei	000701
070104	ដំបូកខ្ពស់	Dambouk Khpuos	000701
070105	ដានគោម	Dan Koum	000701
070106	ដើមដូង	Daeum Doung	000701
070107	ម្រោម	Mroum	000701
070108	ភ្នំកុង	Phnum Kong	000701
070109	ប្រភ្នំ	Praphnum	000701
070110	សំឡាញ	Samlanh	000701
070111	តានី	Tani	000701
070201	បន្ទាយមាសខាងកើត	Banteay Meas Khang Kaeut	000702
070202	បន្ទាយមាសខាងលិច	Banteay Meas Khang Lech	000702
070203	ព្រៃទន្លេ	Prey Tonle	000702
070204	សំរោងក្រោម	Samraong Kraom	000702
070205	សំរោងលើ	Samraong Leu	000702
070206	ស្ដេចគង់ខាងជើង	Sdach Kung Khang Cheung	000702
070207	ស្ដេចគង់ខាងលិច	Sdach Kung Khang Lech	000702
070208	ស្ដេចគង់ខាងត្បូង	Sdach Kung Khang Tboung	000702
070209	ត្នោតចុងស្រង់	Tnoat Chong Srang	000702
070210	ត្រពាំងសាលាខាងកើត	Trapeang Sala Khang Kaeut	000702
070211	ត្រពាំងសាលាខាងលិច	Trapeang Sala Khang Lech	000702
070212	ទូកមាសខាងកើត	Tuk Meas Khang Kaeut	000702
070213	ទូកមាសខាងលិច	Tuk Meas Khang Lech	000702
070214	វត្ដអង្គខាងជើង	Voat Ang Khang Cheung	000702
070215	វត្ដអង្គខាងត្បូង	Voat Ang Khang Tboung	000702
070301	បានៀវ	Ba Niev	000703
070302	តាកែន	Ta Kaen	000703
070303	បឹងនិមល	Boeng Nimul	000703
070304	ឈូក	Chhuk	000703
070305	ដូនយ៉យ	Doun Yay	000703
070306	ក្រាំងស្បូវ	Krang Sbouv	000703
070307	ក្រាំងស្នាយ	Krang Snay	000703
070308	ល្បើក	Lbaeuk	000703
070309	ត្រពាំងភ្លាំង	Trapeang Phleang	000703
070310	មានជ័យ	Mean Chey	000703
070311	នារាយណ៍	Neareay	000703
070312	សត្វពង	Satv Pong	000703
070313	ត្រពាំងបី	Trapeang Bei	000703
070314	ត្រមែង	Trameaeng	000703
070315	តេជោអភិវឌ្ឍន៍	Dechou Akphivoad	000703
070401	ច្រេស	Chres	000704
070402	ជំពូវន្ដ	Chumpu Voan	000704
070403	ស្នាយអញ្ជិត	Snay Anhchit	000704
070404	ស្រែចែង	Srae Chaeng	000704
070405	ស្រែក្នុង	Srae Knong	000704
070406	ស្រែសំរោង	Srae Samraong	000704
070407	ត្រពាំងរាំង	Trapeang Reang	000704
070501	ដំណាក់សុក្រំ	Damnak Sokram	000705
070502	ដងទង់	Dang Tung	000705
070503	ឃ្ជាយខាងជើង	Khcheay Khang Cheung	000705
070504	ខ្ជាយខាងត្បូង	Khcheay Khang Tboung	000705
070505	មានរិទ្ធិ	Mean Rit	000705
070506	ស្រែជាខាងជើង	Srae Chea Khang Cheung	000705
070507	ស្រែជាខាងត្បូង	Srae Chea Khang Tboung	000705
070508	ទទុង	Totung	000705
070509	អង្គ រមាស	Ang Romeas	000705
070510	ល្អាង	L'ang	000705
070601	បឹងសាលាខាងជើង	Boeng Sala Khang Cheung	000706
070602	បឹងសាលាខាងត្បូង	Boeng Sala Khang Tboung	000706
070603	ដំណាក់កន្ទួតខាងជើង	Damnak Kantuot Khang Cheung	000706
070604	ដំណាក់កន្ទួតខាងត្បូង	Damnak Kantuot Khang Tboung	000706
070605	កំពង់ត្រាចខាងកើត	Kampong Trach Khang Kaeut	000706
070606	កំពង់ត្រាចខាងលិច	Kampong Trach Khang Lech	000706
070607	ប្រាសាទភ្នំខ្យង	Prasat Phnum Khyang	000706
070608	ភ្នំប្រាសាទ	Phnum Prasat	000706
070609	អង្គសុរភី	Ang Sophi	000706
070612	ព្រែកក្រឹស	Preaek Kroes	000706
070613	ឫស្សីស្រុកខាងកើត	Ruessei Srok Khang Kaeut	000706
070614	ឫស្សីស្រុកខាងលិច	Ruessei Srok Khang Lech	000706
070615	ស្វាយទងខាងជើង	Svay Tong Khang Cheung	000706
070616	ស្វាយទងខាងត្បូង	Svay Tong Khang Tboung	000706
070702	ជុំគ្រៀល	Chum Kriel	000707
070703	កំពង់ក្រែង	Kampong Kraeng	000707
070704	កំពង់សំរោង	Kampong Samraong	000707
070705	កណ្ដោល	Kandaol	000707
070708	កូនសត្វ	Koun Sat	000707
070709	ម៉ាក់ប្រាង្គ	Makprang	000707
070712	ព្រៃឃ្មុំ	Prey Khmum	000707
070713	ព្រៃថ្នង	Prey Thnang	000707
070715	ស្ទឹងកែវ	Stueng Kaev	000707
070716	ថ្មី	Thmei	000707
070717	ត្រពាំងព្រីង	Trapeang Pring	000707
070718	ត្រពាំងសង្កែ	Trapeang Sangkae	000707
070719	ត្រពាំងធំ	Trapeang Thum	000707
070801	កំពង់កណ្ដាល	Kampong Kandal	000708
070802	ក្រាំងអំពិល	Krang Ampil	000708
070803	កំពង់បាយ	Kampong Bay	000708
070804	អណ្ដូងខ្មែរ	Andoung Khmer	000708
070805	ត្រើយកោះ	Traeuy Kaoh	000708
080101	អំពៅព្រៃ	Ampov Prey	000801
080102	អន្លង់រមៀត	Anlung Romiet	000801
080103	បារគូ	Barku	000801
080104	បឹងខ្យាង	Boeng Khyang	000801
080105	ជើងកើប	Cheung Kaeub	000801
080106	ដើមឫស	Daeum Rues	000801
080107	កណ្ដោក	Kandaok	000801
080108	ថ្មី	Thmei	000801
080109	គោកត្រប់	Kouk Trab	000801
080113	ព្រះពុទ្ធ	Preah Put	000801
080115	ព្រែករកា	Preaek Roka	000801
080116	ព្រែកស្លែង	Preaek Slaeng	000801
080117	រកា	Roka	000801
080118	រលាំងកែន	Roleang Kaen	000801
080122	សៀមរាប	Siem Reab	000801
080125	ត្បែង	Tbaeng	000801
080127	ត្រពាំងវែង	Trapeang Veaeng	000801
080128	ទ្រា	Trea	000801
080201	បន្ទាយដែក	Banteay Daek	000802
080202	ឈើទាល	Chheu Teal	000802
080203	ដីឥដ្ឋ	Dei Ed	000802
080204	កំពង់ស្វាយ	Kampong Svay	000802
080206	គគីរ	Kokir	000802
080207	គគីរធំ	Kokir Thum	000802
080208	ភូមិធំ	Phum Thum	000802
080211	សំរោងធំ	Samraong Thum	000802
080302	ជ័យធំ	Chey Thum	000803
080303	កំពង់ចំលង	Kampong Chamlang	000803
080304	កោះចូរ៉ាម	Kaoh Chouram	000803
080306	ព្រះប្រសប់	Preah Prasab	000803
080310	ព្រែកតាមាក់	Preaek Ta Meak	000803
080311	ពុកឫស្សី	Puk Ruessei	000803
080312	រកាជន្លឹង	Roka Chonlueng	000803
080313	សន្លុង	Sanlung	000803
080314	ស៊ីធរ	Sithor	000803
080316	ស្វាយរមៀត	Svay Romiet	000803
080317	តាឯក	Ta Aek	000803
080318	វិហារសួគ៌	Vihea Suor	000803
080403	កំពង់កុង	Kampong Kong	000804
080404	កោះធំ ‹ក›	"Kaoh Thum ""Ka """	000804
080405	កោះធំ ‹ខ›	"Kaoh Thum "" Kha """	000804
080407	លើកដែក	Leuk Daek	000804
080408	ពោធិ៍បាន	Pou Ban	000804
080411	ព្រែកថ្មី	Preaek Thmei	000804
080501	កំពង់ភ្នំ	Kampong Phnum	000805
080502	ក្អមសំណរ	K'am Samnar	000805
080503	ខ្ពបអាទាវ	Khpob Ateav	000805
080504	ពាមរាំង	Peam Reang	000805
080505	ព្រែកដាច់	Preaek Dach	000805
080506	ព្រែកទន្លាប់	Preaek Tunloab	000805
080507	សណ្ដារ	Sandar	000805
080603	បឹងគ្រំ	Boeng Krum	000806
080605	កោះរះ	Kaoh Reah	000806
080606	ល្វាសរ	Lvea Sar	000806
080608	ភូមិធំ	Phum Thum	000806
080610	ព្រែករៃ	Preaek Rey	000806
080611	ព្រែកឫស្សី	Preaek Ruessei	000806
080612	សំបួរ	Sambuor	000806
080613	សារិកាកែវ	Sarikakaev	000806
080614	ថ្មគរ	Thma Kor	000806
080615	ទឹកឃ្លាំង	Tuek Khleang	000806
080703	ព្រែកអញ្ចាញ	Preaek Anhchanh	000807
080704	ព្រែកដំបង	Preaek Dambang	000807
080707	រកាកោង ទី ១	Roka Kaong Ti Muoy	000807
080708	រកាកោង ទី ២	Roka Kaong Ti Pir	000807
080709	ឫស្សីជ្រោយ	Ruessei Chrouy	000807
080710	សំបួរមាស	Sambuor Meas	000807
080711	ស្វាយអំពារ	Svay Ampear	000807
080801	បែកចាន	Baek Chan	000808
080803	ឆក់ឈើនាង	Chhak Chheu Neang	000808
080804	ដំណាក់អំពិល	Damnak Ampil	000808
080807	ក្រាំងម្កាក់	Krang Mkak	000808
080808	លំហាច	Lumhach	000808
080809	ម្កាក់	Mkak	000808
080811	ពើក	Peuk	000808
080813	ព្រៃពួច	Prey Puoch	000808
080814	សំរោងលើ	Samraong Leu	000808
080816	ទួលព្រេជ	Tuol Prech	000808
080901	ឈ្វាំង	Chhveang	000809
080902	ជ្រៃលាស់	Chrey Loas	000809
080903	កំពង់ហ្លួង	Kampong Luong	000809
080904	កំពង់អុស	Kampong Os	000809
080905	កោះចិន	Kaoh Chen	000809
080906	ភ្នំបាត	Phnum Bat	000809
080907	ពញាឮ	Ponhea Lueu	000809
080910	ព្រែកតាទែន	Preaek Ta Teaen	000809
080911	ផ្សារដែក	Phsar Daek	000809
080913	ទំនប់ធំ	Tumnub Thum	000809
080914	វិហារហ្លួង	Vihea Luong	000809
081001	ខ្ពប	Khpob	000810
081003	កោះខែល	Kaoh Khael	000810
081004	កោះខ្សាច់ទន្លា	Kaoh Khsach Tunlea	000810
081005	ក្រាំងយ៉ូវ	Krang Youv	000810
081006	ប្រាសាទ	Prasat	000810
081007	ព្រែកអំបិល	Preaek Ambel	000810
081008	ព្រែកគយ	Preaek Koy	000810
081010	ស្អាងភ្នំ	S'ang Phnum	000810
081012	ស្វាយប្រទាល	Svay Prateal	000810
081014	តាលន់	Ta Lun	000810
081015	ត្រើយស្លា	Traeuy Sla	000810
081016	ទឹកវិល	Tuek Vil	000810
081101	តាក្ដុល	Ta Kdol	000811
081102	ព្រែកឫស្សី	Preaek Ruessei	000811
081103	ដើមមៀន	Daeum Mien	000811
081104	តាខ្មៅ	Ta Khmao	000811
081105	ព្រែកហូរ	Preaek Hour	000811
081106	កំពង់សំណាញ់	Kampong Samnanh	000811
081107	ស្វាយរលំ	Svay Rolum	000811
081108	កោះអន្លង់ចិន	Kaoh Anlung Chen	000811
081109	សិត្បូ	Settak bou	000811
081110	រកាខ្ពស់	Roka Khpuos	000811
090101	អណ្ដូងទឹក	Andoung Tuek	000901
090102	កណ្ដោល	Kandaol	000901
090103	តានូន	Ta Nun	000901
090104	ថ្មស	Thma Sa	000901
090201	កោះស្ដេច	Kaoh Sdach	000902
090202	ភ្ញីមាស	Phnhi Meas	000902
090203	ព្រែកខ្សាច់	Preaek Khsach	000902
090301	ជ្រោយប្រស់	Chrouy Pras	000903
090302	កោះកាពិ	Kaoh Kapi	000903
090303	តាតៃក្រោម	Ta Tai Kraom	000903
090304	ត្រពាំងរូង	Trapeang Rung	000903
090401	ស្មាច់មានជ័យ	Smach Mean Chey	000904
090402	ដងទង់	Dang Tung	000904
090403	ស្ទឹងវែង	Stueng Veaeng	000904
090501	ប៉ាក់ខ្លង	Pak Khlang	000905
090502	ពាមក្រសោប	Peam Krasaob	000905
090503	ទួលគគីរ	Tuol Kokir	000905
090601	បឹងព្រាវ	Boeng Preav	000906
090602	ជី ខ ក្រោម	Chi Kha Kraom	000906
090603	ជី ខ លើ	Chi Kha Leu	000906
090604	ជ្រោយស្វាយ	Chrouy Svay	000906
090605	ដងពែង	Dang Peaeng	000906
090606	ស្រែអំបិល	Srae Ambel	000906
090701	តាទៃលើ	Ta Tey Leu	000907
090702	ប្រឡាយ	Pralay	000907
090703	ជំនាប់	Chumnoab	000907
090704	ឫស្សីជ្រុំ	Ruessei Chrum	000907
090705	ជីផាត	Chi Phat	000907
090706	ថ្មដូនពៅ	Thma Doun Pov	000907
100307	សោប	Saob	001003
120912	ត្រពាំងក្រសាំង	Trapeang Krasang	001209
121006	ព្រែកឯង	Preaek Aeng	001210
121007	ព្រែកថ្មី	Preaek Thmei	001210
121008	វាលស្បូវ	Veal Sbouv	001210
130101	ស្អាង	S'ang	001301
141004	តាកោ	Ta Kao	001410
141109	កំពង់ឫស្សី	Kampong Ruessei	001411
141110	ព្រែកតាសរ	Preaek Ta Sar	001411
250315	គគីរ	Kokir	002503
250316	គគីរ	Kokir	002503
250317	គគីរ	Kokir	002503
250318	គគីរ	Kokir	002503
250319	គគីរ	Kokir	002503
250320	គគីរ	Kokir	002503
250321	គគីរ	Kokir	002503
21101	ភ្នំព្រឹក	Phnum Proek	002110
21102	ពេជ្រចិន្ដា	Pech Chenda	002110
21103	បួរ	Bour	002110
21104	បារាំងធ្លាក់	Barang Thleak	002110
21105	អូររំដួល	Ou Rumduol	002110
100101	ឆ្លូង	Chhloung	001001
100102	ដំរីផុង	Damrei Phong	001001
100103	ហាន់ជ័យ	Han Chey	001001
100104	កំពង់ដំរី	Kampong Damrei	001001
100105	កញ្ជរ	Kanhchor	001001
100106	ខ្សាច់អណ្ដែត	Khsach Andeth	001001
100107	ពង្រ	Pongro	001001
100108	ព្រែកសាម៉ាន់	Preaek Saman	001001
130104	ច្រាច់	Chrach	001301
100207	សង្កាត់កោះទ្រង់	Kaoh Trong Sangkat	001002
100208	សង្កាត់ក្រគរ	Krakor Sangkat	001002
100209	សង្កាត់ក្រចេះ	Kracheh Sangkat	001002
100210	សង្កាត់អូរឫស្សី	Ou Ruessei Sangkat	001002
100211	សង្កាត់រកាកណ្ដាល	Roka Kandal Sangkat	001002
100301	ចំបក់	Chambâk	001003
100302	ជ្រោយបន្ទាយ	Chrouy Banteay	001003
100303	កំពង់គរ	Kampong Kor	001003
100304	កោះតាស៊ុយ	Koh Ta Suy	001003
100305	ព្រែកប្រសព្វ	Preaek Prasab	001003
100306	ឫស្សីកែវ	Russey Keo	001003
100308	តាម៉ៅ	Ta Mao	001003
100401	បឹងចារ	Boeng Char	001004
100402	កំពង់ចាម	Kampong Cham	001004
100403	ក្បាលដំរី	Kbal Damrei	001004
100404	កោះខ្ញែរ	Kaoh Khnhaer	001004
100405	អូរគ្រៀង	Ou Krieng	001004
100406	រលួសមានជ័យ	Roluos Mean Chey	001004
100407	សំបូរ	Sambour	001004
100408	សណ្ដាន់	Sandan	001004
100409	ស្រែជិះ	Srae Chis	001004
100410	វឌ្ឍនៈ	Voadthonak	001004
100501	ឃ្សឹម	Khsuem	001005
100502	ពីរធ្នូ	Pir Thnu	001005
100503	ស្នួល	Snuol	001005
100504	ស្រែចារ	Srae Char	001005
100505	ស្វាយជ្រះ	Svay Chreah	001005
100506	គ្រញូងសែនជ័យ	Kronhoung Saen Chey	001005
100601	បុសលាវ	Bos Leav	001006
100602	ចង្ក្រង់	Changkrang	001006
100603	ដារ	Dar	001006
100604	កន្ទួត	Kantuot	001006
100605	គោលាប់	Kou Loab	001006
100606	កោះច្រែង	Kaoh Chraeng	001006
100607	សំបុក	Sambok	001006
100608	ថ្មអណ្ដើក	Thma Andaeuk	001006
100609	ថ្មគ្រែ	Thma Kreae	001006
100610	ថ្មី	Thmei	001006
110101	ចុងផ្លាស់	Chong Phlah	001101
110102	មេម៉ង់	Memang	001101
110103	ស្រែឈូក	Srae Chhuk	001101
110104	ស្រែខ្ទុម	Srae Khtum	001101
110105	ស្រែព្រះ	Srae Preah	001101
110201	ណងឃីលិក	Nang Khi Lik	001102
110202	អ បួនលើ	A Buon Leu	001102
110203	រយ៉	Roya	001102
110204	សុខសាន្ដ	Sokh Sant	001102
110205	ស្រែហ៊ុយ	Srae Huy	001102
110206	ស្រែសង្គម	Srae Sangkum	001102
110301	ដាក់ដាំ	Dak Dam	001103
110302	សែនមនោរម្យ	Saen Monourom	001103
110401	ក្រង់តេះ	Krang Teh	001104
110402	ពូជ្រៃ	Pu Chrey	001104
110403	ស្រែអំពូម	Srae Ampum	001104
110404	ប៊ូស្រា	Bu Sra	001104
110501	សង្កាត់មនោរម្យ	Monourom Sangkat	001105
110502	សង្កាត់សុខដុម	Sokh Dom Sangkat	001105
110503	សង្កាត់ស្ពានមានជ័យ	Spean Mean Chey Sangkat	001105
110504	សង្កាត់រមនា	Romonea Sangkat	001105
120101	សង្កាត់ទន្លេបាសាក់	Tonle Basak Sangkat	001201
120102	សង្កាត់បឹងកេងកងទី ១	Boeng Keng Kang Ti Muoy Sangkat	001201
120103	សង្កាត់បឹងកេងកងទី ២	Boeng Keng Kang Ti Pir Sangkat	001201
120104	សង្កាត់បឹងកេងកងទី ៣	Boeng Keng Kang Ti Bei Sangkat	001201
120105	សង្កាត់អូឡាំពិក	Olympic Sangkat	001201
120106	សង្កាត់ទួលស្វាយព្រៃទី ១	Tuol Svay Prey Ti Muoy Sangkat	001201
120107	សង្កាត់ទួលស្វាយព្រៃទី ២	Tuol Svay Prey Ti Pir Sangkat	001201
120108	សង្កាត់ទំនប់ទឹក	Tumnob Tuek Sangkat	001201
120109	សង្កាត់ទួលទំពូងទី ២	Tuol Tumpung Ti Pir Sangkat	001201
120110	សង្កាត់ទួលទំពូងទី ១	Tuol Tumpung Ti Muoy Sangkat	001201
120111	សង្កាត់បឹងត្របែក	Boeng Trabaek Sangkat	001201
120112	សង្កាត់ផ្សារដើមថ្កូវ	Phsar Daeum Thkov Sangkat	001201
120201	សង្កាត់ផ្សារថ្មីទី ១	Phsar Thmei Ti Muoy Sangkat	001202
120202	សង្កាត់ផ្សារថ្មីទី ២	Phsar Thmei Ti Pir Sangkat	001202
120203	សង្កាត់ផ្សារថ្មីទី ៣	Phsar Thmei Ti Bei Sangkat	001202
120204	សង្កាត់បឹងរាំង	Boeng Reang Sangkat	001202
120205	សង្កាត់ផ្សារកណ្ដាលទី១	Phsar Kandal Ti Muoy Sangkat	001202
120206	សង្កាត់ផ្សារកណ្ដាលទី២	Phsar Kandal Ti Pir Sangkat	001202
120207	សង្កាត់ចតុមុខ	Chakto Mukh Sangkat	001202
120208	សង្កាត់ជ័យជំនះ	Chey Chummeah Sangkat	001202
120209	សង្កាត់ផ្សារចាស់	Phsar Chas Sangkat	001202
120210	សង្កាត់ស្រះចក	Srah Chak Sangkat	001202
120211	សង្កាត់វត្ដភ្នំ	Voat Phnum Sangkat	001202
120301	សង្កាត់អូរឫស្សីទី ១	Ou Ruessei Ti Muoy Sangkat	001203
120302	សង្កាត់អូរឫស្សីទី ២	Ou Ruessei Ti Pir Sangkat	001203
120303	សង្កាត់អូរឫស្សីទី ៣	Ou Ruessei Ti Bei Sangkat	001203
120304	សង្កាត់អូរឫស្សីទី ៤	Ou Ruessei Ti Buon Sangkat	001203
120305	សង្កាត់មនោរម្យ	Monourom Sangkat	001203
120306	សង្កាត់មិត្ដភាព	Mittapheap Sangkat	001203
120307	សង្កាត់វាលវង់	Veal Vong Sangkat	001203
120308	សង្កាត់បឹងព្រលឹត	Boeng Proluet Sangkat	001203
130105	ធ្មា	Thmea	001301
120401	សង្កាត់ផ្សារដេប៉ូទី ១	Phsar Depou Ti Muoy Sangkat	001204
120402	សង្កាត់ផ្សារដេប៉ូទី ២	Phsar Depou Ti Pir Sangkat	001204
120403	សង្កាត់ផ្សារដេប៉ូទី ៣	Phsar Depou Ti Bei Sangkat	001204
120404	សង្កាត់ទឹកល្អក់ទី ១	Tuek L'ak Ti Muoy Sangkat	001204
120405	សង្កាត់ទឹកល្អក់ទី ២	Tuek L'ak Ti Pir Sangkat	001204
120406	សង្កាត់ទឹកល្អក់ទី ៣	Tuek L'ak Ti Bei Sangkat	001204
120407	សង្កាត់បឹងកក់ទី ១	Boeng Kak Ti Muoy Sangkat	001204
120408	សង្កាត់បឹងកក់ទី ២	Boeng Kak Ti Pir Sangkat	001204
120409	សង្កាត់ផ្សារដើមគរ	Phsar Daeum Kor Sangkat	001204
120410	សង្កាត់បឹងសាឡាង	Boeng Salang Sangkat	001204
120501	សង្កាត់ដង្កោ	Dangkao Sangkat	001205
120507	សង្កាត់ពងទឹក	Pong Tuek Sangkat	001205
120508	សង្កាត់ព្រៃវែង	Prey Veaeng Sangkat	001205
120510	សង្កាត់ព្រៃស	Prey Sa Sangkat	001205
120512	សង្កាត់ក្រាំងពង្រ	Krang Pongro Sangkat	001205
120513	សង្កាត់ប្រទះឡាង	Prateah Lang Sangkat	001205
120514	សង្កាត់សាក់សំពៅ	Sak Sampov Sangkat	001205
120515	សង្កាត់ជើងឯក	Cheung Aek Sangkat	001205
120516	សង្កាត់គងនយ	Kong Noy Sangkat	001205
120517	សង្កាត់ព្រែកកំពឹស	Preaek Kampues Sangkat	001205
120518	សង្កាត់រលួស	Roluos Sangkat	001205
120519	សង្កាត់ស្ពានថ្ម	Spean Thma Sangkat	001205
120520	សង្កាត់ទៀន	Tien Sangkat	001205
120606	សង្កាត់ចាក់អង្រែលើ	Chak Angrae Leu Sangkat	001206
120607	សង្កាត់ចាក់អង្រែក្រោម	Chak Angrae Kraom Sangkat	001206
120608	សង្កាត់ស្ទឹងមានជ័យទី១	Stueng Mean chey 1 Sangkat	001206
120609	សង្កាត់ស្ទឹងមានជ័យទី២	Stueng Mean chey 2 Sangkat	001206
120610	សង្កាត់ស្ទឹងមានជ័យទី៣	Stueng Mean chey 3 Sangkat	001206
120611	សង្កាត់បឹងទំពុនទី១	Boeng Tumpun 1 Sangkat	001206
120612	សង្កាត់បឹងទំពុនទី២	Boeng Tumpun 2 Sangkat	001206
120703	សង្កាត់ស្វាយប៉ាក	Svay Pak Sangkat	001207
120704	សង្កាត់គីឡូម៉ែត្រលេខ៦	Kilomaetr Lekh Prammuoy Sangkat	001207
120706	សង្កាត់ឫស្សីកែវ	Ruessei Kaev Sangkat	001207
120711	សង្កាត់ច្រាំងចំរេះទី ១	Chrang Chamreh Ti Muoy Sangkat	001207
120712	សង្កាត់ច្រាំងចំរេះទី ២	Chrang Chamreh Ti Pir Sangkat	001207
120713	សង្កាត់ទួលសង្កែទី១	Tuol Sangkae 1 Sangkat	001207
120714	សង្កាត់ទួលសង្កែទី២	Tuol Sangkae 2 Sangkat	001207
120801	សង្កាត់ភ្នំពេញថ្មី	Phnom Penh Thmei Sangkat	001208
120802	សង្កាត់ទឹកថ្លា	Tuek Thla Sangkat	001208
120803	សង្កាត់ឃ្មួញ	Khmuonh Sangkat	001208
120807	សង្កាត់ក្រាំងធ្នង់	Krang Thnong Sangkat	001208
120808	សង្កាត់អូរបែកក្អម	Ou Baek K'am Sangkat	001208
120809	សង្កាត់គោកឃ្លាង	Kouk Khleang Sangkat	001208
120901	សង្កាត់ត្រពាំងក្រសាំង	Trapeang Krasang Sangkat	001209
120903	សង្កាត់ភ្លើងឆេះរទេះ	Phleung Chheh Roteh Sangkat	001209
120906	សង្កាត់សំរោងក្រោម	Samraong Kraom Sangkat	001209
120908	សង្កាត់បឹងធំ	Boeng Thum Sangkat	001209
120909	សង្កាត់កំបូល	Kamboul Sangkat	001209
120910	សង្កាត់កន្ទោក	Kantaok Sangkat	001209
120911	សង្កាត់ឪឡោក	Ovlaok Sangkat	001209
120913	សង្កាត់ស្នោរ	Snaor Sangkat	001209
120914	សង្កាត់ចោមចៅទី១	Chaom Chau 1 Sangkat	001209
120915	សង្កាត់ចោមចៅទី២	Chaom Chau 2 Sangkat	001209
120916	សង្កាត់ចោមចៅទី៣	Chaom Chau 3 Sangkat	001209
120917	សង្កាត់កាកាបទី១	Kakab 1 Sangkat	001209
120918	សង្កាត់កាកាបទី២	Kakab 2 Sangkat	001209
121001	សង្កាត់ជ្រោយចង្វារ	Chrouy Changvar Sangkat	001210
121002	សង្កាត់ព្រែកលៀប	Preaek Lieb Sangkat	001210
121003	សង្កាត់ព្រែកតាសេក	Preaek Ta Sek Sangkat	001210
121004	សង្កាត់កោះដាច់	Kaoh Dach Sangkat	001210
121005	សង្កាត់បាក់ខែង	Bak Kaeng Sangkat	001210
121101	សង្កាត់ព្រែកព្នៅ	Preaek Phnov Sangkat	001211
121102	សង្កាត់ពញាពន់	Ponhea Pon Sangkat	001211
121103	សង្កាត់សំរោង	Samraong Sangkat	001211
121104	សង្កាត់គោករកា	Kouk Roka Sangkat	001211
121105	សង្កាត់ពន្សាំង	Ponsang Sangkat	001211
121201	សង្កាត់ច្បារអំពៅទី ១	Chhbar Ampov Ti Muoy Sangkat	001212
121202	សង្កាត់ច្បារអំពៅទី ២	Chbar Ampov Ti Pir Sangkat	001212
121203	សង្កាត់និរោធ	Nirouth Sangkat	001212
121204	សង្កាត់ព្រែកប្រា	Preaek Pra Sangkat	001212
121205	សង្កាត់វាលស្បូវ	Veal Sbov Sangkat	001212
121206	សង្កាត់ព្រែកឯង	Preaek Aeng Sangkat	001212
121207	សង្កាត់ក្បាលកោះ	Kbal Kaoh Sangkat	001212
121208	សង្កាត់ព្រែកថ្មី	Preaek Thmei Sangkat	001212
130102	តស៊ូ	Tasu	001301
130103	ខ្យង	Khyang	001301
130106	ពុទ្រា	Putrea	001301
130201	ឆែបមួយ	Chhaeb Muoy	001302
130202	ឆែបពីរ	Chhaeb Pir	001302
130203	សង្កែមួយ	Sangkae Muoy	001302
130204	សង្កែពីរ	Sangkae Pir	001302
130205	ម្លូព្រៃមួយ	Mlu Prey Muoy	001302
130206	ម្លូព្រៃពីរ	Mlu Prey Pir	001302
130207	កំពង់ស្រឡៅមួយ	Kampong Sralau Muoy	001302
130208	កំពង់ស្រឡៅពីរ	Kampong Sralau Pir	001302
130301	ជាំក្សាន្ដ	Choam Ksant	001303
130302	ទឹកក្រហម	Tuek Kraham	001303
130303	ព្រីងធំ	Pring Thum	001303
130304	រំដោះស្រែ	Rumdaoh Srae	001303
130305	យាង	Yeang	001303
130306	កន្ទួត	Kantuot	001303
130307	ស្រអែម	Sror Aem	001303
130308	មរកត	Morokot	001303
130401	គូលែនត្បូង	Kuleaen Tboung	001304
130402	គូលែនជើង	Kuleaen Cheung	001304
130403	ថ្មី	Thmei	001304
130404	ភ្នំពេញ	Phnum Penh	001304
130405	ភ្នំត្បែងពីរ	Phnum Tbaeng Pir	001304
130406	ស្រយង់	Srayang	001304
130501	របៀប	Robieb	001305
130502	រស្មី	Reaksmei	001305
130503	រហ័ស	Rohas	001305
130504	រុងរឿង	Rung Roeang	001305
130505	រីករាយ	Rik Reay	001305
130506	រួសរាន់	Ruos Roan	001305
130507	រតនៈ	Rotanak	001305
130508	រៀបរយ	Rieb Roy	001305
130509	រក្សា	Reaksa	001305
130510	រំដោះ	Rumdaoh	001305
130511	រមទម	Romtum	001305
130512	រមណីយ	Romoneiy	001305
130601	ចំរើន	Chamraeun	001306
130602	រអាង	Ro'ang	001306
130603	ភ្នំត្បែងមួយ	Phnum Tbaeng Muoy	001306
130604	ស្ដៅ	Sdau	001306
130605	រណសិរ្ស	Ronak Ser	001306
130703	ឈានមុខ	Chhean Mukh	001307
130704	ពោធិ៍	Pou	001307
130705	ប្រមេរុ	Prame	001307
130706	ព្រះឃ្លាំង	Preah Khleang	001307
130801	សង្កាត់កំពង់ប្រណាក	Kampong Pranak Sangkat	001308
130802	សង្កាត់ប៉ាលហាល	Pal Hal Sangkat	001308
140101	បឹងព្រះ	Boeng Preah	001401
140102	ជើងភ្នំ	Cheung Phnum	001401
140103	ឈើកាច់	Chheu Kach	001401
140104	រក្សជ័យ	Reaks Chey	001401
140105	រោងដំរី	Roung Damrei	001401
140106	ស្ដៅកោង	Sdau Kaong	001401
140107	ស្ពឺ  ក	Spueu Ka	001401
140108	ស្ពឺ  ខ	Spueu Kha	001401
140109	ធាយ	Theay	001401
140201	ជាច	Cheach	001402
140202	ដូនកឹង	Doun Koeng	001402
140203	ក្រញូង	Kranhung	001402
140204	ក្របៅ	Krabau	001402
140205	ស៊ាងឃ្វាង	Seang Khveang	001402
140206	ស្មោងខាងជើង	Smaong Khang Cheung	001402
140207	ស្មោងខាងត្បូង	Smaong Khang Tboung	001402
140208	ត្របែក	Trabaek	001402
140301	អន្សោង	Ansaong	001403
140302	ចាម	Cham	001403
140303	ជាងដែក	Cheang Daek	001403
140304	ជ្រៃ	Chrey	001403
140305	កន្សោមអក	Kansoam Ak	001403
140306	គោខ្ចក	Kou Khchak	001403
140307	កំពង់ត្របែក	Kampong Trabaek	001403
140308	ពាមមន្ទារ	Peam Montear	001403
140309	ប្រាសាទ	Prasat	001403
140310	ប្រធាតុ	Pratheat	001403
140311	ព្រៃឈរ	Prey Chhor	001403
140312	ព្រៃពោន	Prey Poun	001403
140313	ថ្កូវ	Thkov	001403
140401	ចុងអំពិល	Chong Ampil	001404
140402	កញ្ជ្រៀច	Kanhchriech	001404
140403	ក្ដឿងរាយ	Kdoeang Reay	001404
140404	គោកគង់កើត	Kouk Kong Kaeut	001404
140405	គោកគង់លិច	Kouk Kong Lech	001404
140406	ព្រាល	Preal	001404
140407	ថ្មពូន	Thma Pun	001404
140408	ត្នោត	Tnaot	001404
140501	អង្គរសរ	Angkor Sar	001405
140502	ច្រេស	Chres	001405
140503	ជីផុច	Chi Phoch	001405
140504	ព្រៃឃ្នេស	Prey Khnes	001405
140505	ព្រៃរំដេង	Prey Rumdeng	001405
140506	ព្រៃទទឹង	Prey Totueng	001405
140507	ស្វាយជ្រុំ	Svay Chrum	001405
140508	ត្រពាំងស្រែ	Trapeang Srae	001405
140601	អង្គរអង្គ	Angkor Angk	001406
140602	កំពង់ប្រាសាទ	Kampong Prasat	001406
140603	កោះចេក	Kaoh Chek	001406
140604	កោះរកា	Kaoh Roka	001406
140605	កោះសំពៅ	Kaoh Sampov	001406
140606	ក្រាំងតាយ៉ង	Krang Ta Yang	001406
140607	ព្រែកក្របៅ	Preaek Krabau	001406
140608	ព្រែកសំបួរ	Preaek Sambuor	001406
140609	ឫស្សីស្រុក	Ruessei Srok	001406
140610	ស្វាយភ្លោះ	Svay Phluoh	001406
140701	បាបោង	Ba Baong	001407
140702	បន្លិចប្រាសាទ	Banlich Prasat	001407
140703	អ្នកលឿង	Neak Loeang	001407
140704	ពាមមានជ័យ	Peam Mean Chey	001407
140705	ពាមរក៍	Peam Ro	001407
140706	ព្រែកខ្សាយ ក	Preaek Khsay Ka	001407
140707	ព្រែកខ្សាយ ខ	Preaek Khsay Kha	001407
140708	ព្រៃកណ្ដៀង	Prey Kandieng	001407
140801	កំពង់ពពិល	Kampong Popil	001408
140802	កញ្ចំ	Kanhcham	001408
140803	កំពង់ប្រាំង	Kampong Prang	001408
140805	មេសរប្រចាន់	Mesar Prachan	001408
140807	ព្រៃព្នៅ	Prey Pnov	001408
140808	ព្រៃស្នៀត	Prey Sniet	001408
140809	ព្រៃស្រឡិត	Prey Sralet	001408
140810	រាប	Reab	001408
140811	រកា	Roka	001408
140901	អង្គររាជ្យ	Angkor Reach	001409
140902	បន្ទាយចក្រី	Banteay Chakrei	001409
140903	បឹងដោល	Boeng Daol	001409
140904	ជៃកំពក	Chey Kampok	001409
140905	កំពង់សឹង	Kampong Soeng	001409
140906	ក្រាំងស្វាយ	Krang Svay	001409
140907	ល្វា	Lvea	001409
140908	ព្រះស្ដេច	Preah Sdach	001409
140909	រាធរ	Reathor	001409
140910	រំចេក	Rumchek	001409
140911	សេនារាជឧត្ដម	Sena Reach Otdam	001409
141001	សង្កាត់បារាយណ៍	Baray Sangkat	001410
141002	សង្កាត់ជើងទឹក	Cheung Tuek Sangkat	001410
141003	សង្កាត់កំពង់លាវ	Kampong Leav Sangkat	001410
141101	ពោធិ៍រៀង	Pou Rieng	001411
141102	ព្រែកអន្ទះ	Preaek Anteah	001411
141103	ព្រែកជ្រៃ	Preaek Chrey	001411
141104	ព្រៃកន្លោង	Prey Kanlaong	001411
141105	តាកោ	Ta Kao	001411
141106	កំពង់ឫស្សី	Kampong Ruessei	001411
141107	ព្រែកតាសរ	Preaek Ta Sar	001411
141201	អំពិលក្រៅ	Ampil Krau	001412
141202	ជ្រៃឃ្មុំ	Chrey Khmum	001412
141203	ល្វេ	Lve	001412
141204	ព្នៅទី ១	Pnov Ti Muoy	001412
141205	ព្នៅទី ២	Pnov Ti Pir	001412
141206	ពោធិ៍ទី	Pou Ti	001412
141207	ព្រែកចង្ក្រាន	Preaek Changkran	001412
141208	ព្រៃដើមថ្នឹង	Prey Daeum Thnoeng	001412
141209	ព្រៃទឹង	Prey Tueng	001412
141210	រំលេច	Rumlech	001412
141211	ឫស្សីសាញ់	Ruessei Sanh	001412
141301	អង្គរទ្រេត	Angkor Tret	001413
141302	ជាខ្លាង	Chea Khlang	001413
141303	ជ្រៃ	Chrey	001413
141304	ដំរីពួន	Damrei Puon	001413
141305	មេបុណ្យ	Me Bon	001413
141306	ពានរោង	Pean Roung	001413
141307	ពពឺស	Popueus	001413
141308	ព្រៃខ្លា	Prey Khla	001413
141309	សំរោង	Samraong	001413
141310	ស្វាយអន្ទរ	Svay Antor	001413
141311	ទឹកថ្លា	Tuek Thla	001413
150101	បឹងបត់កណ្ដាល	Boeng Bat Kandaol	001501
150102	បឹងខ្នារ	Boeng Khnar	001501
150103	ខ្នារទទឹង	Khnar Totueng	001501
150104	មេទឹក	Me Tuek	001501
150105	អូរតាប៉ោង	Ou Ta Paong	001501
150106	រំលេច	Rumlech	001501
150107	ស្នាមព្រះ	Snam Preah	001501
150108	ស្វាយដូនកែវ	Svay Doun Kaev	001501
150109	តាលោ	Ta Lou	001501
150110	ត្រពាំងជង	Trapeang chorng	001501
150201	អន្លង់វិល	Anlong Vil	001502
150203	កណ្ដៀង	Kandieng	001502
150204	កញ្ជរ	Kanhchor	001502
150205	រាំងទិល	Reang Til	001502
150206	ស្រែស្ដុក	Srae Sdok	001502
150207	ស្វាយលួង	Svay Luong	001502
150208	ស្យា	Sya	001502
150209	វាល	Veal	001502
150210	កោះជុំ	Kaoh Chum	001502
150301	អន្លង់ត្នោត	Anlong Tnaot	001503
150302	អន្សាចំបក់	Ansa Chambak	001503
150303	បឹងកន្ទួត	Boeng Kantuot	001503
150304	ឈើតុំ	Chheu Tom	001503
150305	កំពង់លួង	Kampong Luong	001503
150306	កំពង់ពោធិ៍	Kampong Pou	001503
150307	ក្បាលត្រាច	Kbal Trach	001503
150308	អូរសណ្ដាន់	Ou Sandan	001503
150309	ស្នាអន្សា	Sna Ansa	001503
150310	ស្វាយស	Svay Sa	001503
150311	ត្នោតជុំ	Tnaot Chum	001503
150401	បាក់ចិញ្ចៀន	Bak Chenhchien	001504
150402	លាច	Leach	001504
150403	ផ្ទះរុង	Phteah Rung	001504
150404	ព្រងិល	Prongil	001504
150405	រកាត	Rokat	001504
150406	សន្ទ្រែ	Santreae	001504
150407	សំរោង	Samraong	001504
150501	សង្កាត់ចំរើនផល	Chamraeun Phal Sangkat	001505
150503	សង្កាត់លលកស	Lolok Sa Sangkat	001505
150504	សង្កាត់ផ្ទះព្រៃ	Phteah Prey Sangkat	001505
150505	សង្កាត់ព្រៃញី	Prey Nhi Sangkat	001505
150506	សង្កាត់រលាប	Roleab Sangkat	001505
150507	សង្កាត់ស្វាយអាត់	Svay At Sangkat	001505
150508	សង្កាត់បន្ទាយដី	Banteay Dei Sangkat	001505
150601	អូរសោម	Ou Saom	001506
150602	ក្រពើពីរ	Krapeu Pir	001506
150603	អន្លង់រាប	Anlong Reab	001506
150604	ប្រម៉ោយ	Pramaoy	001506
150605	ថ្មដា	Thma Da	001506
160101	ម៉ាលិក	Malik	001601
160103	ញ៉ាង	Nhang	001601
160104	តាឡាវ	Ta Lav	001601
160201	សង្កាត់កាចាញ	Kachanh Sangkat	001602
160202	សង្កាត់ឡាបានសៀក	Labansiek Sangkat	001602
160203	សង្កាត់យក្ខឡោម	Yeak Laom Sangkat	001602
160204	សង្កាត់បឹងកន្សែង	Boeng Kansaeng Sangkat	001602
160301	កក់	Kak	001603
160302	កិះចុង	Keh Chong	001603
160303	ឡាមីញ	La Minh	001603
160304	លុងឃុង	Lung Khung	001603
160305	ស៊ើង	Saeung	001603
160306	ទីងចាក់	Ting Chak	001603
160401	សិរីមង្គល	Serei Mongkol	001604
160402	ស្រែអង្គ្រង	Srae Angkrorng	001604
160403	តាអង	Ta Ang	001604
160404	តឺន	Teun	001604
160405	ត្រពាំងច្រេស	Trapeang Chres	001604
160406	ត្រពាំងក្រហម	Trapeang Kraham	001604
160501	ជ័យឧត្ដម	Chey Otdam	001605
160502	កាឡែង	Ka Laeng	001605
160503	ល្បាំង១	Lbang Muoy	001605
160504	ល្បាំង២	Lbang Pir	001605
160505	បាតាង	Ba Tang	001605
160506	សេដា	Seda	001605
160601	ចាអ៊ុង	Cha Ung	001606
160602	ប៉ូយ	Pouy	001606
160603	ឯកភាព	Aekakpheap	001606
160604	កាឡៃ	Kalai	001606
160605	អូរជុំ	Ou Chum	001606
160606	សាមគ្គី	Sameakki	001606
160607	ល្អក់	L'ak	001606
160701	បរខាំ	Bar Kham	001607
160702	លំជ័រ	Lum Choar	001607
160703	ប៉ក់ញ៉ៃ	Pak Nhai	001607
160704	ប៉ាតេ	Pa Te	001607
160705	សេសាន	Sesan	001607
160706	សោមធំ	Saom Thum	001607
160707	យ៉ាទុង	Ya Tung	001607
160801	តាវែងលើ	Ta Veaeng Leu	001608
160802	តាវែងក្រោម	Ta Veaeng Kraom	001608
160901	ប៉ុង	Pong	001609
160903	ហាត់ប៉ក់	Hat Pak	001609
160904	កាចូន	Ka Choun	001609
160905	កោះប៉ង់	Kaoh Pang	001609
160906	កោះពាក្យ	Kaoh Peak	001609
160907	កុកឡាក់	Kok Lak	001609
160908	ប៉ាកាឡាន់	Pa Kalan	001609
160909	ភ្នំកុក	Phnum Kok	001609
160910	វើនសៃ	Veun Sai	001609
170101	ចារឈូក	Char Chhuk	001701
170102	ដូនពេង	Doun Peng	001701
170103	គោកដូង	Kouk Doung	001701
170104	គោល	Koul	001701
170105	នគរភាស	Nokor Pheas	001701
170106	ស្រែខ្វាវ	Srae Khvav	001701
170107	តាសោម	Ta Saom	001701
170201	ជប់តាត្រាវ	Chob Ta Trav	001702
170202	លាងដៃ	Leang Dai	001702
170203	ពាក់ស្នែង	Peak Snaeng	001702
170204	ស្វាយចេក	Svay Chek	001702
170301	ខ្នារសណ្ដាយ	Khnar Sanday	001703
170302	ឃុនរាម	Khun Ream	001703
170303	ព្រះដាក់	Preah Dak	001703
170304	រំចេក	Rumchek	001703
170305	រុនតាឯក	Run Ta Aek	001703
170306	ត្បែង	Tbaeng	001703
170401	អន្លង់សំណរ	Anlong Samnar	001704
170402	ជីក្រែង	Chi Kraeng	001704
170403	កំពង់ក្ដី	Kampong Kdei	001704
170404	ខ្វាវ	Khvav	001704
170405	គោកធ្លកក្រោម	Kouk Thlok Kraom	001704
170406	គោកធ្លកលើ	Kouk Thlok Leu	001704
170407	ល្វែងឫស្សី	Lveaeng Ruessei	001704
170408	ពង្រក្រោម	Pongro Kraom	001704
170409	ពង្រលើ	Pongro Leu	001704
170410	ឫស្សីលក	Ruessei Lok	001704
170411	សង្វើយ	Sangvaeuy	001704
170412	ស្ពានត្នោត	Spean Tnaot	001704
170601	ចន្លាសដៃ	Chanleas Dai	001706
170602	កំពង់ថ្កូវ	Kampong Thkov	001706
170603	ក្រឡាញ់	Kralanh	001706
170604	ក្រូចគរ	Krouch Kor	001706
170605	រោងគោ	Roung Kou	001706
170606	សំបួរ	Sambuor	001706
170607	សែនសុខ	Saen Sokh	001706
170608	ស្នួល	Snuol	001706
170609	ស្រណាល	Sranal	001706
170610	តាអាន	Ta An	001706
170701	សសរស្ដម្ភ	Sasar Sdam	001707
170702	ដូនកែវ	Doun Kaev	001707
170703	ក្ដីរុន	Kdei Run	001707
170704	កែវពណ៌	Kaev Poar	001707
170705	ខ្នាត	Khnat	001707
170707	ល្វា	Lvea	001707
170708	មុខប៉ែន	Mukh Paen	001707
170709	ពោធិ៍ទ្រាយ	Pou Treay	001707
170710	ពួក	Puok	001707
170711	ព្រៃជ្រូក	Prey Chruk	001707
170712	រើល	Reul	001707
170713	សំរោងយា	Samraong Yea	001707
170715	ត្រីញ័រ	Trei Nhoar	001707
170716	យាង	Yeang	001707
170902	បាគង	Bakong	001709
170903	បល្ល័ង្ក	Ballangk	001709
170904	កំពង់ភ្លុក	Kampong Phluk	001709
170905	កន្ទ្រាំង	Kantreang	001709
170906	កណ្ដែក	Kandaek	001709
170907	មានជ័យ	Mean Chey	001709
170908	រលួស	Roluos	001709
170909	ត្រពាំងធំ	Trapeang Thum	001709
170910	សង្កាត់អំពិល	Ampil Sangkat	001709
171001	សង្កាត់ស្លក្រាម	Sla Kram Sangkat	001710
171002	សង្កាត់ស្វាយដង្គំ	Svay Dankum Sangkat	001710
171003	សង្កាត់គោកចក	Kok Chak Sangkat	001710
171004	សង្កាត់សាលាកំរើក	Sala Kamreuk Sangkat	001710
171005	សង្កាត់នគរធំ	Nokor Thum Sangkat	001710
171006	សង្កាត់ជ្រាវ	Chreav Sangkat	001710
171007	សង្កាត់ចុងឃ្នៀស	Chong Khnies Sangkat	001710
171008	សង្កាត់សំបួរ	Sngkat Sambuor Sangkat	001710
171009	សង្កាត់សៀមរាប	Siem Reab Sangkat	001710
171010	សង្កាត់ស្រង៉ែ	Srangae Sangkat	001710
171012	សង្កាត់ក្របីរៀល	Krabei Riel Sangkat	001710
171013	សង្កាត់ទឹកវិល	Tuek Vil Sangkat	001710
171101	ចាន់ស	Chan Sa	001711
171102	ដំដែក	Dam Daek	001711
171103	ដានរុន	Dan Run	001711
171104	កំពង់ឃ្លាំង	Kampong Khleang	001711
171105	កៀនសង្កែ	Kien Sangkae	001711
171106	ខ្ចាស់	Khchas	001711
171107	ខ្នារពោធិ៍	Khnar Pou	001711
171108	ពពេល	Popel	001711
171109	សំរោង	Samraong	001711
171110	តាយ៉ែក	Ta Yaek	001711
171201	ជ្រោយនាងងួន	Chrouy Neang Nguon	001712
171202	ក្លាំងហាយ	Klang Hay	001712
171203	ត្រាំសសរ	Tram Sasar	001712
171204	មោង	Moung	001712
171205	ប្រីយ៍	Prei	001712
171206	ស្លែងស្ពាន	Slaeng Spean	001712
171301	បឹងមាលា	Boeng Mealea	001713
171302	កន្ទួត	Kantuot	001713
171303	ខ្នងភ្នំ	Khnang Phnum	001713
171304	ស្វាយលើ	Svay Leu	001713
171305	តាសៀម	Ta Siem	001713
171401	ប្រាសាទ	Prasat	001714
171402	ល្វាក្រាំង	Lvea Krang	001714
171403	ស្រែណូយ	Srae Nouy	001714
171404	ស្វាយ ស	Svay Sa	001714
171405	វ៉ារិន	Varin	001714
180101	សង្កាត់លេខ១	lek Muoy Sangkat	001801
180102	សង្កាត់២	Pir Sangkat	001801
180103	សង្កាត់៣	Bei Sangkat	001801
180104	សង្កាត់៤	Buon Sangkat	001801
180105	សង្កាត់កោះរ៉ុង	Kaoh Rung Sangkat	001801
180106	សង្កាត់កោះរ៉ុងសន្លឹម	Koah Rung Sonlem Sangkat	001801
180201	អណ្ដូងថ្ម	Andoung Thma	001802
180202	បឹងតាព្រហ្ម	Boeng Ta Prum	001802
180203	បិតត្រាង	Bet Trang	001802
180204	ជើងគោ	Cheung Kou	001802
180205	អូរជ្រៅ	Ou Chrov	001802
180206	អូរឧកញ៉ាហេង	Ou Oknha Heng	001802
180207	ព្រៃនប់	Prey Nob	001802
180208	រាម	Ream	001802
180209	សាមគ្គី	Sameakki	001802
180210	សំរុង	Samrong	001802
180211	ទឹកល្អក់	Tuek L'ak	001802
180212	ទឹកថ្លា	Tuek Thla	001802
180213	ទួលទទឹង	Tuol Totueng	001802
180214	វាលរេញ	Veal Renh	001802
180215	តានៃ	Ta Ney	001802
180301	កំពេញ	Kampenh	001803
180302	អូរត្រេះ	Ou Treh	001803
180303	ទំនប់រលក	Tumnob Rolok	001803
180304	កែវផុស	Kaev Phos	001803
180401	ចំការហ្លួង	Chamkar Luong	001804
180402	កំពង់សីលា	Kampong Seila	001804
180403	អូរបាក់រទេះ	Ou Bak Roteh	001804
180404	ស្ទឹងឆាយ	Stueng Chhay	001804
190101	កំភុន	Kamphun	001901
190102	ក្បាលរមាស	Kbal Romeas	001901
190103	ភ្លុក	Phluk	001901
190104	សាមឃួយ	Samkhuoy	001901
190105	ស្ដៅ	Sdau	001901
190106	ស្រែគរ	Srae Kor	001901
190107	តាឡាត	Ta Lat	001901
190201	កោះព្រះ	Kaoh Preah	001902
190202	កោះសំពាយ	Kaoh Sampeay	001902
190203	កោះស្រឡាយ	Kaoh Sralay	001902
190204	អូរម្រះ	Ou Mreah	001902
190205	អូរឫស្សីកណ្ដាល	Ou Ruessei Kandal	001902
190206	សៀមបូក	Siem Bouk	001902
190207	ស្រែក្រសាំង	Srae Krasang	001902
190301	ព្រែកមាស	Preaek Meas	001903
190302	សេកុង	Sekong	001903
190303	សន្ដិភាព	Santepheap	001903
190304	ស្រែសំបូរ	Srae Sambour	001903
190305	ថ្មកែវ	Tma Kaev	001903
190401	សង្កាត់ស្ទឹងត្រែង	Stueng Traeng Sangkat	001904
190402	សង្កាត់ស្រះឫស្សី	Srah Ruessei Sangkat	001904
190403	សង្កាត់ព្រះបាទ	Preah Bat Sangkat	001904
190404	សង្កាត់សាមគ្គី	Sameakki Sangkat	001904
190501	អន្លង់ភេ	Anlong Phe	001905
190502	ចំការលើ	Chamkar Leu	001905
190503	កាំងចាម	Kang Cham	001905
190504	កោះស្នែង	Kaoh Snaeng	001905
190505	អន្លង់ជ្រៃ	Anlong Chrey	001905
190506	អូររ៉ៃ	Ou Rai	001905
190507	អូរស្វាយ	Ou Svay	001905
190508	ព្រះរំកិល	Preah Rumkel	001905
190509	សំអាង	Sam Ang	001905
190510	ស្រែឫស្សី	Srae Ruessei	001905
190511	ថាឡាបរិវ៉ាត់	Thala Barivat	001905
200103	ចន្ទ្រា	Chantrea	002001
200104	ច្រេស	Chres	002001
200105	មេ សរថ្ងក	Me Sar Thngak	002001
200108	ព្រៃគគីរ	Prey Kokir	002001
200109	សំរោង	Samraong	002001
200110	ទួលស្ដី	Tuol Sdei	002001
200201	បន្ទាយក្រាំង	Banteay Krang	002002
200202	ញរ	Nhor	002002
200203	ខ្សែត្រ	Khsaetr	002002
200204	ព្រះពន្លា	Preah Ponlea	002002
200205	ព្រៃធំ	Prey Thum	002002
200206	រាជមន្ទីរ	Reach Montir	002002
200207	សំឡី	Samlei	002002
200208	សំយ៉ោង	Samyaong	002002
200209	ស្វាយតាយាន	Svay Ta Yean	002002
200211	ថ្មី	Thmei	002002
200212	ត្នោត	Tnaot	002002
200301	បុសមន	Bos Mon	002003
200302	ធ្មា	Thmea	002003
200303	កំពង់ចក	Kampong Chak	002003
200304	ជ្រុងពពេល	Chrung Popel	002003
200305	កំពង់អំពិល	Kampong Ampil	002003
200306	ម៉ឺនជ័យ	Meun Chey	002003
200307	ពងទឹក	Pong Tuek	002003
200308	សង្កែ	Sangkae	002003
200309	ស្វាយចេក	Svay Chek	002003
200310	ថ្នាធ្នង់	Thna Thnong	002003
200401	អំពិល	Ampil	002004
200402	អណ្ដូងពោធិ៍	Andoung Pou	002004
200403	អណ្ដូងត្របែក	Andoung Trabaek	002004
200404	អង្គប្រស្រែ	Angk Prasrae	002004
200405	ចន្ដ្រី	Chantrei	002004
200406	ជ្រៃធំ	Chrey Thum	002004
200407	ដូង	Doung	002004
200408	កំពង់ត្រាច	Kampong Trach	002004
200409	គគីរ	Kokir	002004
200410	ក្រសាំង	Krasang	002004
200411	មុខដា	Mukh Da	002004
200412	ម្រាម	Mream	002004
200413	សំបួរ	Sambuor	002004
200414	សម្បត្ដិមានជ័យ	Sambatt Mean Chey	002004
200415	ត្រពាំងស្ដៅ	Trapeang Sdau	002004
200416	ត្រស់	Tras	002004
200501	អង្គតាសូ	Angk Ta Sou	002005
200502	បាសាក់	Basak	002005
200503	ចំបក់	Chambak	002005
200504	កំពង់ចំឡង	Kampong Chamlang	002005
200505	តាសួស	Ta Suos	002005
200507	ឈើទាល	Chheu Teal	002005
200508	ដូនស	Doun Sa	002005
200509	គោកព្រីង	Kouk Pring	002005
200510	ក្រោលគោ	Kraol Kou	002005
200511	គ្រួស	Kruos	002005
200512	ពោធិរាជ	Pouthi Reach	002005
200513	ស្វាយអង្គ	Svay Angk	002005
200514	ស្វាយជ្រំ	Svay Chrum	002005
200515	ស្វាយធំ	Svay Thum	002005
200516	ស្វាយយា	Svay Yea	002005
200517	ធ្លក	Thlok	002005
200601	សង្កាត់ស្វាយរៀង	Svay Rieng Sangkat	002006
200602	សង្កាត់ព្រៃឆ្លាក់	Prey Chhlak Sangkat	002006
200603	សង្កាត់គយត្របែក	Koy Trabaek Sangkat	002006
200604	សង្កាត់ពោធិ៍តាហោ	Pou Ta Hao Sangkat	002006
200605	សង្កាត់ចេក	Chek Sangkat	002006
200606	សង្កាត់ស្វាយតឿ	Svay Toea Sangkat	002006
200607	សង្កាត់សង្ឃរ័	Sangkhoar Sangkat	002006
200702	គគីសោម	Koki Saom	002007
200703	កណ្ដៀងរាយ	Kandieng Reay	002007
200704	មនោរម្យ	Monourom	002007
200705	ពពែត	Popeaet	002007
200706	ព្រៃតាអី	Prey Ta Ei	002007
200707	ប្រសូត្រ	Prasoutr	002007
200708	រមាំងថ្កោល	Romeang Thkaol	002007
200709	សំបួរ	Sambuor	002007
200711	ស្វាយរំពារ	Svay Rumpear	002007
200801	សង្កាត់បាទី	Bati Sangkat	002008
200802	សង្កាត់បាវិត	Bavet Sangkat	002008
200803	សង្កាត់ច្រកម្ទេស	Chrak Mtes Sangkat	002008
200804	សង្កាត់ប្រាសាទ	Prasat Sangkat	002008
200805	សង្កាត់ព្រៃអង្គុញ	Prey Angkunh Sangkat	002008
210101	អង្គរបូរី	Angkor Borei	002101
210102	បាស្រែ	Ba Srae	002101
210103	គោកធ្លក	Kouk Thlok	002101
210104	ពន្លៃ	Ponley	002101
210105	ព្រែកផ្ទោល	Preaek Phtoul	002101
210106	ព្រៃផ្គាំ	Prey Phkoam	002101
210201	ចំបក់	Chambak	002102
210202	ចំប៉ី	Champei	002102
210203	ដូង	Doung	002102
210204	កណ្ដឹង	Kandoeng	002102
210205	កុមាររាជា	Komar Reachea	002102
210206	ក្រាំងលាវ	Krang Leav	002102
210207	ក្រាំងធ្នង់	Krang Thnong	002102
210208	លំពង់	Lumpong	002102
210209	ពារាម	Pea Ream	002102
210210	ពត់សរ	Pot Sar	002102
210211	សូរភី	Sour Phi	002102
210212	តាំងដូង	Tang Doung	002102
210213	ត្នោត	Tnaot	002102
210214	ត្រពាំងក្រសាំង	Trapeang Krasang	002102
210215	ត្រពាំងសាប	Trapeang Sab	002102
210301	បូរីជលសារ	Borei Cholsar	002103
210302	ជ័យជោគ	Chey Chouk	002103
210303	ដូងខ្ពស់	Doung Khpos	002103
210304	កំពង់ក្រសាំង	Kampong Krasang	002103
210305	គោកពោធិ៍	Kouk Pou	002103
210401	អង្គប្រាសាទ	Angk Prasat	002104
210402	ព្រះបាទជាន់ជុំ	Preah Bat Choan Chum	002104
210403	កំណប់	Kamnab	002104
210404	កំពែង	Kampeaeng	002104
210405	គីរីចុងកោះ	Kiri Chong Kaoh	002104
210406	គោកព្រេច	Kouk Prech	002104
210407	ភ្នំដិន	Phnum Den	002104
210408	ព្រៃអំពក	Prey Ampok	002104
210409	ព្រៃរំដេង	Prey Rumdeng	002104
210410	រាមអណ្ដើក	Ream Andaeuk	002104
210411	សោម	Saom	002104
210412	តាអូរ	Ta Ou	002104
210501	ក្រពុំឈូក	Krapum Chhuk	002105
210502	ពេជសារ	Pech Sar	002105
210503	ព្រៃខ្លា	Prey Khla	002105
210504	ព្រៃយុថ្កា	Prey Yuthka	002105
210505	រមេញ	Romenh	002105
210506	ធ្លាប្រជុំ	Thlea Prachum	002105
210601	អង្កាញ់	Angkanh	002106
210602	បានកាម	Ban Kam	002106
210603	ចំប៉ា	Champa	002106
210604	ចារ	Char	002106
210605	កំពែង	Kampeaeng	002106
210606	កំពង់រាប	Kampong Reab	002106
210607	ក្ដាញ់	Kdanh	002106
210608	ពោធិ៍រំចាក	Pou Rumchak	002106
210609	ព្រៃកប្បាស	Prey Kabbas	002106
210610	ព្រៃល្វា	Prey Lvea	002106
210611	ព្រៃផ្ដៅ	Prey Phdau	002106
210612	ស្នោ	Snao	002106
210613	តាំងយ៉ាប	Tang Yab	002106
210701	បឹងត្រាញ់ខាងជើង	Boeng Tranh Khang Cheung	002107
210702	បឹងត្រាញ់ខាងត្បូង	Boeng Tranh Khang Tboung	002107
210703	ជើងគួន	Cheung Kuon	002107
210704	ជំរះពេន	Chumreah Pen	002107
210705	ខ្វាវ	Khvav	002107
210706	លំចង់	Lumchang	002107
210707	រវៀង	Rovieng	002107
210708	សំរោង	Samraong	002107
210709	សឹង្ហ	Soengh	002107
210710	ស្លា	Sla	002107
210711	ទ្រា	Trea	002107
210801	សង្កាត់បារាយណ៍	Baray Sangkat	002108
210802	សង្កាត់រកាក្នុង	Roka Knong Sangkat	002108
210803	សង្កាត់រកាក្រៅ	Roka Krau Sangkat	002108
210901	អង្គតាសោម	Angk Ta Saom	002109
210902	ជាងទង	Cheang Tong	002109
210903	គុស	Kus	002109
210904	លាយបូរ	Leay Bour	002109
210905	ញ៉ែងញ៉ង	Nhaeng Nhang	002109
210906	អូរសារាយ	Ou Saray	002109
210907	ត្រពាំងក្រញូង	Trapeang Kranhoung	002109
210908	ឧត្ដមសុរិយា	Otdam Soriya	002109
210909	ពពេល	Popel	002109
210910	សំរោង	Samraong	002109
210911	ស្រែរនោង	Srae Ronoung	002109
210912	តាភេម	Ta Phem	002109
210913	ត្រាំកក់	Tram Kak	002109
210914	ត្រពាំងធំខាងជើង	Trapeang Thum Khang Cheung	002109
210915	ត្រពាំងធំខាងត្បូង	Trapeang Thum Khang Tboung	002109
211001	អង្កាញ់	Angkanh	002110
211002	អង្គខ្នុរ	Angk Khnor	002110
211003	ជីខ្មា	Chi Khma	002110
211004	ខ្វាវ	Khvav	002110
211005	ប្រាំបីមុំ	Prambei Mum	002110
211006	អង្គកែវ	Angk Kaev	002110
211007	ព្រៃស្លឹក	Prey Sloek	002110
211008	រនាម	Roneam	002110
211009	សំបួរ	Sambuor	002110
211010	សន្លុង	Sanlung	002110
211011	ស្មោង	Smaong	002110
211012	ស្រង៉ែ	Srangae	002110
211013	ធ្លក	Thlok	002110
211014	ត្រឡាច	Tralach	002110
220101	អន្លង់វែង	Anlong Veaeng	002201
220103	ត្រពាំងតាវ	Trapeang Tav	002201
220104	ត្រពាំងប្រីយ៍	Trapeang Prei	002201
220105	ថ្លាត	Thlat	002201
220106	លំទង	Lumtong	002201
220201	អំពិល	Ampil	002202
220202	បេង	Beng	002202
220203	គោកខ្ពស់	Kouk Khpos	002202
220204	គោកមន	Kouk Mon	002202
220301	ជើងទៀន	Cheung Tien	002203
220302	ចុងកាល់	Chong Kal	002203
220303	ក្រសាំង	Krasang	002203
220304	ពង្រ	Pongro	002203
220401	សង្កាត់បន្សាយរាក់	Bansay Reak Sangkat	002204
220402	សង្កាត់បុស្បូវ	Bos Sbov Sangkat	002204
220403	សង្កាត់កូនក្រៀល	Koun Kriel Sangkat	002204
220404	សង្កាត់សំរោង	Samraong Sangkat	002204
220405	សង្កាត់អូរស្មាច់	Ou Smach Sangkat	002204
220501	បាក់អន្លូង	Bak Anloung	002205
220502	ផ្អាវ	Ph'av	002205
220503	អូរស្វាយ	Ou Svay	002205
220504	ព្រះប្រឡាយ	Preah Pralay	002205
220505	ទំនប់ដាច់	Tumnob Dach	002205
220506	ត្រពាំងប្រាសាទ	Trapeang Prasat	002205
230101	អង្កោល	Angkaol	002301
230103	ពងទឹក	Pong Tuek	002301
230201	សង្កាត់កែប	Kaeb Sangkat	002302
230202	សង្កាត់ព្រៃធំ	Prey Thum Sangkat	002302
230203	សង្កាត់អូរក្រសារ	Ou Krasar Sangkat	002302
240101	សង្កាត់ប៉ៃលិន	Pailin Sangkat	002401
240102	សង្កាត់អូរតាវ៉ៅ	Ou Ta Vau Sangkat	002401
240103	សង្កាត់ទួលល្វា	Tuol Lvea Sangkat	002401
240104	សង្កាត់បរយ៉ាខា	Bar Yakha Sangkat	002401
240201	សាលាក្រៅ	Sala Krau	002402
240202	ស្ទឹងត្រង់	Stueng Trang	002402
240203	ស្ទឹងកាច់	Stueng Kach	002402
240204	អូរអណ្ដូង	Ou Andoung	002402
250101	ចុងជាច	Chong Cheach	002501
250102	តំបែរ	Dambae	002501
250103	គោកស្រុក	Kouk Srok	002501
250104	នាងទើត	Neang Teut	002501
250105	សេដា	Seda	002501
250106	ត្រពាំងព្រីង	Trapeang Pring	002501
250107	ទឹកជ្រៅ	Tuek Chrov	002501
250201	ឈូក	Chhuk	002502
250202	ជំនីក	Chumnik	002502
250203	កំពង់ទ្រាស	Kampong Treas	002502
250204	កោះពីរ	Kaoh Pir	002502
250205	ក្រូចឆ្មារ	Krouch Chhmar	002502
250206	ប៉ឺស១	Peus Muoy	002502
250207	ប៉ឺស២	Peus Pir	002502
250208	ព្រែកអាជី	Preaek A chi	002502
250209	រការខ្នុរ	Roka Khnor	002502
250210	ស្វាយឃ្លាំង	Svay Khleang	002502
250211	ទ្រា	Trea	002502
250212	ទួលស្នួល	Tuol Snuol	002502
250301	ចាន់មូល	Chan Mul	002503
250303	ជាំក្រវៀន	Choam Kravien	002503
250304	ជាំតាម៉ៅ	Choam Ta Mau	002503
250305	ដារ	Dar	002503
250306	កំពាន់	Kampoan	002503
250307	គគីរ	Kokir	002503
250308	មេមង	Memong	002503
250309	មេមត់	Memot	002503
250310	រំចេក	Rumchek	002503
250311	រូង	Rung	002503
250312	ទន្លូង	Tonlung	002503
250313	ត្រមូង	Tramung	002503
250314	ទ្រៀក	Triek	002503
250401	អំពិលតាពក	Ampil Ta Pok	002504
250402	ចក	Chak	002504
250403	ដំរិល	Damril	002504
250404	គងជ័យ	Kong Chey	002504
250405	មៀន	Mien	002504
250406	ព្រះធាតុ	Preah Theat	002504
250407	ទួលសូភី	Tuol Souphi	002504
250501	ដូនតី	Dountei	002505
250502	កក់	Kak	002505
250503	កណ្ដោលជ្រុំ	Kandaol Chrum	002505
250504	កោងកាង	Kaong Kang	002505
250505	ក្រែក	Kraek	002505
250506	ពពេល	Popel	002505
250507	ត្រពាំងផ្លុង	Trapeang Phlong	002505
250508	វាលម្លូរ	Veal Mlu	002505
250601	សង្កាត់សួង	Suong Sangkat	002506
250602	សង្កាត់វិហារលួង	Vihear Luong Sangkat	002506
250701	អញ្ចើម	Anhchaeum	002507
250702	បឹងព្រួល	Boeng Pruol	002507
250703	ជីគរ	Chikor	002507
250704	ជីរោទ៍ ទី១	Chirou Ti Muoy	002507
250705	ជីរោទ៍ ទី២	Chirou Ti Pir	002507
250706	ជប់	Chob	002507
250707	គរ	Kor	002507
250708	ល្ងៀង	Lngieng	002507
250709	មង់រៀវ	Mong Riev	002507
250710	ពាមជីលាំង	Peam Chileang	002507
250711	រកាពប្រាំ	Roka Po Pram	002507
250712	ស្រឡប់	Sralab	002507
250713	ថ្មពេជ្រ	Thma Pech	002507
250714	ទន្លេបិទ	Tonle Bet	002507
\.


--
-- Data for Name: education_levels; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.education_levels (id, name, created_at) FROM stdin;
1	បឋមសិក្សា	\N
\.


--
-- Data for Name: villages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.villages (village_code, name_kh, name_en, commune_id) FROM stdin;
01040201	ជប់	Chob	010402
02110305	ដំណាក់បេង	Damnak Beng	\N
02110306	ដំណាក់ក្សាន្ត	Dom Nakksan	\N
02110307	អូរដា	Oda	\N
02110308	ភ្នំប្រាំពីរ	Phnom 7	\N
02110309	បួរ	Bou	\N
02110310	អន្លង់ក្រូច	Anlung Kroch	\N
02110311	អន្លង់ស្តី	Anlung Sdei	\N
02110312	ស្ពានទំនាប	Spean Tomneab	\N
02110313	បុស្សស្អំ	Bos SaOm	\N
04080405	ងយ	Ngoy	040804
05051313	ពោធិ៍	Pou	\N
05050101	ក្រាំងទំនប់	Krang Tumnob	\N
05050102	ស្ដុកតោលថ្មី	Sdok Taol Thmei	\N
05050103	ស្ដុកតោលចាស់	Sdok Taol Chas	\N
05050104	ថ្មីទម្លាប់	Thmei Tumloab	\N
05050105	ទួលវិហារ	Tuol Vihear	\N
05050106	ត្រពាំងអំពិល	Trapeang Ampil	\N
05050107	ព្រៃទាន់	Prey Toan	\N
05050108	អន្លង់ចំណារ	Anlong Chamnar	\N
05050109	ចាន់សែន	Chanteak Saen	\N
05050110	ត្រពាំងអន្ទង់	Trapeang Antong	\N
05050111	ទំនប់ទឹក	Tumnob Tuek	\N
05050112	ត្រពាំងគោ	Trapeang Kou	\N
05050113	អំពិលទឹក	Ampil Tuek	\N
05050114	ស្ដុកអក	Sdok Ak	\N
05050115	ប៉ាលហាល	Pal Hal	\N
05050201	យស់ជោ	Yos Chour	\N
05050202	តាសាល	Ta Sal	\N
05050203	សារិកាកែវ	Sarekar Kaev	\N
05050204	តាយស់	Ta Yos	\N
05050205	ភ្នំទទឹង	Phnum Totueng	\N
05050206	សួសនៃ	Suos Ney	\N
05050207	បន្ទាយខ្មែរ	Banteay Khmer	\N
05050208	ត្រពាំងរការ	Trapeang Rokar	\N
05050209	អង្គសេរី	Angk Serei	\N
05050210	ភ្នំបាត	Phnum Bat	\N
05050211	ចេក	Chek	\N
05050212	សំបួរ	Sambuor	\N
05050213	អង្គតាប៉ុក	Angk Ta Pok	\N
05050214	ស្រង៉ែ	Srangae	\N
05050215	ច្រេស	Chres	\N
05050216	កំណប់	Kamnab	\N
05050301	ជំពូព្រឹក្ស	Chumpu Proeks	\N
05050302	ក្រាំងតាសោម	Krang Ta Saom	\N
05050303	ព្រៃអំពិល	Prey Ampil	\N
05050304	ច្រកពពូល	Chrak Popul	\N
05050305	ត្រាចខ្ពស់	Trach Khpos	\N
05050306	ព្រៃអន្សែ	Prey Ansae	\N
05050307	ត្រពាំងលាប	Trapeang Leab	\N
05050401	អូរសំរ៉ែ	Ou Samrae	\N
05050402	ដំបូកស	Dambouk Sa	\N
05050403	ត្រពាំងក្រឡូង	Trapeang Kraloung	\N
05050404	កណ្ដាល	kandal	\N
05050405	ត្រពាំងថ្ម	Trapeang Thma	\N
05050406	តាលីង	Ta Ling	\N
05050407	ព្រៃទទឹង	Prey Totueng	\N
05050408	ត្រពាំងប្រិយ៍	Trapeang Prei	\N
05050409	ត្រពាំងកន្សែង	Trapeang Kansaeng	\N
05050410	កាកាប	Kakab	\N
05050411	តាឡាក់	Ta Lak	\N
05050412	បាត់ដឹង	Bat Doeng	\N
05050413	បែកឃ្លោក	Baek Khlouk	\N
05050414	ដំណាក់ត្រាច	Damnak Trach	\N
05050415	ស្ដុកល្ពៅ	Sdok Lpov	\N
05050416	ត្រពាំងក្រសាំង	Trapeang Krasang	\N
05050417	តាឡក	Ta Lok	\N
05050418	ត្រាចទង	Trach Tong	\N
05050419	ព្រៃតាជៃ	Prey Ta Chey	\N
05050501	គោកសណ្ដែក	Kouk Sandaek	\N
05050502	រំពាត់ជ្រូក	Rumpoat Chruk	\N
05050503	ទួលបារ៉ាយ	Tuol Baray	\N
05050504	អង្គ	Angk	\N
05050505	អកយំ	Ak Yum	\N
05050506	ត្នោត	Tnaot	\N
05050507	ក្បាលគាយ	Kbal Keay	\N
05050508	សំបុកក្រៀល	Sambok Kriel	\N
05050509	ត្រពាំងសង្កែ	Trapeang Sangkae	\N
05050510	គ្រួស	Kruos	\N
05050511	ទួលស្ដៅ	Tuol Sdau	\N
05050512	ច្បារច្រុះ	Chbar Chroh	\N
05050513	ត្រពាំងមាន	Trapeang Mean	\N
05050514	កោះ	Kaoh	\N
05050515	តានី	Ta Ni	\N
05050516	ក្រាំងចេក	Krang Chek	\N
05050517	ក្រាំងជង្រុក	Krang Chongruk	\N
05050518	គោករវាយ	Kouk Roveay	\N
05050519	ទួលកែស	Tuol Kaes	\N
05050520	ត្រពាំងកក់	Trapeang Kak	\N
05050521	ត្រពាំងក្រឹម	Trapeang Kroem	\N
05050522	ស្ដៅឯម	Sdau Aem	\N
05050523	ដន្លង	Danlang	\N
05050524	អំពិលផ្អែម	Ampil Ph'aem	\N
05050601	ក្រាំងសុទិន	Krang Sotin	\N
05050602	ស្វាយ	Svay	\N
05050603	ទឹកឫស្សី	Tuek Ruessei	\N
05050604	រមាំងស្លាប់	Romeang Slab	\N
05050605	ទំពូង	Tumpung	\N
05050606	វាលទន្សាយ	Veal Tonsay	\N
05050607	ព្រៃជង្រុក	Prey Chongruk	\N
05050608	ស្ដុក	Sdok	\N
05050609	ស្ដុកស្អាត	Sdok S'at	\N
05050610	កណ្ដាល	Kandal	\N
05050611	ត្រពាំងចំបក់	Trapeang Chambak	\N
05050612	ព្រៃស្មិត	Prey Smet	\N
05050613	ទំនប់អង្គ	Tumnob Angk	\N
05050614	ភ្លើងឆេះ	Phleung Chheh	\N
05050701	អង្គសណ្ដាន់	Angk Sandan	\N
05050702	ពោធិ៍កោង	Pou Kaong	\N
05050703	តាជៀល	Ta Chiel	\N
05050704	ឈូកស	Chhuk Sa	\N
05050705	ស្រែចិន្ដា	Srae Chenda	\N
05050706	ស្វាយពក	Svay Pok	\N
05050707	ត្រពាំងសង្កែ	Trapeang Sangkae	\N
05050708	ក្បាលអូរ	Kbal ou	\N
05050709	អំពិលរូង	Ampil Rung	\N
05050710	ដំណាក់ព្រីង	Damnak Pring	\N
05050711	ទួលពង្រ	Tuol Pongro	\N
05050712	ព្រៃផ្ដៀក	Prey Phdiek	\N
05050713	រំលេច	Rumlech	\N
05050714	ទួលតារា	Tuol Ta Ra	\N
05050715	អង្គ្រង	Angkrong	\N
05050716	ប្រវឹកពង	Pravuek Pong	\N
05050717	ត្រពាំងឈូក	Trapeang Chhuk	\N
05050718	ប្រកិល	Prakel	\N
05050801	ឡខ្ទមខ្ពស់	La Khtom Khpos	\N
05050802	ទួល	Tuol	\N
05050803	គង់លឹង្គ	Kong Lueng	\N
05050804	ច្រក	Chrak	\N
05050805	ត្រពាំងលាន	Trapeang Lean	\N
05050806	ក្រាំងស្លែង	Krang Slaeng	\N
05050807	ព្រៃក្រសាំង	Prey Krasang	\N
05050808	កណ្ដក់	Kandak	\N
05050809	ត្រពាំងបង្រុះ	Trapeang Bangruh	\N
05050810	ព្រៃផ្ដៅ	Prey Phdau	\N
05050811	ក្រាំងដូង	Krang Doung	\N
05050812	ត្រពាំងជ្រៅ	Trapeang Chrov	\N
05050813	ក្រាំងក្រូច	Krang Krouch	\N
05050814	គោកចារ្យ	Kouk Char	\N
05050815	ស្វាយភ្លោះ	Svay Phluoh	\N
05050901	តាឌុង	Ta Dung	\N
05050902	ឫស្សីមួយគុម្ព	Ruessei Muoy Kum	\N
05050903	ក្រាំងត្រប់	Krang Trab	\N
05050904	ត្រពាំងក្ដុល	Trapeang Kdol	\N
05050905	បឹង	Boeng	\N
05050906	អណ្ដូងច្រុះ	Andoung Chroh	\N
05050907	ត្រពាំងលើក	Trapeang Leuk	\N
05050908	ត្រពាំងអង្គ្រង	Trapeang Angkrong	\N
05050909	ក្រសាំងផ្អែម	Krasang Ph'aem	\N
05050910	ស្រះស្ដេច	Srah Sdach	\N
05050911	ឃ្លាំង	Khleang	\N
05050912	ទួលខ្លុង	Tuol Khlong	\N
05050913	រ៉ា	Ra	\N
05050914	បឹងវ៉ា	Boeng Va	\N
05050915	ត្រពាំងខ្ចៅ	Trapeang Khchau	\N
05050916	ថ្មី	Thmei	\N
05050917	ត្រពាំងល្ពាក់	Trapeang Lpeak	\N
05051002	ព្រៃច្រាបលិច	Prey Chrab Lech	\N
05051003	ព្រៃទទឹង	Prey Totueng	\N
05051004	ផ្គរ	Phkor	\N
05051005	ខ្នុរអំពិល	Khnor Ampil	\N
05051006	ត្រពាំងក្អែក	Trapeang K'aek	\N
05051007	ថល់	Thal	\N
05051008	ខ្សាច់ពួន	Khsach Puon	\N
05051009	ខ្ចាស់	Khchas	\N
05051010	ក្រឡាញ់	Kralanh	\N
05051011	ទួល	Tuol	\N
05051012	ធ្លាចាស់	Thlea Chas	\N
05051013	សូវង្សក្រោម	Souvongs Kraom	\N
05051014	ក្រាំងពញា	Krang Ponhea	\N
05051015	ត្រពាំងពោធិ៍	Trapeang Pou	\N
05051016	ត្រពាំងខ្ទុំ	Trapeang Khtum	\N
05051017	ដំណាក់ស្មាច់	Damnak Smach	\N
05051018	ចំការដូង	Chamkar Doung	\N
05051019	ស្ដុកក្រោល	Sdok Kraol	\N
05051020	វាលពង់	Veal Pong	\N
05051021	សូវង្សលើ	Souvongs Leu	\N
05051022	ស្នាមពុក	Snam Puk	\N
05051023	ពោធិ៍	Pou	\N
05051024	អណ្ដូងចំបក់	Andoung Chambak	\N
05051025	វត្ដក្ដី	Voat Kdei	\N
05051026	បូរីរម្យ	Boureirom	\N
05051027	សាមគ្គីភាព	Sameakkipheap	\N
05051001	ព្រៃច្រាបកើត	Prey Chrab Kaeut	\N
05051101	ឧដុង្គ	Oudong	\N
05051102	អូរការុង	OKarong	\N
05051103	ចំការហ្លួង	Chamkar Luong	\N
05051104	វិហារខ្ពស់	Vihear Khpos	\N
05051105	ឃ្លាំងប្រាំ	Khlang Pram	\N
05051106	ក្នុងវាំង	Knong Veang	\N
05051107	ចិនដាំម្លូ	Chen Dam Mlou	\N
05051108	ស្រះកែវ	Srah Keo	\N
05051109	ក្រាំងពន្លៃ	Krang Ponley	\N
05051110	វត្ដពោធិ៍	Voat Pou	\N
05051201	ព្រៃធំ	Prey Thum	\N
05051202	ត្រាចកោង	Trach Kaong	\N
05051203	អង្គរបាន	Angkor Ban	\N
05051204	រោងគោ	Roung Kou	\N
05051205	ព្រៃជុំ	Prey Chum	\N
05051206	ធម្មទ័យ	Thommeak Tey	\N
05051207	ត្រពាំងខ្នា	Trapeang Khna	\N
05051208	ព្រៃទាន	Prey Tean	\N
05051209	ត្រពាំងធំ	Trapeang Thum	\N
05051210	រូង	Rung	\N
05051211	រាំងទេ	Reang Te	\N
05051212	ក្រាំងក្ដី	Krang Kdei	\N
05051213	ក្រាំងច្រេស	Krang Chres	\N
05051214	ត្រពាំងល្ពាក់	Trapeang Lpeak	\N
05051215	ស្រះធុល	Srah Thul	\N
05051301	ក្រាំងខ្នុរ	Krang Knor	\N
05051302	ជំទប់មាន់	Chumtob Moan	\N
05051303	ចំបក់រន្ធ	Chambak Ron	\N
05051304	ស្ដុក	Sdok	\N
05051305	ទួលសំណាង	Tuol Samnang	\N
05051306	ត្រពាំងស្មាច់	Trapeang Smach	\N
05051307	ខ្សាច់ពូន	Khsach Poun	\N
05051308	ដំណាក់រាំង	Damnak Reang	\N
05051309	ត្រពាំងវែង	Trapeang Veaeng	\N
05051310	អង្រ្គង	Angkrong	\N
05051311	ពងទឹក	Pong Tuek	\N
05051312	ទួលសំបូរ	Tuol Sambour	\N
05051314	ត្រពាំងរុន	Trapeang Run	\N
05051315	ទំនប់បាក់	Tumnob Bak	\N
05051316	ពីងពង់	Pingpong	\N
05051317	ដឹកពាង	Doek Peang	\N
05051318	ត្រពាំងផ្លុង	Trapeang Phlong	\N
05051401	ពាំងល្វា	Peang Lvea	\N
05051402	អាយាន	Ayean	\N
05051403	គង្រុត	Kongrut	\N
05051404	ស្រែអូរ	Srae Ou	\N
05051405	យាផ្លង	Yea Phlang	\N
05051406	សារ៉ាម	Saram	\N
05051407	ត្រោក	Traok	\N
05051408	អន្លង់ភេ	Anlong Phe	\N
05051409	សួស្ដី	Suor Sdei	\N
05051410	ត្រពាំងរំចេក	Trapeang Rumchek	\N
05051411	ខ្វឹត	Khvet	\N
05051412	ឆ្វេក	Chvek	\N
05051413	ត្រពាំងស្គន់	Trapeang Skon	\N
05051414	កណ្ដាល	Kandal	\N
05051415	ត្រពាំងអណ្ដូង	Trapeang Andoung	\N
05051416	ត្រពាំងពោធិ៍	Trapeang Pou	\N
05051417	ចឹនថ្មី	Chen Thmei	\N
05051418	មាត់អូរ	Moat Ou	\N
05051501	ក្របីព្រៃ	Krabei Prey	\N
05051502	រោងដំរី	Roung Damrei	\N
05051503	ស្ដុកស្លាត	Sdok Slat	\N
05051504	ចាអោក	Cha Aok	\N
05051505	អង្គតាឯក	Angk Ta Aek	\N
05051506	ដំណាក់ខ្លា	Damnak Khla	\N
05051507	ព្រៃក្ដួច	Prey Kduoch	\N
05051508	ក្រាំងអារីយ៏	Krang Arei	\N
05051509	ត្រពាំងទូក	Trapeang Touk	\N
05051510	ពន្នរ	Ponnor	\N
05051511	ត្រពាំងសុភី	Trapeang Souphi	\N
05051512	ត្រពាំងកំប៉ោះ	Trapeang Kampaoh	\N
05051513	ព្រៃព្រាល	Prey Preal	\N
05051514	ព្រៃរោង	Prey Rong	\N
05051515	ត្រពាំងក្រឡឹង	Trapeang Kraloeng	\N
05051516	ព្រៃតាទ្រូ	Prey Ta Trou	\N
05051517	ត្រពាំងពោធិ៍	Trapeang Pou	\N
05051518	វត្ដភ្នំ	Voat Phnom	\N
06010601	ពោន	Poun	\N
06010602	ច្រនាង	Chranieng	\N
06010603	ត្រពាំងវែង	Trapeang veaeng	\N
06010604	ថ្លា	Thla	\N
06010605	ចាន់	Chan	\N
06010606	ស្រះបន្ទាយ	Srah Banteay	\N
06010607	សៀមរាង	Siem Reang	\N
06010608	អង្គរជា	Angkor Chea	\N
06010609	កន្ធំ	Kanthum	\N
06010610	ត្រពាំងខ្លង	Trapeang khlong	\N
06010611	ប្រាំងសំរោង	Prang Samraong	\N
06010612	អូរំចេក	Ou Rumchek	\N
06010613	ប៉ាង	Pang	\N
06010901	ទួលទំពូង	Tuol Tumpung	\N
06010902	បុស្សស្បែង	Bos Sbaeng	\N
06010903	ជាប	Cheab	\N
06010904	ត្រណាល	Tranal	\N
06010905	ថ្មអណ្ដែត	Thma Andaet	\N
06010906	ត្រពាំងឈូក	Trapeang Chhuk	\N
06010907	សេរីចំប៉ា	Serei Champa	\N
06010908	ហាន់ទ្វារ	Han Tvear	\N
06010909	ត្រពាំងច្រនៀង	Trapeang Chranieng	\N
06011201	ជីវភាព	Chiveakpheap	\N
06011202	បែកចាន	Baek Chan	\N
06011203	ដំរីស្លាប់	Damrei Slab	\N
06011204	អណ្ដូងពោធិ៍	Andoung Pou	\N
06011205	វាលតូច	Veal Touch	\N
06011206	គុហ៍បារែង	Ku Baraeng	\N
06011207	គ្រើល	Kreul	\N
06011301	តាព្រៃ	Ta Prey	\N
06011302	អូររាំង	Ou Reang	\N
06011303	ពង្រ	Pongro	\N
06011304	អមទង	Am Tong	\N
06011305	ត្រដក់ពង	Tradak Pong	\N
06011306	ស្រះសំបួរ	Srah Sambuor	\N
06011307	ថ្នល់កែង	Thnal Kaeng	\N
06011401	តាំងគោក	Tang Kouk	\N
06011402	រស្មីរំដោះ	Reaksmei Rumdaoh	\N
06011403	សង្គមមានជ័យ	Sangkom Mean Chey	\N
06011404	តាម៉ី	Ta Mei	\N
06011405	ថ្លា	Thla	\N
06011406	ខ្លុយកើត	Khloy Kaeut	\N
06011407	ខ្លុយលិច	Khloy Lech	\N
06011408	សៀមរាយ	Siem Reay	\N
06011409	សូយោង	Souyoung	\N
06011410	ខ្ញោម	Khnhaom	\N
06011411	កាតាយ	Katay	\N
06011501	សេរីសាមគ្គីខាងត្បូង	Serei Sameakki Khang Tboung	\N
06011502	សេរីសាមគ្គីខាងជើង	Serei Sameakki Khang Cheung	\N
06011503	ដំរីស្លាប់	Damrei Slab	\N
06011504	គគរ	Kokor	\N
06011505	អ្នកវាំង	Neak Veang	\N
06011506	ទួលអំពិល	Tuol Ampil	\N
06011507	សេរីសាមគ្កីកណ្ដាល	Serei Sameakki Kandal	\N
06011508	ស្នួល	Snuol	\N
06011509	គោកអណ្ដែត	Kouk Andaet	\N
06011510	ទួលពភ្លា	Tuol Poplea	\N
06011511	បុស្សល្វា	Bos Lvea	\N
06011512	ទោង	Toung	\N
06011513	ដំណាក់	Damnak	\N
06011514	ឧទុម្ពរ	Otumpor	\N
06011515	គោកត្របែក	Kork Trabaek	\N
06011601	ប្រតោង	Prataong	\N
06011602	ស្វាយភ្លើង	Svay Phleung	\N
06011603	ខ្នាយទង	Khnay Tong	\N
06011604	ក្រូច	Krouch	\N
06011605	ត្រពាំងសង្កែ	Trapeang Sangkae	\N
06011606	ប៉ប្រក	Paprak	\N
06011607	ឫស្សីល័រ	Ruessei Lor	\N
06011801	គីរីអណ្ដែត	Kiri Andaet	\N
06011802	រំចេក	Rumchek	\N
06011803	ព្នៅ	Pnov	\N
06011804	ស្វាយម្សៅ	Svay Msau	\N
06011805	ឈូក	Chhuk	\N
06011806	ទ្រៀល	Triel	\N
06011807	ទន្លេវល្លិ	Tonle Voa	\N
06011808	សាលាឃុំ	Sala Khum	\N
06011809	កំញ៉ាត	Kamnhat	\N
06011810	ត្នោត	Tnaot	\N
06011811	ថ្មី	Thmei	\N
06011812	រពាក់ពេន	Ropeak Pen	\N
06011813	អង្គរនាង	Angkor Neang	\N
06011814	នាងល្អ	Neang L'a	\N
06011815	ប្រខ្នាយ	Prakhnay	\N
06011816	កំចាយមារ	Kamchay Mear	\N
06011817	ដារ	Dar	\N
06011818	ក្ដីតាចិន	Kdei Ta Chen	\N
06011819	វាលអំពិល	Veal Ampil	\N
06011820	ព្រៃវែង	Prey Veaeng	\N
06011821	ថ្នល់	Thnal	\N
06011822	ប្រិច	Prech	\N
08030504	ចុងកោះ	Chong Kaoh	\N
06060708	ជរ	Chor	060607
07070101	រលួស	Roluos	\N
07070102	កែបថ្មី	Kaeb Thmei	\N
07070103	ទទឹងថ្ងៃ	Totueng Thngai	\N
07070701	គីឡូ ១២	Kilou Dabpir	\N
07070702	ព្រែកចេក	Preaek Chek	\N
07070703	កណ្ដាល	Kandal	\N
07070704	ព្រែកអំពិល	Preaek Ampil	\N
07071101	ត្រពាំងរពៅ	Trapeang Ropov	\N
07071102	ព្រែកក្រែង	Preaek Kraeng	\N
07071103	ព្រែកត្នោត	Preaek Tnaot	\N
07071104	ចង្ហោន	Changhaon	\N
08030505	ខ្ពប	Khpob	\N
08030101	ជ្រោយខ្សាច់	Chrouy Khsach	\N
08030102	បាក់ដាវលើ	Bak Dav Leu	\N
08030103	បាក់ដាវក្រោម	Bak Dav Kraom	\N
08030104	ព្រែកជ្រូក	Preaek Chruk	\N
08030501	កោះតូច	Kaoh Touch	\N
08030502	ក្បាលកោះ	Kbal Kaoh	\N
08030503	កណ្ដាលកោះ	Kandal Kaoh	\N
08030404	លើ	Leu	080304
08030701	ឃ្លាំងមឿងជើង	Khleang Moeang Cheung	\N
08030702	ឃ្លាំងមឿងត្បូង	Khleang Moeang Tboung	\N
08030703	ព្រែកក្របៅ ទី១	Preaek Krabau Ti Muoy	\N
08030704	ព្រែកក្របៅ ទី២	Preaek Krabau Ti Pir	\N
08030705	ព្រែកក្របៅ ទី៣	Preaek Krabau Ti Bei	\N
08030706	ព្រែកដូនហែម	Preaek Doun Haem	\N
08030707	ព្រែកអំពិល	Preaek Ampil	\N
08030801	ក្ដីចាស់	Kdei Chas	\N
08030802	ព្រែកតាទេព	Preaek Ta Tep	\N
08030803	ព្រែកលួង	Preaek Luong	\N
08030804	ព្រែកថោង	Preaek Thaong	\N
08030901	ព្រែកតាកូវ	Preaek Ta Kov	\N
08030902	ព្រែកល្វា	Preaek Lvea	\N
08030903	ព្រែកបង្កង	Preak Bangkang	\N
08031501	លើ	Leu	\N
08031502	ស្វាយជ្រុំ	Svay Chrum	\N
08031503	បារាជ	Ba Reach	\N
08040101	ក្បាលកោះ	Kbal Kaoh	\N
08040102	ឈើខ្មៅ	Chheu Khmau	\N
08040103	ចុងកោះ	Chong Kaoh	\N
08040104	ត្រពាំងជ្រៃ	Trapeang Chrey	\N
08040105	ត្រើយកោះ	Traeuy Kaoh	\N
08040106	ក្បាលជ្រោយ	Kbal Chrouy	\N
08040107	កោះតូច	Kaoh Touch	\N
08040108	ចុងខ្សាច់	Chong Khsach	\N
08040109	ធំ	Thom	\N
08040110	ថ្មី	Thmei	\N
08040111	ទួលស្វាយ	Tuol Svay	\N
08040201	ព្រែកថ្មី	Preaek Thmei	\N
08040202	ព្រែកត្រឡាច	Preaek Tralach	\N
08040203	កំពង់ដ	Kampong Dar	\N
08040204	ជ្រោយតាកែវ	Chrouy Ta Kaev	\N
08040205	ព្រែកតាឃិន	Preaek Ta Khin	\N
08040206	ព្រែកតាទៀង	Preaek Ta Tieng	\N
08040207	ព្រែកតាសេក	Preaek Ta Sek	\N
08040208	ដើមពោធិ៍	Daeum Pou	\N
08040209	ព្រែកភូមិ	Preaek Phum	\N
08040901	ជ្រោយស្នោ	Chrouy Snao	\N
08040902	ព្រែកជ្រៃ	Preaek Chrey	\N
08040903	ប៉ាកណាម	Pak Nam	\N
08040904	ខ្នារតាំងយូ	Khnar Tangyu	\N
08040905	ព្រែកជ្រៃក្រៅ	Preaek Chrey Kraw	\N
08040906	ខ្នាតាំងយូរត្បូង	Khnar Tangyu Tboung	\N
08040907	ព្រែកទន្លា	Preaek Tunlea	\N
08041001	ព្រែកមេស្រុក	Preaek Me Srok	\N
08041002	ព្រែកលោក	Preaek Louk	\N
08041003	ព្រែកប៉ុក	Preaek Pok	\N
08041004	អន្លង់សាន្ដ	Anlong Sant	\N
08041005	ចុងព្រែក	Chong Preaek	\N
08041006	ព្រែកតាមេម	Preaek Ta Mem	\N
08041007	កោះចាស់	Kaoh Chas	\N
08041008	ពោធិ៍រាម្មា	Pouthi Reamea	\N
08041009	ប្រធាតុ	Pratheat	\N
08041010	ព្រែកស្តី	Preaek Sdei	\N
08041011	ចាស់	Chas	\N
08041012	ឡក្បឿង	La Kbueng	\N
08041013	ពោធិ៍រាម្មា ក	Pouthi Reamea Ka	\N
08041014	ពោធិ៍អណ្តែត	Pouthi Andaet	\N
08041015	ប្រធាតុ ក	Pratheat Ka	\N
08041201	ក្បាលកោះទៀវ	Kbal Koh Teav	\N
08041202	កោះទៀវ ក	Koh h Teav kor	\N
08041203	កោះទៀវ ខ	Koh Teav Khor	\N
08041204	ខ្ពប	Khpop	\N
08041205	កំពង់ថ្កុល	Kampong Thkol	\N
08041206	កប៉ាល់គឿង	Kapal Koeung	\N
08041207	ព្រែកស៊ឹង	Prek Sung	\N
08041208	ជ្រៃធំ	Chrey Thom	\N
08041209	ព្រែកស្បូវ	Prek Sbov	\N
08041210	ព្រែកគង់	Preaek Kong	\N
08041211	ព្រែកសែម	Preaek Saem	\N
08060101	អរិយក្សត្រ	Akreiy Ksatr	\N
08060102	ខ្សាច់	Khsach	\N
08060103	ពោធិ៍ធំ	Pou Thum	\N
08060104	ទួលមាស	Tuol Meas	\N
08060201	ខ្នោការ	Khnaor Kar	\N
08060202	បារុង	Barong	\N
08060701	ពាមតាឯក	Peam Ta Aek	\N
08060702	ព្រែកតាអុងទី១	Preaek Ta Ong Ti Muoy	\N
08060703	ព្រែកតាអុងទី២	Preaek Ta Ong Ti Pir	\N
08060704	ព្រែកតាអុងទី៣	Preaek Ta Ong Ti Bei	\N
08060705	វាលធំ	Veal Thum	\N
08060901	ព្រែកក្មេង	Preaek Kmeng	\N
08060902	ទួលទ្រា	Tuol Trea	\N
08070305	លើ	Leu	080703
08100201	ក្បាលកោះ	Kbal Kaoh	\N
08100202	កណ្ដាលកោះ	Kandal Kaoh	\N
08100203	ស្វាយពងអង្ក្រង	Svay Pong Angkrang	\N
08100204	ចុងកោះ	Chong Kaoh	\N
08100901	កោះគរ	Kaoh Kor	\N
08100902	ព្រែកថី	Preaek Thei	\N
08100903	ព្រែកសំរោង	Preaek Samraong	\N
08100904	ព្រែកខ្សេវ	Preaek Khsev	\N
08100905	ទួលក្រសាំង	Tuol Krasang	\N
08100906	កោះរំដួល	Kaoh Romduol	\N
08100907	ព្រែកឡុង	Preak Long	\N
08101101	ព្រែកតាព្រីង	Preaek Ta Pring	\N
08101102	សិត្បូ	Setbou	\N
08101103	កំពង់ព្រីង	Kampong Pring	\N
08101104	ព្រែកត្រែង	Preaek Traeng	\N
08101301	លេខ១	Lekh Muoy	\N
08101302	លេខ២	Lekh Pir	\N
08101303	លេខ៣	Lekh Bei	\N
08101304	លេខ៤	Lekh Buon	\N
08101305	លេខ៥	Lekh Pram	\N
08101306	លេខ១ ក	Lekh Muoy Kar	\N
14010603	សៀម	Siem	140106
14121103	យស់	Yos	141211
14131006	បឹង	Boeng	141310
15020605	វាល	Veal	150206
15040401	សាយ	Say	150404
17010102	យាង	Yeang	170101
20060402	ឡ	La	200604
21090411	បឹង	Boeng	210904
01020101	អូរធំ	Ou Thum	010201
01020102	ភ្នំ	Phnum	010201
01020103	បន្ទាយនាង	Banteay Neang	010201
01020104	គោកព្នៅ	Kouk Pnov	010201
01020105	ត្រាង	Trang	010201
01020106	ពង្រ	Pongro	010201
01020107	គោកទន្លាប់	Kouk Tonloab	010201
01020108	ត្របែក	Trabaek	010201
01020109	ឃីឡិក	Khilek	010201
01020110	សំរោងពេន	Samraong Pen	010201
01020111	ដងរុនលិច	Dang Run Lech	010201
01020112	ដងរុនកើត	Dang Run Kaeut	010201
01020113	អូរស្ងួត	Ou Snguot	010201
01020114	ព្រៃចង្ហាលិច	Prey Changha Lech	010201
01020115	ព្រៃចង្ហាកើត	Prey Changha Kaeut	010201
01020116	អូរអណ្ដូងលិច	Ou Andoung Lech	010201
01020117	អូរអណ្ដូងកណ្ដាល	Ou Andoung Kandal	010201
01020118	អូរអណ្ដូងកើត	Ou Andoung Kaeut	010201
01020119	គោកក្ដួច	Kouk Kduoch	010201
01020201	ខ្ទុម្ពរាយលិច	Khtum Reay Lech	010202
01020202	ខ្ទុម្ពរាយកើត	Khtum Reay Kaeut	010202
01020203	អន្លង់ថ្ងាន់កើត	Anlong Thngan Kaeut	010202
01020204	អន្លង់ថ្ងាន់លិច	Anlong Thngan Lech	010202
01020205	បង់បត់លិច	Bang Bat Lech	010202
01020206	បង់បត់កើត	Bang Bat Kaeut	010202
01020207	បត់ត្រង់	Bat Trang	010202
01020208	បត់ត្រង់ធំលិច	Bat Trang Thum Lech	010202
01020209	បត់ត្រង់ធំកើត	Bat Trang Thum Kaeut	010202
01020210	បត់ត្រង់តូច	Bat Trang Touch	010202
01020211	ព្រែកជីក	Preaek Chik	010202
01020301	ប្រឡាយចារ៍	Pralay Char	010203
01020302	រង្វានលិច	Rongvean Lech	010203
01020303	រង្វានកើត	Rongvean Kaeut	010203
01020304	ចំណោមលិច	Chamnaom Lech	010203
01020305	ចំណោមកើត	Chamnaom Kaeut	010203
01020306	រោងគោដើម	Roung Kou Daeum	010203
01020307	រោងគោកណ្ដាល	Roung Kou Kandal	010203
01020308	រោងគោចុង	Roung Kou Chong	010203
01020309	ពាមរោងគោ	Peam Roung Kou	010203
01020310	តាសល់	Ta Sal	010203
01020311	ជួរខ្ចាស់	Chuor Khchas	010203
01020312	បឹងត្រស់	Boeng Tras	010203
01020313	ដងត្រាង	Dang Trang	010203
01020314	ស្រែព្រៃ	Srae Prey	010203
01020315	បុស្បទន្លាប់	Bos Tonloab	010203
01020316	តាប៊ុន	Ta  Bun	010203
01020317	គោកពន្លៃ	Kouk Ponley	010203
01020318	សាយសាម៉ន	Say Samon	010203
01020401	គោកបល្ល័ង្ក	Kouk Ballangk	010204
01020402	តាអន	Ta An	010204
01020403	ប្រឡាយជ្រៃ	Pralay Chrey	010204
01020404	ជើងចាប	Cheung Chab	010204
01020405	ផាត់សណ្ដោង	Phat Sandaong	010204
01020406	ចារថ្មី	Char Thmei	010204
01020407	ផ្អាវថ្មី	Ph'av Thmei	010204
01020408	តាសល់	Ta Sal	010204
01020501	គយម៉ែង	Koy Maeng	010205
01020502	ស្ដីលើ	Sdei Leu	010205
01020503	ផ្លូវសៀម	Phlov Siem	010205
01020504	តានង	Ta Nong	010205
01020505	អង្ករខ្មៅ	Angkar Khmau	010205
01020506	កសាងថ្មី	Kasang Thmei	010205
01020507	ស្ទឹងចាស់	Stueng Chas	010205
01020508	ស្ដីក្រោម	Sdei Kraom	010205
01020601	ភ្នំធំត្បូង	Phnum Thum Tboung	010206
01020602	ភ្នំប្រាសាទ	Phnum Prasat	010206
01020603	ភ្នំធំជើង	Phnum Thum Cheung	010206
01020604	ចំការលោក	Chamkar Louk	010206
01030106	ច្រាប	Chrab	010301
01020605	ភ្នំធំថ្មី	Phnum Thum Thmei	010206
01020606	អន្លង់ស្ដី	Anlong Sdei	010206
01020607	គោកធ្លង់កើត	Kouk Thlong Kaeut	010206
01020608	គោកធ្លង់កណ្ដាល	Kouk Thlong Kandal	010206
01020609	អូរស្ងួត	Ou Snguot	010206
01020610	អូរប្រាសាទ	Ou Prasat	010206
01020611	គោកអំពិល	Kouk Ampil	010206
01020612	រ៉ាចំការចេក	Ra Chamkar Chek	010206
01020613	ពោធិ៍រៀង	Pou Rieng	010206
01020614	រូងក្របៅ	Rung Krabau	010206
01020701	ភ្នំតូចត្បូង	Phnum Touch Tboung	010207
01020702	ភ្នំតូចជើង	Phnum Touch Cheung	010207
01020703	ថ្នល់បត់	Thnal Bat	010207
01020704	អូរញរ	Ou Nhor	010207
01020705	បឹងត្រស់	Boeng Tras	010207
01020706	មនោរម្យ	Monourom	010207
01020707	ប៉ោយតាសេក	Paoy Ta Sek	010207
01020708	ព្រៃទទឹង	Prey Totueng	010207
01020709	បឹងរាំង	Boeng Reang	010207
01020710	វត្ដថ្មី	Voat Thmei	010207
01020801	ពោធិ៍ពីរដើម	Pou Pir Daeum	010208
01020802	រហាត់ទឹក	Rohat Tuek	010208
01020803	ថ្នល់បត់	Thnal Bat	010208
01020804	ក្រមល់	Kramol	010208
01020805	ខ្ទុំជ្រុំ	Khtum Chrum	010208
01020806	ចកលិច	Chak Lech	010208
01020807	ដូនមូល	Doun Mul	010208
01020808	ព្រែកសំរោង	Preaek Samraong	010208
01020809	អូរដង្កោ	Ou Dangkao	010208
01020810	ចំការចេក	Chamkar Chek	010208
01020811	អូរជួប	Ou Chuob	010208
01020812	កស្វាយ	Ka Svay	010208
01020813	ចកកើត	Chak Kaeut	010208
01020901	អញ្ចាញ	Anhchanh	010209
01020902	នាងកេត	Neang Ket	010209
01020903	ព្រែករពៅ	Praek Ropov	010209
01020904	សាលាដែង	Sala Daeng	010209
01020905	សំរោង	Samraong	010209
01020906	អន្លង់មានទ្រព្យ	Anlong Mean Troap	010209
01020907	ចំការតាដោក	Chamkar Ta Daok	010209
01020908	ប្រទ្បាយហ្លួងក្រោម	Pralay Luong Kraom	010209
01020909	ហ្លួង	Luong	010209
01020910	អូរតាគល់	Ou Ta Kol	010209
01020911	ប្រទ្បាយហ្លួងលើ	Pralay Luong Leu	010209
01020912	គោកស្វាយ	Kouk Svay	010209
01020913	អូរតាម៉ា	Ou Ta Ma	010209
01020914	កោះកែវ	Kaoh Kaev	010209
01020915	ផាស៊ីស្រា	Phasi Sra	010209
01020916	ឫស្សីក្រោក	Ruessei Kraok	010209
01020917	ជំទាវ	Chumteav	010209
01021001	ឆ្នើមមាស	Chhnaeum Meas	010210
01021002	ស្រណាល	Sranal	010210
01021003	ឡ	La	010210
01021004	តាមែងពក	Ta Meaeng Pok	010210
01021005	សំបួរ	Sambuor	010210
01021006	ដូនឡឹក	Doun Loek	010210
01021007	ក្បាលក្របី	Kbal Krabei	010210
01021008	ស្រះឈូក	Srah Chhuk	010210
01021009	ស្រែព្រៃ	Srae Prey	010210
01021010	ចែកអង្ករ	Chaek Angkar	010210
01021011	ថ្មដប់	Thma Dab	010210
01021101	តាម៉ៅ	Ta Mau	010211
01021102	អន្សមចេក	Ansam Chek	010211
01021103	ត្នោត	Tnaot	010211
01021104	បួរ	Buor	010211
01021105	បុស្សឡោក	Bos Laok	010211
01021106	សឿ	Soea	010211
01021107	បឹងតូច	Boeng Touch	010211
01021108	ផ្លូវដំរីលើ	Phlov Damrei Leu	010211
01021109	ផ្លូវដំរីក្រោម	Phlov Damrei Kraom	010211
01021110	អូរសឿ	Ou Soea	010211
01021111	គោកសំរោង	Kouk Samraong	010211
01021112	បល្ល័ង្គជ្រៃ	Balang Chrey	010211
01021113	អូរជួបថ្មី	Ou Choub Thmey	010211
01021201	តាអ៊ិន១	Ta In Muoy	010212
01021202	តាអ៊ិន២	Ta In Pir	010212
01021203	ក្រូច	Krouch	010212
01021204	ចំការចេក	Chamkar Chek	010212
01021205	ស្រះរាំង	Srah Reang	010212
01021206	តាចាន់	Ta Chan	010212
01021207	គោកស្រុក	Kouk Srok	010212
01021208	គោកច្រាប	Kouk Chrab	010212
01021209	គោកក្រសាំង	Kouk Krasang	010212
01021301	ព្រះស្រែ	Preah Srae	010213
01021302	តាឡំកណ្ដាល	Ta Lam Kandal	010213
01021303	តាឡំចុង	Ta Lam Chong	010213
01021304	បឹងឃ្លាំងលិច	Boeng Khleang Lech	010213
01021305	ចុងគោក	Chong Kouk	010213
01021306	បឹងឃ្លាំងកើត	Boeng Khleang Kaeut	010213
01021307	ខ្លាខាំឆ្កែ	Khla Kham Chhkae	010213
01021308	បឹងវែង	Boeng Veaeng	010213
01030101	រង្វាន	Rongvean	010301
01030102	ថ្មីខាងត្បូង	Thmei Khang Tboung	010301
01030103	ថ្មីខាងជើង	Thmei Khang Cheung	010301
01030104	គោកយាង	Kouk Yeang	010301
01030105	គោកចាស់	Kouk Chas	010301
01030107	កន្ទួត	Kantuot	010301
01030108	ណាំតៅ	Nam Tau	010301
01030109	ពង្រ	Pongro	010301
01030110	សំរោង	Samraong	010301
01030111	ក្នាំង	Khnang	010301
01030112	ធ្នង់ខាងត្បូង	Thnong Khang Tboung	010301
01030113	ធ្នង់ខាងជើង	Thnong Khang Cheung	010301
01030114	ស្លែង	Slaeng	010301
01030115	តាគង់	Takong	010301
01030116	យាងឧត្ដម	Yeang Otdam	010301
01030117	អំពិលកោង	Ampil Kaong	010301
01030118	កុងសៀម	Kong Siem	010301
01030201	ប៉ោយស្នួល	Paoy Snuol	010302
01030202	ប៉ោយចារ	Paoy Char	010302
01030203	ត្រពាំងថ្មត្បូង	Trapeang Thma Tboung	010302
01030204	ត្រពាំងថ្មជើង	Trapeang Thma Cheung	010302
01030205	ត្រពាំងថ្មកណ្ដាល	Trapeang Thma Kandal	010302
01030206	ប៉ោយតាអុង	Paoy Ta Ong	010302
01030207	សំបួរ	Sambuor	010302
01030208	ពង្រ	Pongro	010302
01030301	តាវង	Ta Vong	010303
01030302	ពន្លៃ	Ponley	010303
01030303	ស្វាយស	Svay Sa	010303
01030304	ស្វាយខ្មៅ	Svay Khmau	010303
01030305	គោគតាសុខ	Kouk Ta Sokh	010303
01030306	ពោធិ៍រាំបុណ្យ	Pou Roam Bon	010303
01030401	រោគ	Rouk	010304
01030402	មុខឈ្នាង	Mukh Chhneang	010304
01030403	ស្ពាន	Spean	010304
01030404	គោកចារ	Kouk Char	010304
01030405	កណ្ដាល	Kandal	010304
01030406	ពង្រ	Pongro	010304
01030501	មាត់ស្រះ	Moat Srah	010305
01030502	ស្រះឈូកខាងលិច	Srah Chhuk Khang Lech	010305
01030503	ស្រះជីក	Srah Chik	010305
01030504	គោកក្រោល	Kouk Kral	010305
01030505	គោករំចេក	Kouk Rumchek	010305
01030506	គោកតារាជ្យ	Kouk Ta Reach	010305
01030507	កណ្ដាលខាងលិច	Kandal Khang Lech	010305
01030508	កណ្ដាលខាងកើត	Kandal Khang Kaeut	010305
01030509	ស្រះឈូកខាងកើត	Srah Chhuk Khang Kaeut	010305
01030601	ភ្នំដី	Phnum Dei	010306
01030602	ពន្លៃ	Ponley	010306
01030603	គោកសេះ	Kouk Seh	010306
01030604	ថ្នល់ដាច់	Thnal Dach	010306
01030605	បុស្បូវ	Bos Sbov	010306
01030606	ត្រពាំងប្រីយ៍	Trapeang Prei	010306
01030607	កំពីងពួយ	Kamping Puoy	010306
01030608	ស្ពានក្មេង	Spean Khmeng	010306
01030609	ត្រាង	Trang	010306
01040101	សំរោងតូច	Samraong Touch	010401
01040102	គោកពង្រ	Kouk Pongro	010401
01040103	ថ្មគោល	Thma Koul	010401
01040104	ប្រពុត	Proput	010401
01040105	បន្ទាត់បោះ	Bantoat Baoh	010401
01040106	គោកទ្រាស	Kouk Treas	010401
01040107	ឈ្នួរ	Chhnuor	010401
01040108	សំរោងធំ	Samraong Thum	010401
01040109	ឫស្សីខាង	Ruessei Khang	010401
01040110	ឫស្សីកណ្ដាល	Ruessei Kandal	010401
01040111	រពាត់	Ropeatt	010401
01040112	គោកត្រាច	Kouk Trach	010401
01040202	រោលជ្រូក	Roul Chruk	010402
01040203	ប្រាសាទ	Prasat	010402
01040204	ក្រសាំងថ្មី	Krasang Thmei	010402
01040205	ប្រដាក	Pradak	010402
01040206	ជ្រាប់ថ្មី	Chroab Thmei	010402
01040207	ជ្រាប់ចាស់	Chroab Chas	010402
01040208	កក់	Kak	010402
01040209	គោកលុន	Kouk Lun	010402
01040210	ភ្នំជញ្ជាំង	Phnum Chonhcheang	010402
01040211	ចក្រី	Chakkrei	010402
01040301	ភ្នំលៀបកើត	Phnum Lieb Kaeut	010403
01040302	ភ្នំលៀបលិច	Phnum Lieb Lech	010403
01040303	ទ្រយោង	Troyoung	010403
01040304	ទ្រលោកជើង	Tro Louk Cheung	010403
01040305	ទ្រលោកលិច	Tro Louk Lech	010403
01040306	ទ្រលោកត្បូង	Tro Louk Tboung	010403
01040307	ឡោទេ	Laote	010403
01040308	រំដួល	Rumduol	010403
01040309	ព្រីងជួរ	Pring Chuor	010403
01040310	កន្ដ្រប់	Kantrab	010403
01040311	ត្នោត	Tnaot	010403
01040312	អន្លង់សា	Anlong Sa	010403
01040313	កណ្ដោល	Kandaol	010403
01040314	កំបោរ	Kambaor	010403
01040315	កាបៅ	Kabau	010403
01040316	កំពង់ក្រសាំង	Kampong Krasang	010403
01040401	ចារ	Char	010404
01040402	បត់ត្រង់	Bat Trang	010404
01040403	សំពៅលូន	Sampov Lun	010404
01040404	ផ្លូវលាវ	Phlov Leav	010404
01040405	តាអំ	Ta Am	010404
01040406	អំពិល	Ampil	010404
01040407	កណ្ដាល	Kandal	010404
01040408	ថ្មី	Thmei	010404
01040409	ឱម៉ាល់	Aomal	010404
01040410	ទម្លាប់	Tumloab	010404
01040411	កៀនបន្ទាយ	Kien Banteay	010404
04060106	ប៉ាហ៊ី	Pahi	040601
01040412	ប្រាសាទ	Prasat	010404
01040413	អន្លង់សា	Anlong Sa	010404
01040414	កំព្រាម	Kampream	010404
01040501	ប៉ោយក្ដឿង	Paoy Kdoeang	010405
01040502	ជើងវត្ដ	Cheung Voat	010405
01040503	កណ្ដាល	Kandal	010405
01040504	ប៉ុស្ដិចាស់	Post Chas	010405
01040505	ប៉ោយសំរោង	Paoy Samraong	010405
01040506	ប៉ោយព្រីង	Paoy Pring	010405
01040507	ប៉ោយតាប៉ែន	Paoy Ta Paen	010405
01040508	ស្រេះកើត	Sreh Kaeut	010405
01040509	ស្រេះលិច	Sreh Lech	010405
01040510	គោកស្រុក	Kouk Srok	010405
01040511	ស្រមោច	Sramaoch	010405
01040512	ពាមស្រេះ	Peam Sreh	010405
01040513	ដូនច្រែង	Doun Chraeng	010405
01040601	រហាល	Rohal	010406
01040602	សាលាឆេះ	Sala Chheh	010406
01040603	ចក	Chak	010406
01040604	ទេពកោសា	Tep Kaosa	010406
01040605	ស្នាយ	Snay	010406
01040606	អន្លង់ថ្ម	Anlong Thma	010406
01040607	ពពេល	Popel	010406
01040608	ប៉ោយស្វាយ	Paoy Svay	010406
01040609	ឫស្សី	Ruessei	010406
01040610	ព្រៃមាន់	Prey Moan	010406
01040611	ស្ទឹងកំបុត	Stueng Kambot	010406
01040701	បន្ទាត់បោះ	Bantoat Baoh	010407
01040702	ទានកាំលិច	Tean Kam Lech	010407
01040703	ទានកាំជើង	Tean Kam Cheung	010407
01040704	ទានកាំត្បូង	Tean Kam Tboung	010407
01040705	អូរ	Ou	010407
01040706	តាអ៊ុន	Ta Un	010407
01040801	ស្មាច់	Smach	010408
01040802	ប៉ោយចារ	Paoy Char	010408
01040803	តាខែក	Ta Khaek	010408
01040804	គោកកី	Kouk kei	010408
01040805	ទន្លាប់	Tonloab	010408
01040806	គោកទៀម	Kouk Tiem	010408
01040807	ចារលើ	Char Leu	010408
01040808	កន្ទួត	Kantuot	010408
01040809	ថ្មី	Thmei	010408
01040810	កណ្ដាល	Kandal	010408
01040811	ទឹកជោរ	Tuek Chour	010408
01040812	តាសៀវ	Ta Siev	010408
01040813	កំពង់ថ្កូវ	Kampong Thkov	010408
01040814	តាប៉ុន	Ta Pon	010408
01040815	ស្នាយល្អ	Snay L'a	010408
01040816	តាដែក	Ta Daek	010408
01040817	សំរោង	Samraong	010408
01040818	អន្លង់វិល	Anlong Vil	010408
01040901	ត្របែក	Trabaek	010409
01040902	កណ្ដាល	Kandal	010409
01040903	គោកធំ	Kouk Thum	010409
01040904	បុស្បូវ	Bos Sbov	010409
01040905	សូត្រមន្ដ	Soutr Mont	010409
01040906	ស្រះខ្ទំ	Srah Khtum	010409
01040907	តាបៅ	Tabau	010409
01040908	ក្បាលខ្ទីង	Kbal Khting	010409
01040909	ស្មាច់	Smach	010409
01040910	បឹងវែង	Boeng Veaeng	010409
01040911	បន្ទាត់បោះ	Bantoat Baoh	010409
01040912	ព្រីងកោង	Pring Kaong	010409
01040913	ខ្ចាស់	Khchas	010409
01040914	ខ្ញែរ	Khnhaer	010409
01040915	ឃូស្វាយ	Khu Svay	010409
01040916	ខ្វាវ	Khvav	010409
01040917	ត្បែង	Tbaeng	010409
01050101	បឹងសិលា	Boeng Seila	010501
01050102	តាជ្រឹង	Ta Chrueng	010501
01050103	តាផោក	Ta Phaok	010501
01050104	ប៉ោយវត្ដ	Paoy Voat	010501
01050105	ឈូក	Chhuk	010501
01050106	ជ្រៃ	Chrey	010501
01050201	យាងថ្មី	Yeang thmei	010502
01050202	ម៉ក់ហឺន	Mak Heun	010502
01050203	វាំងមួង	Veang Muong	010502
01050204	កូបកើត	Koub Kaeut	010502
01050205	ខៃដន	Khai Dan	010502
01050206	ណាកាឆាយ	Naka Chhay	010502
01050207	កូបលិច	Koub Lech	010502
01050208	កូបជើង	Koub Cheung	010502
01050209	អូរជ្រៅ	Ou Chrov	010502
01050210	សូរិយាថ្មី	Souriya Thmei	010502
01050211	កូនត្រី	Koun Trei	010502
01050301	កូបតូច	Koub Touch	010503
01050302	កោះចារ	Kaoh Char	010503
01050303	គុត្ដសត	Kuttaksat	010503
01050304	យាយអត	Yeay At	010503
01050501	បន្លិច	Banlech	010505
01050502	អ្នកតាឈរ	Neak Ta Chhor	010505
01050503	សំរោង	Samraong	010505
01050504	កំពង់រាប	Kampong Reab	010505
01050505	ថ្មី	Thmei	010505
01050506	ធ្មេញត្រី	Thmenh Trei	010505
01050507	បត់ត្រង់	Bat Trang	010505
01050508	អញ្ចាញ	Anhchanh	010505
01050509	វត្ដ	Voat	010505
01050510	កណ្ដាល	Kandal	010505
01050601	សូភីជើង	Souphi Cheung	010506
01050602	សូភីកណ្ដាល	Souphi Kandal	010506
01050603	សូភីត្បូង	Souphi Tboung	010506
01050604	គោកចក	Kouk Chak	010506
01050605	គោកព្រិច	Kouk Prich	010506
01050701	សឹង្ហលិច	Soengh Lech	010507
01050702	រកា	Roka	010507
01050703	អន្លង់ស្វាយ	Anlong Svay	010507
01050704	សឹង្ហត្បូង	Soengh Tboung	010507
01050705	ផ្គាំ	Phkoam	010507
01050706	ពង្រ	Pongro	010507
01050707	ត្នោត	Tnaot	010507
01050708	កណ្ដាល	Kandal	010507
01050709	រុន	Run	010507
01050901	បន្ទាយថ្មី	Banteay Thmei	010509
01050902	ជោគជ័យ	Chouk Chey	010509
01050903	អូរបីជាន់	Ou Beichoan	010509
01050904	ប្រាសាទ	Prasat	010509
01050905	ព្រៃចាន់	Prey Chan	010509
01050906	ព្រាវចាស់	Preav Chas	010509
01050907	សិលាខ្មែរ	Seila Khmer	010509
01050908	ស្នួលទ្រេត	Snuol Tret	010509
01050909	ថ្នល់បត់	Thnal Bat	010509
01050910	ទំនប់ដាច់	Tomnob Dach	010509
01050911	យាងដង្គំ	Yeang Dangkum	010509
01060201	កំពង់ស្វាយ	Kampong Svay	010602
01060202	កងវ៉ា	Kangva	010602
01060203	ភូមិ ២	Phum Pir	010602
01060204	ពង្រ	Pongro	010602
01060205	សូភី	Souphi	010602
01060206	តារាងបាល់	Tarang Bal	010602
01060207	កន្ទួត	Kantuot	010602
01060208	ខ្លាកូនចាស់	Kla Koun Chas	010602
01060209	ខ្លាកូនថ្មី	Kla Koun Thmey	010602
01060301	កោះពងសត្វ	Kaoh Pong Satv	010603
01060302	តាសុខ	Ta Sok	010603
01060303	ព្រះអង្គ	Preah Angk	010603
01060304	ស្នាយដង្គត់	Snay Dangkot	010603
01060305	អង្គាបុស្ប	Angkear Bos	010603
01060401	ម្កាក់	Mkak	010604
01060402	ក្បាលស្ពាន	Kbal Spean	010604
01060403	តាម៉ា	Ta Ma	010604
01060404	គោកលៀប	Kouk Lieb	010604
01060405	ឈូក	Chhuk	010604
01060406	ដូនឡី	Doun Lei	010604
01060407	បែកចាន	Baek Chan	010604
01060501	សែសិន	Saesen	010605
01060502	គោរដ្ឋាន	Kourothan	010605
01060503	រោងម៉ាស៊ីន	Roung Masin	010605
01060504	ព្រហូត	Prohut	010605
01060505	អូរអំបិល	Ou Ambel	010605
01060601	កន្ទួត	Kantuot	010606
01060602	កំព្រីង	Kampring	010606
01060603	ភ្នៀត	Phniet	010606
01060604	អ្នកតា	Neak Ta	010606
01060605	ភូមិថ្មី	Phum Thmei	010606
01060606	បង្រុះ	Bangruh	010606
01060607	សាលាក្រៅ	Sala Krau	010606
01060701	ចក	Chak	010607
01060702	ភូមិ ១	Phum Muoy	010607
01060703	ភូមិ ៣	Phum Bei	010607
01060704	ភូមិ ៤	Phum Buon	010607
01060705	ព្រៃឫស្សី	Prey Ruessei	010607
01060706	ព្រះពន្លា	Preah Ponlea	010607
01060707	ក្បាលស្ពាន	Kbal Spean	010607
01060801	គាប	Keab	010608
01060802	ទំនប់ជ្រៃ	Tumnob Chrey	010608
01060803	ទឹកថ្លា	Tuek Thla	010608
01060805	ភ្នំបាក់	Phnum Bak	010608
01060806	ដីឡូតិ៍	Dei Lou	010608
01060807	បាណយ	Banoy	010608
01070101	គោកសំរោង	Kouk Samraong	010701
01070102	ក្បាលទន្សោង	Kbal Tonsaong	010701
01070103	បន្ទាយឆ្មារជើង	Banteay Chhmar Cheung	010701
01070105	ក្បាលក្របី	Kbal Krabei	010701
01070106	បន្ទាយឆ្មារត្បូង	Banteay Chhmar Tboung	010701
01070107	បន្ទាយឆ្មារលិច	Banteay Chhmar Lech	010701
01070108	ថ្មដែកកេះ	Thma Daekkeh	010701
01070109	ធ្លក	Thlok	010701
01070110	គោកសំរោងកើត	Kouk Samraong Kaeut	010701
01070111	ស្រះជ្រៃ	Srah Chrey	010701
01070112	ដងរ៉ែក	Dang Reaek	010701
01070113	ប្រាសាទត្បែង	Prasat Tbaeng	010701
01070114	ព្រៃសង្ហា	Prey Sangha	010701
01070115	ត្រពាំងធ្លក	Trapeang Thlok	010701
01070201	គោកព្រេច	Kouk Prech	010702
01070202	ស្រែល្អ	Srae L'a	010702
01070203	គោករមៀត	Kouk Romiet	010702
01070204	ស្ដៅ	Sdau	010702
01070205	ថ្មី	Thmei	010702
01070206	តាឡី	Ta Lei	010702
01070207	សេរីកា	Sereika	010702
01070208	តាសុង	Ta Song	010702
01070209	ត្រពាំងសំរោង	Trapeang Samraong	010702
01070210	ថ្នល់បំបែក	Phlov Bambaek	010702
01070211	ថ្មឆ័ត្រ	Thma Chhatr	010702
01070212	វល្លិប្រេង	Voa Preng	010702
01070213	ប្រាំមីនា	Pram Minea	010702
01070214	សាមគ្គី	Sameakki	010702
01070215	បន្ទាយមានឬទ្ធិ	Banteay Mean Rit	010702
01070217	ស្ពាន	Spean	010702
01070218	កណ្ដោល	Kandaol	010702
01070219	ក្ដិបថ្ម	Kdeb Thma	010702
01070220	បឹងតាស្រី	Boeng Ta Srei	010702
01070221	បឹងសុក្រម	Boeng Sokram	010702
01070222	តាម៉ាំង	Ta Mang	010702
01070301	កាប់ចោរ	Kab Chaor	010703
01070302	គោកស្វាយ	Kouk Svay	010703
01070303	រលំជ្រៃ	Rolum Chrey	010703
01070304	ថ្មីខាងលិច	Thmei Khang Lech	010703
01070305	ថ្មីកណ្ដាល	Thmei Kandal	010703
01070306	ថ្មីខាងត្បូង	Thmei Khang Tboung	010703
01070307	ទទា	Totea	010703
01070401	ថ្មពួក	Thma Puok	010704
01070402	អ្នកតា	Neak Ta	010704
01070403	វត្ដចាស់	Voat Chas	010704
01070404	កសិណ	Kasen	010704
01070405	ស្វាយ	Svay	010704
01070406	ថ្នល់ដាច់	Thnal Dach	010704
01070407	អន្លង់ត្រាច	Anlong Trach	010704
01070501	ដឺ	Deu	010705
01070502	ស្ដៅ	Sdau	010705
01070503	ទ្រាស	Treas	010705
01070504	គោកកឋិន	Kouk Kakthen	010705
01070505	តាសៀវ	Ta Siev	010705
01070506	ជន្លាសដៃ	Chonloas Dai	010705
01070507	តាត្រៃ	Ta Trai	010705
01070508	ព្រះឈរ	Preah Chhor	010705
01070509	គោកខ្ពស់	Kouk Kpos	010705
01070601	អណ្ដូងខ្លុង	Andoung Khlong	010706
01070602	គំរូ	Kumru	010706
01070603	តាយឹង	Ta Yueng	010706
01070605	ឯកភាព	Aekakpheap	010706
01070606	ផ្សារថ្មី	Phsar Thmei	010706
01070607	ស្វាយជ្រុំ	Svay Chrum	010706
01070608	ព្រៃវែង	Prey Veaeng	010706
01080101	ផ្គាំ	Phkoam	010801
01080102	យាងវៀន	Yeang Vien	010801
01080103	យាង	Yeang	010801
01080104	អំពិល	Ampil	010801
01080105	អូរ	Ou	010801
01080106	ប្រាសាទវៀន	Prasat Vien	010801
01080107	តាដួល	Ta Duol	010801
01080108	ស្វាយស	Svay Sa	010801
01080109	ម៉ៅ	Mau	010801
01080110	ថ្មគោល	Thma Koul	010801
01080111	តាគល់	Ta Koal	010801
01080201	ភាសត្បូង	Pheas Tboung	010802
01080202	ភាសជើង	Pheas Cheung	010802
01080203	ជ្រុង	Chrung	010802
01080204	ផ្លាស់កង់	Phlas Kang	010802
01080205	គោកភ្លូ	Kouk Phlu	010802
01080206	កន្ទ្រង់	Kantrong	010802
01080301	ស្លក្រាម	Sla Kram	010803
01080302	កកោះ	Kakaoh	010803
01080303	កំណប់	Kamnab	010803
01080304	ទ័ពសៀម	Toap Siem	010803
01080305	ខ្លែងពណ៌ជើង	Khlaeng Poar Cheung	010803
01080306	ប្រាសាទ	Prasat	010803
01080307	គោកអំពិល	Kouk Ampil	010803
01080308	ខ្លែងពណ៌ត្បូង	Khlaeng Poar Tboung	010803
01080309	បឹងស្នោ	Boeng Snao	010803
01080310	ចក់ ពួក	Chak Puork	010803
01080401	គោកខ្វាវ	Kouk Khvav	010804
01080402	ពន្សាយជើង	Ponsay Cheung	010804
01080403	ក្លឹង	Kloeng	010804
01080404	បែកចានចាស់	Baek Chan Chas	010804
01080405	ពន្សាយត្បូង	Ponsay Tboung	010804
01080406	រកាថ្មី	Roka Thmei	010804
01080407	តាអុងលិច	Ta Ong Lech	010804
01080408	ស្លែង	Slaeng	010804
01080409	ថ្មី	Thmei	010804
01080410	ខ្វាវលិច	Khvav Lech	010804
01080411	សំរោង	Samraong	010804
01080412	ចំការគ	Chamkar Ko	010804
01080501	គោកតាឯក	Kouk Ta Aek	010805
01080502	អូរវែងជើង	Ou Veaeng Cheung	010805
01080503	តាបែន	Ta Baen	010805
01080504	គោករកា	Kouk Roka	010805
01080505	អូរវែងត្បូង	Ou Veaeng Tboung	010805
01080601	តាផូ	Ta Phou	010806
01080602	ពង្រ	Pongro	010806
01080603	តាស្រី	Ta Srei	010806
01080604	ព្រេចកី	Prech Kei	010806
01080605	គោកកី	Kouk Kei	010806
01080606	ឃ្មាស់	Khmoas	010806
01080607	ថ្មី	Thmei	010806
01080608	បារាយណ៍	Baray	010806
01080609	ផ្ចឹក	Phchoek	010806
01080610	ព្រេចត្បូង	Prech Tboung	010806
01080611	បន្ទាត់បោះ	Bantoat Baoh	010806
01080701	ពន្លៃថ្មី	Ponley Thmei	010807
01080702	ចែង	Chaeng	010807
01080703	ដូនណូយ	Doun Nouy	010807
01080704	ប្រីយ៍	Prei	010807
01080705	ពន្លៃចាស់	Ponley Chas	010807
01080706	ទ្រាស	Treas	010807
01080707	អំពិលព្រង់	Ampil Prong	010807
01080708	អូរកកោះ	Ou Kakaoh	010807
01080709	តាវឹក	Ta Voek	010807
01080801	បែកចានថ្មី	Baek Chan Thmei	010808
01080802	ខ្វាវកើត	Khvav Kaeut	010808
01080803	ស្ទឹង	Stueng	010808
01080804	តាអុងកើត	Ta Ong Kaeut	010808
01080805	ស្លែង	Slaeng	010808
01080806	រលួស	Roluos	010808
01080807	តាស្មន់	Ta Sman	010808
01090101	សង្កែ	Sangkae	010901
01090102	ភ្នំរូង	Pnum Roung	010901
01090103	ជ្រៃ	Chrey	010901
01090104	ល្វា	Lvea	010901
01090105	ចំបក់	Chambak	010901
01090201	ដូង	Doung	010902
01090202	វាលហាត់	Veal Hat	010902
01090203	កណ្ដាល	Kandal	010902
01090204	ក្បាលស្ពាន	Kbal Spean	010902
01090205	ត្រសេកជ្រុំ	Trasek Chrum	010902
01090206	ដំបូកវិល	Dambouk Vil	010902
01090207	វត្ដចាស់	Voat Chas	010902
01090208	ថ្មី	Thmei	010902
01090301	អូរសំព័រ	Ou Sampoar	010903
01090302	អូរស្អំ	Ou S'am	010903
01090303	ក្បាលទំនប់	Kbal Tumnob	010903
01090304	បន្ទាយទី២	Banteay Ti Pir	010903
01090401	អូរស្រឡៅ	Ou Sralau	010904
01090402	ភ្នំកៅបី	Phnum Kaubei	010904
01090403	កណ្ដោល	Kandaol	010904
01090404	ឈើទាល	Chheu Teal	010904
01090405	បឹងរាំង	Bueng Reang	010904
01090406	ស្វាយព្រៃ	Svay Prey	010904
01090407	ចាន់គីរី	Chan Kiri	010904
01090408	ថ្មី	Thmei	010904
01090501	ទួលពង្រ	Tuol Pongro	010905
01090502	កោះស្នួល	Kaoh Snuol	010905
01090503	ខ្លាងាប់	Khla Ngoab	010905
01090504	បន្ទាយទី១	Banteay Ti Muoy	010905
01090505	សន្ដិភាព	Santepheap	010905
01090506	អូរអំពិល	Ou Ampil	010905
01090507	រស្មីមានជ័យ	Reaksmei Meanchey	010905
01090508	អភិវឌ្ឍន៌	Akphivat	010905
01090509	ទួលប្រាសាទ	Toul Prasat	010905
01090510	ស្រឡៅជ្រុំ	Sralau Chrum	010905
01090511	បឹងឈូក	Boeng Chhouk	010905
01090512	អូរកេស	Ou Kes	010905
01090601	ចែងម៉ែង	Chaeng Maeng	010906
01090602	បល្ល័ង្គ	Ballangk	010906
01090603	ប៉ោយអង្គរ	Paoy Angkor	010906
01090604	ស្រះភ្លោះ	Srah Phluoh	010906
01090605	ខ្ជាយ	Kcheay	010906
01090606	តាគង់	Ta Kong	010906
01100101	និមិត្ដ ១	Nimitt Muoy	011001
01100102	និមិត្ដ ២	Nimitt Pir	011001
01100103	និមិត្ដ ៣	Nimitt Bei	011001
01100104	និមិត្ដ ៤	Nimitt Buon	011001
01100105	អូរជ្រៅ	Ou Chrov	011001
01100106	ដុងអារញ្ញ	Dong Aranh	011001
01100107	សូរិយា	Souriya	011001
01100108	និមិត្ដថ្មី	Nimitt Thmei	011001
01100110	ថ្មសិន	Thma Sen	011001
01100111	អន្លង់ស្វាយ	Anlong Svay	011001
01100112	កូនដំរី	Koun Damrei	011001
01100113	កូបធំ	Koub Thum	011001
01100114	រស្មីសាមគ្គី	Reaksmei Sameakki	011001
01100115	រស្មីសេរីភាព	Reaksmei Serei Pheap	011001
01100116	សុខសាន្ដ្ដ	Sokhsan	011001
01100201	ក្បាលស្ពាន១	Kbal Spean​ 1	011002
01100202	បាលិលេយ្យ១	Baliley 1	011002
01100209	ទួលប្រាសាទ	Tuol Prasat	011002
01100212	ក្បាលស្ពាន២	Kbal Spean 2	011002
01100213	ក្បាលកោះ	Kbal Koh	011002
01100214	សាមគ្គីមានជ័យ	Samaki Mean Chey	011002
01100215	ប៉ោយប៉ែត	Poay Pet	011002
01100216	ព្រៃព្រិច	Prey Prech	011002
01100218	បាលិលេយ្យ២	Baliley 2	011002
01100219	មិត្តភាព	Mittapheap	011002
01100220	ចាន់គីរី	Chan Kiri	011002
01100221	អូរជ្រៅ	Ou Chrov	011002
01100223	ទំនប់ក៥	Tumnob Kor 5	011002
01100301	ផ្សារកណ្តាល	Phsar Kandal	011003
01100302	គីឡូលេខបួន	Kilou Lekh Buon	011003
01100303	ប្រជាធម្មលិច	Prachear Thoam Lech	011003
01100304	ប្រជាធម្មកើត	Prachea Thorm Kaeut	011003
01100305	ទួលពង្រ	Tuol Pongro	011003
01100306	អូរឬស្សី	Ou Ruessei	011003
01100307	ព្រៃគុប	Prey Kub	011003
01100308	អូរនាង	Ou Neang	011003
01100309	អណ្ដូងថ្មមាស	Andoung Thma Meas	011003
01100310	ស្ទឹងបត់	Stueng Bat	011003
02010101	ថ្មី	Thmei	020101
02010102	ទួលធ្នង់	Tuol Thnong	020101
02010103	ស្វាយព្រៃ	Svay Prey	020101
02010104	ស្វាយបីដើម	Svay Bei Daeum	020101
02010105	កំពង់អំពិល	Kampong Ampil	020101
02010106	សសរពក	Sasar Pok	020101
02010107	វត្ដកន្ទឺ	Voat Kantueu	020101
02010201	ប៉ុស្ដិកន្ទឺ	Post Kantueu	020102
02010202	ចំការអូរ	Chamkar Ou	020102
02010203	បាណន់	Banan	020102
02010204	កំប៉ង់លិច	Kampang Lech	020102
02010205	កំប៉់ង់កើត	Kampang Kaeut	020102
02010206	ឆាយរំពាត់	Chhay Rumpoat	020102
02010207	ភ្នំគល់	Phnum Kol	020102
02010301	ទួលច្រនៀង	Tuol Chranieng	020103
02010302	កំពង់ចែង	Kampong Chaeng	020103
02010303	កញ្ច្រោង	Kanhchroung	020103
02010304	ក្រទ្បាពាស	Krala Peas	020103
02010305	បាយដំរាំ	Bay Damram	020103
02010306	តាស៊ង	Ta Song	020103
02010307	ស្ដៅ	Sdau	020103
02010308	ព្រៃទទឹង	Prey Totueng	020103
02010401	កំពង់ឆ្លង	Kampong Chhlang	020104
02010402	ឈើទាល	Chheu Teal	020104
02010403	កំពង់ស្រមរ	Kampong Srama	020104
02010404	ខ្នារ	Khnar	020104
02010405	ឥន្ទជិត	Enteak Chit	020104
02010406	បត់សាលា	Bat Sala	020104
02010407	បាយដំរាំ	Bay Damram	020104
02010408	ស្វាយប្រគាប	Svay Prakeab	020104
02010409	ឆកពោធិ៍៍	Chhak Pou	020104
02010410	អន្លង់តាម៉ី	Anlong Ta Mei	020104
02010411	ចំការស្វាយ	Chamkar Svay	020104
02010412	ថ្កូវ	Thkov	020104
02010413	បបុះ	Baboh	020104
02010414	ដូង	Doung	020104
02010415	អន្លក់កោង	Anlok Kaong	020104
02010501	រូង	Rung	020105
02010502	ចែង	Chaeng	020105
02010503	កំពង់គល់	Kampong Kol	020105
02010504	ធ្ង័រ	Thngoar	020105
02010505	បុះខ្នុរ	Boh Khnor	020105
02010506	ចង្ហូរស្វាយ	Changhour Svay	020105
02010507	ដូង	Doung	020105
02010601	ចែងក្ដារ	Chaeng Kdar	020106
02010602	កំប៉ូវ	Kampouv	020106
02010603	គោកអំពិល	Kouk Ampil	020106
02010604	ភ្នំសំពៅលិច	Phnum Sampov Lech	020106
02010605	ភ្នំសំពៅកើត	Phnum Sampov Kaeut	020106
02010606	សំណាញ់	Samnanh	020106
02010607	ក្ដោង	Kdaong	020106
02010608	ក្រពើជើង	Krapeu Cheung	020106
02010609	ក្រពើត្បូង	Krapeu Tboung	020106
02010610	ក្រពើកើត	Krapeu Kaeut	020106
02010701	សំរោង	Samraong	020107
02010702	គរ	Kor	020107
02010703	ស្នឹងលិច	Snoeng Lech	020107
02010704	ស្នឹងកើត	Snoeng Kaeut	020107
02010705	បឹងចែង	Boeng Chaeng	020107
02010706	បឹងប្រី	Boeng Prei	020107
02010707	ពាក់ស្បែក	Peak Sbaek	020107
02010708	ព្រះស្រែ	Preah Srae	020107
02010709	រំជៃ	Rumchey	020107
02010710	សំបួរមាស	Sambuor Meas	020107
02010711	បឹងក្រសាល	Boeng Krasal	020107
02010801	ប៉ោយស្វាយ	Paoy Svay	020108
02010802	តាគ្រាម	Ta Kream	020108
02010803	ថ្មី	Thmei	020108
02010804	អូរពងមាន់	Ou Pong Moan	020108
02010805	តាង៉ែន	Ta Ngaen	020108
02010806	ព្រៃផ្ដៅ	Prey Phdau	020108
02010807	អូរតាញា	Ou Ta Nhea	020108
02010808	ដង្គត់ធ្នង់	Dangkot Thnong	020108
02010809	អណ្ដូងនាង	Andoung Neang	020108
02010810	អន្លង់ស្វាយ	Anlong Svay	020108
02010811	ស្លាបប៉ាង	Slab Pang	020108
02020101	ថ្មគោលត្បូង	Thma Koul Tboung	020201
02020102	ប៉ោយយង់	Paoy Yong	020201
02020103	កសិកម្ម	Kaksekam	020201
02020104	ប៉ោយសំរោង	Paoy Samraong	020201
02020105	គោកក្ដួច	Kouk Kduoch	020201
02020106	អង់ត្បូង	Ang Tboung	020201
02020107	ទំពូងត្បូង	Tumpung Tboung	020201
02020201	ថ្មគោលជើង	Thma Koul Cheung	020202
02020202	គោកត្រប់	Kouk Trab	020202
02020203	ទំនាប	Tumneab	020202
02020204	តាសី	Ta Sei	020202
02020205	ជ្រោយម្ទេស	Chrouy Mtes	020202
02020206	ក្រសាំង	Krasang	020202
02020207	សំរោង	Samraong	020202
02020208	ថ្មី	Thmei	020202
02020209	អង់ជើង	Ang Cheung	020202
02020210	ទំពូងជើង	Tumpung Cheung	020202
02020301	អូរតាគី	Ou Ta Ki	020203
02020302	ពពាលខែ	Popeal Khae	020203
02020303	វាលទ្រា	Veal Trea	020203
02020304	ត្រស់	Tras	020203
02020305	ព្រៃទទឹង	Prey Totueng	020203
02020306	ព្រៃដាច់	Prey Dach	020203
02020307	ត្រាង	Trang	020203
02020308	កកោះ	Kakaoh	020203
02020401	ជ្រៃថ្មី	Chrey Thmei	020204
02020402	ជ្រៃ	Chrey	020204
02020403	កគោ	Ka Kou	020204
02020404	ស្វាយជ្រុំ	Svay Chrum	020204
02020405	ក្បាលខ្មោច	Kbal Khmaoch	020204
02020406	ព្រៃទទឹង	Prey Totueng	020204
02020407	ហៃសាន	Hai San	020204
02020408	ពពាលខែ	Popeal Khae	020204
02020409	អន្លង់រុន	Anlong Run	020204
02020410	គ្រួស	Kruos	020204
02020501	ចារ	Char	020205
02020502	ស្លាស្លាក់	Sla Slak	020205
02020503	ចបកាប់	Chab Kab	020205
02020504	សូភី	Souphi	020205
02020505	គ្រួស	Kruos	020205
02020601	ជ្រោយស្ដៅ	Chrouy Sdau	020206
02020602	និគមក្រៅ	Nikom Krau	020206
02020603	និគមក្នុង	Nikom Knong	020206
02020604	និគមកណ្តាល	Nikom Kandal	020206
02020701	បឹងព្រីង	Boeng Pring	020207
02020702	អូរញរ	Ou Nhor	020207
02020703	ស្នួលកោង	Snuol Kaong	020207
02020704	ប៉ោយតាសេក	Paoy Ta Sek	020207
02020801	កៀនកែស ១	Kien Kaes Muoy	020208
02020802	កៀនកែស ២	Kien Kaes Pir	020208
02020803	តាមាឃ	Ta Meakh	020208
02020804	ច្រនៀង	Chranieng	020208
02020805	គោកឃ្មុំ	Kouk Khmum	020208
02020806	កណ្ដាលត្បូង	Kandal Tboung	020208
02020807	កណ្ដាលជើង	Kandal Cheung	020208
02020808	ឆ្កែកូន	Chhkae Koun	020208
02020901	បន្សាយត្រែង	Bansay Traeng	020209
02020902	តាកយ	Ta Kay	020209
02020903	ថ្មី	Thmei	020209
02020904	ព្រៃលាវ	Prey Leav	020209
02020905	កោងកាង	Kaong Kang	020209
02020906	ធ្មា	Thmea	020209
02020907	ស្ពាន	Spean	020209
02020908	ទួលតាសុខ	Tuol Ta Sokh	020209
02021001	បល្ល័ង្កក្រោម	Ballangk Kraom	020210
02021002	ប្រគាប	Prakeab	020210
02021003	គោកខ្ពស់	Kouk Khpos	020210
02021004	ប៉ោយរំជៃ	Paoy Rumchey	020210
02021005	ព្រះពន្លា	Preah Ponlea	020210
02021006	រូងជ្រៃ	Rung Chrey	020210
02021007	ទួល	Tuol	020210
02030101	អូរតាគាំ ១	O Ta Kam I	020301
02030102	អូរតាគាំ ២	O Ta Kam II	020301
02030103	អូរតាគាំ ៣	O Ta Kam III	020301
02030104	ទួលតាឯក	Tuol Ta Ek	020301
02030105	ដង្កោទាប	Dangkor Teab	020301
02030201	ព្រែកព្រះស្ដេច	Prek Preah Sdach	020302
02030202	ព្រែកតាតន់	Prek Ta Tan	020302
02030203	១៣ មករា	13 Meakkakra	020302
02030204	អូរខ្ជាយ	O Khcheay	020302
02030205	ទ្បឥដ្ឋ	Lor Ith	020302
02030206	នំក្រៀប	Nom Kriab	020302
02030207	បែកចានថ្មី	Bek Chan Thmey	020302
02030208	ចំការឫស្សី	Cham kaRuessey	020302
02030301	រំចេក ១	Rumchek 1	020303
02030302	រំចេក ២	Rumchek 2	020303
02030303	រំចេក ៣	Rumchek 3	020303
02030304	រំចេក ៤	Rumchek 4	020303
02030305	រំចេក ៥	Rumchek 5	020303
02030306	សូភី ១	Souphy 1	020303
02030307	សូភី ២	Souphy 2	020303
02030308	រតនៈ	Rottanak	020303
02030401	ចំការសំរោង១	Chomkar Somraong 1	020304
02030402	ចំការសំរោង២	Chomkar Somraong 2	020304
02030403	វត្ដលៀប	Vat Leeb	020304
02030404	វត្ដរំដួល	Vat Romdol	020304
02030405	ផ្កាស្លា	Phkar Sla	020304
02030501	ស្លាកែត	Sla Ket	020305
02030502	ដាំស្ពៃ	Dam Spey	020305
02030503	ជ្រៃកោង	Chrey Kaong	020305
02030601	ចុងព្រែក	Chong Preak	020306
02030602	ក្ដុល	Kdol	020306
02030603	អូរតានប់	Ou Ta Nob	020306
02030604	តាព្រួច	Ta Pruoch	020306
02030605	តាកុយ	Ta Koy	020306
02030606	កន្ទ្ទួត	Kantuot	020306
02030607	ថ្កូវ	Thkov	020306
02030701	អូរម៉ាល់	O Mal	020307
02030702	ដាក់សសរ	Dak Sasar	020307
02030703	សាលាបាទ្បាត់	Sala Balat	020307
02030704	ព្រៃដាច់	Prey Dach	020307
02030705	គោកពន្លៃ	Kouk Ponley	020307
02030706	វត្ដរកា	Wath Roka	020307
02030707	កូនសេក	Koun Sek	020307
02030708	អណ្ដូងព្រីង	Andoung Pring	020307
02030709	បឹងរាំង	Boeng Reing	020307
02030710	ព្រៃរកា	Prey Roka	020307
02030801	វត្ដគរ	Wat Kor	020308
02030802	ច្រាបក្រសាំង	Chrap Krasaing	020308
02030803	បល្ល័ង្គ	Balaingk	020308
02030804	ខ្សាច់ពោយ	Khsach Poy	020308
02030805	ដំណាក់ហ្លួង	Damnak Luong	020308
02030806	កំពង់សីមា	Kampong Seima	020308
02030901	អូរចារ	Ou Char	020309
02030902	ព្រៃកូនសេក	Prey Koun Sek	020309
02030903	កាប់គោថ្មី	Kab Kou Thmei	020309
02030904	អណ្ដូងចេញ	Andoung Chenh	020309
02030905	អញ្ចាញ	Anhchanh	020309
02030906	អង់	Ang	020309
02031001	ព្រែកមហាទេព	Prek MohaTep	020310
02031002	កំពង់ក្របី	Kampong Krabei	020310
02031003	២០ ឧសភា	Maphey  Osakphea	020310
02031004	កម្មករ	Kammeakor	020310
02040101	បវេល ១	Bavel Muoy	020401
02040102	បវេល ២	Bavel Pir	020401
02040103	ទំនប់ទឹក	Tumnob Tuek	020401
02040104	ដាច់ព្រ័ត្រ	Dach Proat	020401
02040105	សង្កែវារ	Sangkae Vear	020401
02040106	ពាម	Peam	020401
02040107	កំពង់ព្នៅ	Kampong Phnov	020401
02040108	ស្ទឹងដាច់	Stueng Dach	020401
02040109	ស្ពានកណ្ដោល	Spean Kandaol	020401
02040110	សាំងរាំង	Sang Reang	020401
02040111	ស្វាយជ្រុំ	Svay Chrum	020401
02040112	ដូនអាវ	Doun av	020401
02040113	ព្រៃទទឹង ១	Prey Totueng Muoy	020401
02040114	ព្រៃទទឺង ២	Prey Totueng Pir	020401
02040115	គោក	Kouk	020401
02040116	ស្លខ្លាញ់	Sla Khlanh	020401
02040117	កំពង់ឆ្នាំង ១	Kampong Chhnang Muoy	020401
02040118	កំពង់ឆ្នាំង ២	Kampong Chhnang Pir	020401
02040119	សាមគ្គី	Sameakki	020401
02040201	ព្រៃសង្ហា	Prey Sangha	020402
02040202	កោះរាម	Kaoh Ream	020402
02040203	រូងអំពិល	Rung Ampil	020402
02040204	បល្ល័ង្កលើ	Ballangk Leu	020402
02040205	ស្វាយស	Svay Sa	020402
02040206	ខ្នាចរមាស	Khnach Romeas	020402
02040207	បល្ល័ង្កមានជ័យ	Ballangk Mean Chey	020402
02040208	ជ្រោយស្នា	Chrouy Sna	020402
02040301	ល្វា	Lvea	020403
02040302	ដូនញ៉ែម	Doun Nhaem	020403
02040303	ចំការ	Chamkar	020403
02040304	ដង្កោ	Dangkao	020403
02040305	រាមសេនា	Ream Sena	020403
02040306	ដូនអោក	Doun Aok	020403
02040307	ពីងពង់	Ping Pong	020403
02040308	ស្វាយព្រៃ	Svay Prey	020403
02040309	បឹងសំរោង	Boeng Samraong	020403
02040310	ក្បាលស្ពាន	Kbal Spean	020403
02040311	ល្វាចាស់	Lvea Chas	020403
02040312	តានី	Ta Ni	020403
02040401	តាហ៊ី	Ta Hi	020404
02040402	ពោធិ៍	Pou	020404
02040403	តាម៉ាត	Ta Mat	020404
02040404	មក្លឿ	Makkloea	020404
02040405	ព្រៃខ្ពស់	Prey Khpos	020404
02040406	ស្រណាល	Sranal	020404
02040407	ដង្កោពេន	Dangkao Pen	020404
02040408	ក្បាលថ្នល់	Kbal Thnal	020404
02040409	បឹងជំនាង	Boeng Chumnieng	020404
02040410	ក្បាលអាង	Kbal Ang	020404
02040501	ដង្កោក្រម៉ាង	Dangkao Kramang	020405
02040502	សៀម	Siem	020405
02040503	អំពិល	Ampil	020405
02040504	ស្ថាពរ1	Sthapor Muoy	020405
02040505	តាខៀវ	Ta Khiev	020405
02040506	បួរុន	Buo Run	020405
02040507	ដូង	Doung	020405
02040508	ស្ថាពរ២	Sthapor Pir	020405
02040509	បឹងសង្កែ	Boeng Sangkae	020405
02040510	បួជុំ	Bu Chum	020405
02040511	ថ្មី	Thmey	020405
02040512	បឹងអារ័ក្ស	Boeung Ahrak	020405
02040513	កូប	Koub	020405
02040514	បឹងស្នួល	Boeung Snul	020405
02040515	បឹងពពូល	Boeung Popul	020405
02040601	សួនស្លា	Suon Sla	020406
02040602	ក្ដុលក្រោម	Kdol Kraom	020406
02040603	សាន	San	020406
02040604	ពាម	Peam	020406
02040605	កណ្ដាល	Kandal	020406
02040606	បួ	Buo	020406
02040607	ថ្មី	Thmei	020406
02040608	ទួលក្រសាំង	Tuol Krasang	020406
02040609	ក្ដុលលើ	Kdol Leu	020406
02040610	តាហែន	Ta Haen	020406
02040612	អន្លង់រៃ	Anlong Rey	020406
02040614	បឹងអន្លក់	Boeng Anlok	020406
02040618	ដំណាក់់ដង្កោ	Damnak Dangkao	020406
02040623	ស្រះទឹក	Srah Tuek	020406
02040626	តាគត់	Ta Kot	020406
02040701	ត្រពាំងក្បាលស្វា	Trapeang Kbal Sva	020407
02040702	ប្របហឹប	Prab Hoeb	020407
02040703	អូរដូនពៅ	Ou Doun Pov	020407
02040704	ឃ្លាំង	Khleang	020407
02040705	ច្រាំងបាក់	Chrang Bak	020407
02040706	អន្លង់រាំង	Anlong Reang	020407
02040707	បឹងសង្កែ	Boeng Sangkae	020407
02040708	ទំនប់តាកួន	Tumnob Ta Kuon	020407
02040709	ទួលស្នួល	Tuol Snuol	020407
02040710	ព្រៃធំ	Prey Thum	020407
02040711	កំពង់ម្កាក់	Kampong Mkak	020407
02040712	បួសង្គ្រាជ	Buo Sangkreach	020407
02040713	ព្រៃព្រាល	Prey Preal	020407
02040801	ក្រពើសែសិប	Krapeu Saeseb	020408
02040802	បឹងធុង	Boeung Thung	020408
02040803	សំណាងព្រះស្រី	Samnang Pras Srey	020408
02040804	យុត្តិធម៌	Yut Te Thhor	020408
02040805	បឹងក្រឡ	Boeung Krola	020408
02040806	អូរឫស្សី	Oureusey	020408
02040807	បឹងប្រាំ	Boeng Pram	020408
02040808	ជ័យជំនះ	Chey Chumnas	020408
02050101	ព្រែកតាច្រែង	Preaek Ta Chraeng	020501
02050102	ព្រែកក្រូច	Preaek Krouch	020501
02050103	ស្វាយជ្រុំ	Svay Chrum	020501
02050104	ព្រែកនរិន្ទ	Preaek Norint	020501
02050105	ស្ដី	Sdei	020501
02050106	រហាលសួង	Rohal Suong	020501
02050107	ដួងមា	Duong Mea	020501
02050108	រាជដូនកែវ	Reach Doun Kaev	020501
02050109	អន្សងសក	Ansang Sak	020501
02050110	ព្រែកត្រប់	Preaek Trab	020501
02050201	សំរោងក្នុង	Samraong Knong	020502
02050202	កំពង់សំបួរ	Kampong Sambuor	020502
02050203	សំរោងស្នោ	Samraong Snao	020502
02050204	សំរោងអូរទ្រា	Samraong Ou Trea	020502
02050205	សំរោងតាកុក	Samraong Ta Kok	020502
02050301	ព្រែកស្នោ	Preaek Snao	020503
02050302	ព្រែកខ្ពប	Preaek Khpob	020503
02050303	ស្នាពីមុខ	Sna Pi Mukh	020503
02050304	ខ្វិត	Khvet	020503
02050305	អូរកំបុត	Ou Kambot	020503
02050401	ព្រែកហ្លួង	Preaek Luong	020504
02050402	ស្ដីលើ	Sdei Leu	020504
02050403	ស្ដីក្រោម	Sdei Kraom	020504
02050404	រហាលសួង	Rohal Suong	020504
02050405	បាក់អំរែក	Bak Amraek	020504
02050406	ដូនឥន្ទ	Doun Ent	020504
02050407	បាក់រទេះ	Bak Roteh	020504
02050501	ដូនទាវ	Doun Teav	020505
02050502	សួសអី	Suos Ei	020505
02050503	ពាមឯក	Peam Aek	020505
02050504	គង់ទុំ	Kong Tum	020505
02050505	ករហាល	Ka Rohal	020505
02050506	ព្រែកឆ្ដោរ	Preaek Chdaor	020505
02050507	តាគម	Ta Kom	020505
02050508	គោកដូង	Kouk Doung	020505
02050601	ព្រៃចាស់	Prey Chas	020506
02050602	ពាមសីមា	Peam Seima	020506
02050603	អន្លង់សណ្ដាន់	Anlong Sandan	020506
02050604	កោះជីវាំង	Kaoh Chiveang	020506
02050605	បាក់ព្រា	Bak Prea	020506
02050701	ថ្វាង	Thvang	020507
02050702	កំពង់ប្រហុក	Kampong Prahok	020507
02050703	អន្លង់តាអួរ	Anlong Ta Uor	020507
02050704	ព្រែកទាល់	Preaek Toal	020507
02050705	ក្បាលតោល	Kbal Taol	020507
02060101	ប៉ែន	Paen	020601
02060102	អូរក្របៅ	Ou Krabau	020601
02060103	កោះចារ	Kaoh Char	020601
02060104	ឫស្សី ១	Ruessei Muoy	020601
02060105	រលួស	Roluos	020601
02060106	ឫស្សី ២	Ruessei Pir	020601
02060107	កន្សៃបន្ទាយ	Kansai Banteay	020601
02060108	រ៉ា	Ra	020601
02060109	ដើមដូង	Daeum Doung	020601
02060110	មោង	Moung	020601
02060111	ប្រទ្បាយ	Pralay	020601
02060112	តាតុក ១	Ta Tok Muoy	020601
02060113	តាតុក ២	Ta Tok Pir	020601
02060114	ក្បាលមូស	Kbal Mus	020601
02060116	បោះពួយ	Baoh Puoy	020601
02060201	រុន	Run	020602
02060202	រកាឈ្មោល	Roka Chhmoul	020602
02060203	អន្លង់ស្ដៅ	Anlong Sdau	020602
02060204	ពោធិ៍ ១	Pou Muoy	020602
02060205	ពោធិ៍ ២	Pou Pir	020602
02060206	គារ ១	Kear Muoy	020602
02060207	គារ ២	Kear Pir	020602
02060208	គារ ៣	Kear Bei	020602
02060209	អូរគ្រៀត	Ou Kriet	020602
02060210	រាមគន់	Ream Kon	020602
02060211	តាណាក	Ta Nak	020602
02060212	កោះថ្កូវ	Kaoh Thkov	020602
02060301	គរ	Kor	020603
02060302	ចាមរអា	Cham Ro'a	020603
02060303	ផ្លូវបំបែក	Phlov Bambaek	020603
02060304	រំចេក	Rumchek	020603
02060305	ទួលធ្នង់	Tuol Thnong	020603
02060306	កាទ្បោមភ្លុក	Kalaom Phluk	020603
02060307	ស្រម៉មាស	Srama Meas	020603
02060308	ព្រៃស្វាយ	Prey Svay	020603
02060309	ព្រៃព្រាល	Prey Preal	020603
02060401	អ្នកតាទ្វារ	Neak Ta Tvear	020604
02060402	យឺនមាន	Yeun Mean	020604
02060403	ទួលស្នួល	Tuol Snuol	020604
02060404	ជ្រៃរុន	Chrey Run	020604
02060405	ទួលរកា	Tuol Roka	020604
02060406	និគមក្រោម	Nikom Kraom	020604
02060407	ស្រះជីនាង	Srah Chineang	020604
02060408	ពេជចង្វា	Pech Changva	020604
02060409	អំពិលឈូង	Ampil Chhung	020604
02060410	ថ្នល់បត់	Thnal Bat	020604
02060411	បឹងប្រិយ៍មានជ័យ	Boeng Prei Mean Chey	020604
02060501	ដូនទ្រី	Doun Tri	020605
02060502	អង្គ្រង	Angkrong	020605
02060503	ទួលតាថុន	Tuol Ta Thon	020605
02060504	ម្រះព្រៅ	Mreah Prov	020605
02060505	ជ្រៃ ១	Chrey Muoy	020605
02060506	ជ្រៃ ២	Chrey Pir	020605
02060507	ជ្រៃជើង	Chrey Cheung	020605
02060508	ចុងសំណាយ	Chong Samnay	020605
02060601	ម៉ាណោក	Ma Naok	020606
02060602	សួស្ដី	Suosdei	020606
02060603	ស្ដីស្ទឹង	Sdei Stueng	020606
02060604	ស្ទឹងថ្មី	Stueng Thmei	020606
02060605	វាល	Veal	020606
02060606	វត្ដចាស់	Voat Chas	020606
02060607	ចុងប្រឡាយ	Chong Pralay	020606
02060608	ប្រឡាយស្ដៅ	Pralay Sdau	020606
02060609	ត្រស់	Tras	020606
02060701	ទួលព្រុំ ១	Tuol Prum Muoy	020607
02060702	ទួលព្រុំ ២	Tuol Prum Pir	020607
02060703	ចកតូច	Chak Touch	020607
02060704	ចកធំ	Chak Thum	020607
02060705	កកោះ	Kakaoh	020607
02060706	ស្រែអូរ	Srae Ou	020607
02060707	ផ្អៀង	Ph'ieng	020607
02060708	រំចេក	Rumchek	020607
02060801	កូនខ្លុង	Koun Khlong	020608
02060802	ដុបក្រសាំង	Dob Krasang	020608
02060803	ថ្មី	Thmei	020608
02060804	ព្រៃតូច	Prey Touch	020608
02060805	ព្រាននិល	Prean Nil	020608
02060806	ស្ទឹងចក	Stueng Chak	020608
02060807	បឹងព្រីង	Boeng Pring	020608
02110209	អូរថ្មី	Ou Thmey	021102
02060808	ព្រៃដំរី	Prey Damrei	020608
02060901	បឹងបី	Boeng Bei	020609
02060902	គួយជីកដី	Kuoy Chik Dei	020609
02060903	ព្រែកអាំ	Preaek Am	020609
02060904	កូនក្អែក ១	Koun K'aek Muoy	020609
02060905	កូនក្អែក ២	Koun K'aek Pir	020609
02060906	របស់មង្គល	Robas Mongkol	020609
02060907	អន្លង់កូប	Anlong Koub	020609
02060908	ព្រៃព្រុំ ១	Prey Prum Muoy	020609
02060909	ព្រៃព្រុំ ២	Prey Prum Pir	020609
02060910	ព្រះធាតុ	Preah Theat	020609
02060911	អន្លង់តាម៉ុក	Anlong Ta Mok	020609
02060912	អន្លង់ត្រាច	Anlong Trach	020609
02070101	បាណង់	Banang	020701
02070102	ស្ដៅ	Sdau	020701
02070103	ចំការល្មុត	Chamkar Lmut	020701
02070104	បឹងអំពិល	Boeng Ampil	020701
02070105	ដង្គត់	Dangkot	020701
02070106	ដូនមាយ	Doun Meay	020701
02070107	បរិបូរណ៌	Baribour	020701
02070113	គោកជ័រ	Kouk Choar	020701
02070201	អណ្ដើកហែប	Andaeuk Haeb	020702
02070202	ស្វាយជួរ	Svay Chuor	020702
02070203	ថ្មព្រូស	Thma Prous	020702
02070204	សេរីវ័ន្ដ	Serei Voan	020702
02070205	ព្រៃអំពរ	Prey Ampor	020702
02070206	កណ្ដាលស្ទឹង	Kandal Stueng	020702
02070207	ថ្វាក	Thvak	020702
02070301	ផ្លូវមាស	Phlov Meas	020703
02070302	សេកសក	Sek Sak	020703
02070303	ទឹកសាប	Tuek Sab	020703
02070304	ជីប៉ាង	Chi Pang	020703
02070305	អូរត្រែង	Ou Traeng	020703
02070306	អូរដា	Ou Da	020703
02070307	អូរល្មូន	Ou Lmun	020703
02070401	គីឡូ	Kilou	020704
02070402	ភ្ជាវ	Phcheav	020704
02070403	ជាមន្ដ្រី	Chea Montrei	020704
02070404	ជីសាង	Chi Sang	020704
02070405	គីឡូ ៣៨	Kilou Samprambei	020704
02070406	ស្វាយស	Svay Sa	020704
02070407	តាគ្រក់	Ta Krok	020704
02070409	ប៊ូរុន	Bu Run	020704
02070501	រស្មីសង្ហា	Reaksmei Sangha	020705
02070502	នាងលេម	Neang Lem	020705
02070503	អណ្ដើកដប់មួយ	Andaeuk Dobmuoy	020705
02070504	ពេជ្រចង្វា	Pech Changva	020705
02070505	បាដាកត្បូង	Badak Tboung	020705
02070506	បាដាកជើង	Badak Cheung	020705
02070507	អូរដៃខ្លា	Ou Dai Khla	020705
02070508	អូរឃ្មុំ	Ou Khmum	020705
02080101	ច្រាបវាល	Chrab Veal	020801
02080102	បេង	Beng	020801
02080103	អន្លង់វិល	Anlong Vil	020801
02080104	អូរមុនី ១	Ou Muni Muoy	020801
02080105	អូរមុនី ២	Ou Muni Pir	020801
02080106	ជំនីក	Chumnik	020801
02080107	ពុកឆ្មា	Puk Chhma	020801
02080108	ស្ពង់	Spong	020801
02080109	ស្វាយកង់	Svay Kang	020801
02080110	ដំបូកបុណ្យ	Dambouk Bon	020801
02080201	នរា ១	Norea Muoy	020802
02080202	នរា ២	Norea Pir	020802
02080203	បាឡាត់	Balat	020802
02080204	តាកុក	Ta Kok	020802
02080301	បឹងទឹម	Boeng Tuem	020803
02080302	ស្វាយស	Svay Sa	020803
02080303	សម្ដេច	Samdach	020803
02080304	បាសែត	Basaet	020803
02080305	តាប៉ុន	Ta Pon	020803
02080402	ពោធិ៍បាត់ដំបង	Pou Batdambang	020804
02080403	អំបែងថ្ងែ	Ambaeng Thngae	020804
02080404	រកា	Roka	020804
02080405	តាហែន ១	Ta Haen Muoy	020804
02080406	តាហែន ២	Ta Haen Pir	020804
02080407	ឈូងត្រដក់	Choung Trodok	020804
02080501	ព្រៃចែក	Prey Chaek	020805
02080502	បញ្ញា	Panhnha	020805
02080503	ក្រឡាញ់	Kralanh	020805
02080504	កំពង់ព្រះ	Kampong Preah	020805
02080505	អណ្ដូងត្រាច	Andoung Trach	020805
02080506	ស្រះកែវ	Srah Kaev	020805
02080601	សំបុកអក	Sambok Ak	020806
02080602	សាលាត្រាវ	Sala Trav	020806
02080603	កាច់រទេះ	Kach Roteh	020806
02080604	ថ្មី	Thmei	020806
02080605	អូសទូក	Os Tuk	020806
02080606	ក្បាលថ្នល់	Kbal Thnal	020806
02080701	ទួលស្នួល	Tuol Snuol	020807
02080702	វត្ដកណ្ដាល	Voat Kandal	020807
02080703	រាំងកេសី	Reang Kesei	020807
02080704	រាំងក្រោល	Reang Kraol	020807
02080705	ព្រៃស្វាយ	Prey Svay	020807
02080706	ស្វាយជាតិ	Svay Cheat	020807
02080707	បឹងវែង	Boeng Veaeng	020807
02080708	ដំណាក់ដង្កោ	Damnak Dangkao	020807
02080709	កកោះកំបុត	Kakaoh Kambot	020807
02080801	វត្ដតាមិម	Vaot Ta Muem	020808
02080802	បោះពោធិ៍	Baoh Pou	020808
02080803	អូរខ្ជាយ	Ou Khcheay	020808
02080804	អូរស្រឡៅ	Ou Sralau	020808
02080805	វត្ដចែង	Voat Chaeng	020808
02080806	សំរោងកោង	Samraong Kaong	020808
02080901	អូរដំបង	Ou Dambang	020809
02080902	ស្វាយជ្រុំ	Svay Chrum	020809
02080903	កំពង់ម្ដោក	Kampong Mdaok	020809
02080904	ស្វាយធំ	Svay Thum	020809
02080905	ដំបូកខ្ពស់	Dambouk Khpos	020809
02080906	ទួលល្វៀង	Tuol Lvieng	020809
02081001	កំពង់អំពិល	Kampong pil	020810
02081002	កំពង់ឆ្លង	Kampong Chlang	020810
02081003	អូរស្រឡៅ	Ou Sralau	020810
02081004	អូរខ្ជាយ	Ou Khcheay	020810
02081005	ស្លក្រាម	Sla Kram	020810
02081006	អន្លង់ល្វា	Anlong Lvea	020810
02090101	ពាមតា	Peam Ta	020901
02090102	អូរត្រែង	Ou Traeng	020901
02090103	វាលរលឹម	Veal Roluem	020901
02090104	តាតោក	Ta Taok	020901
02090105	អូរននោង	Ou Nonoung	020901
02090106	ពាម	Peam	020901
02090107	អូរតាទៀក	Ou Tatiek	020901
02090108	អូរក្រូច	Ou Krouch	020901
02090109	ភ្នំរ៉ៃ	Phnum Rai	020901
02090201	ស្វាយជ្រុំ	Svay Chrum	020902
02090202	កំពង់ល្ពៅ	Kampong Lpov	020902
02090203	កណ្ដាល	Kandal	020902
02090204	អូរដើមចេក	Ou Daeum Chek	020902
02090205	ព្រៃធំ	Prey Thum	020902
02090206	ស្ទឹងតូច	Stueng Touch	020902
02090207	អូរជាំលើ	Ou Choam Leu	020902
02090208	អូរជាំកណ្ដាល	Ou Choam Kandal	020902
02090209	អូរជាំក្រោម	Ou Choam Kraom	020902
02090301	អូរសំរិលលើ	Ou Samril Leu	020903
02090302	អូរសំរិលក្រោម	Ou Samril Kraom	020903
02090303	អូររំចេកលើ	Ou Rumchek Leu	020903
02090304	អូររំចេកក្រោម	Ou Rumchek Kraom	020903
02090305	ចម្លងរមាំងលើ	Chamlang Romeang Leu	020903
02090306	ចម្លងរមាំងក្រោម	Chamlang Romeang Kraom	020903
02090401	ស៊ុង១	Sung Muoy	020904
02090402	ស៊ុង ២	Sung Pir	020904
02090403	កណ្ដាល	Kandal	020904
02090404	ស្រែរាជ	Srae Reach	020904
02090405	ចំការចេក	Chamkar Chek	020904
02090406	កញ្ចាំង	Kanhchang	020904
02090501	ស្រែអណ្ដូង	Srae Andoung	020905
02090502	ឆករកា	Chhak Roka	020905
02090503	សំឡូត	Samlout	020905
02090504	កន្ទួត	Kantuot	020905
02090505	អូរច្រាប	Ou Chrab	020905
02090506	បឹងរុន	Boeng Run	020905
02090601	កំពង់់ទូក	Kampong Touk	020906
02090602	កំចាត់	Kamchat	020906
02090603	ស្រែស្ដៅ	Srae Sdau	020906
02090604	អំពឹប	Ampuep	020906
02090605	ស្រែជីពៅ	Srae Chipov	020906
02090606	តានន	Ta Non	020906
02090701	អូរស្ងួត	Ou Snguot	020907
02090702	ព្រៃរំចេក	Prey Rumchek	020907
02090703	អូរទន្ទឹម	Ou Tontuem	020907
02090704	តាសាញខាងជើង	Ta Sanh Khang Chheung	020907
02090705	តាសាញខាងត្បូង	Ta Sanh Khang Tboung	020907
02090706	អន្លង់ពួក	Anlong Puok	020907
02090707	ដូនត្រិត	Doun Tret	020907
02100101	ថ្នល់បត់	Thnal Bat	021001
02100102	ថ្នល់បំបែក	Thnal Bambaek	021001
02100103	កោះតូច	Kaoh Touch	021001
02100104	ទួលជ្រៃ	Tuol Chrey	021001
02100201	ក្បាលហុង	Kbal Hong	021002
02100202	ប្រឡាយប្រាក់	Pralay Prak	021002
02100203	អណ្ដូង ពីរ	Andoung Pir	021002
02100204	ទឹកផុស	Tuek Phos	021002
02100205	ទឹកថ្លា	Tuek Thla	021002
02100301	វាលវង់	Veal Vong	021003
02100302	តាស្ដា	Ta Sda	021003
02100303	ចំការល្ហុង	Chamkar Lhong	021003
02100304	កូនភ្នំខាងជើង	Koun Phnum Khang Cheung	021003
02100305	កូនភ្នំខាងត្បូង	Koun Phnum Khang Tboung	021003
02100306	អូរចំណិប	Ou Chamnib	021003
02100401	អូរ	Ou	021004
02100402	គីឡូលេខ១៣	Kilou Lekh Dabbei	021004
02100403	ត្រពាំងព្រលិត	Trapeang Prolit	021004
02100404	អូរកណ្ដោល	Ou Kandaol	021004
02100501	ស្រឡៅជ្រុំ	Sralau Chrum	021005
02100502	ឈើទាល	Chheu Teal	021005
02100503	ពោធិ៍ជ្រៃ	Pou Chrey	021005
02100504	អូរត្រាវជូរ	Ou Trav Chur	021005
02100505	គំនរបេង	Kumnor Beng	021005
02100506	អូរគ្រួស	Ou Kruos	021005
02100507	អូរគគីរ	Ou Kokir	021005
02100508	ទួលក្រសាំង	Tuol Krasang	021005
02100601	អូរល្វា	Ou Lvea	021006
02100602	ស្ពានយោល	Spean Youl	021006
02100603	រស្មី	Reaksmei	021006
02100604	គីឡូ៩	Kilou  Prambuon	021006
02100605	ចំបក់	Chambak	021006
02100606	ចម្ការតាប៊ុន	Chamkar Ta Bun	021006
02100607	អូរកាច់	Ou Kach	021006
02100608	ស្រឡៅជ្រុំ	Sralau Chrum	021006
02110101	ទួលខ្ពស់	Tuol Khpos	021101
02110102	បេងស្អាត	Beng S'at	021101
02110103	ភ្នំព្រឹក	Phnum Proek	021101
02110104	ស្រឡៅ	Sralau	021101
02110105	គគីរ	Kokir	021101
02110106	អូរធំ	Ou Thom	021101
02110201	អូរ	Ou	021102
02110202	ភ្នំតូច	Phnom Touch	021102
02110203	ពេជ្រចិន្ដា	Pech Chenda	021102
02110204	អូរតាសុខ	Ou Ta Sokh	021102
02110205	អូរតាប៉ុន	Ou Ta Pon	021102
02110206	ស្នួល	Snuol	021102
02110207	សាមគ្គី	Sameakki	021102
02110208	អន្លង់មៀន	Anlong Mean	021102
02110401	ទួលជ្រៃ	Tuol Chrey	021104
02110402	អូរចោទ	Ou Chaot	021104
02110403	ទួលខ្វាវ	Tuol Khvav	021104
02110404	បារាំងធ្លាក់	Barang Thleak	021104
02110405	ចំការស្រូវ	Chamkar Srov	021104
02110406	ដំណាក់អំពិល	Damnak Ampil	021104
02110407	ទួលកកោះ	Tuol Kakaoh	021104
02110408	អូរគល់សំយ៉ុង	Ou Kol Samyong	021104
02110409	ទួល	Tuol	021104
02110410	ចំការត្រប់	Chamkar Trab	021104
02110411	ហុងទឹក	Hong Tuek	021104
02110412	ចក្រី	Chakrei	021104
02110501	សំរោង	Samraong	021105
02110502	អូររំដួល	Ou Rumduol	021105
02110503	អូរប្រយុទ្ធ	Ou Prayut	021105
02110504	កណ្ដាល	Kandal	021105
02110505	ថ្នល់បត់	Thnal Bot	021105
02110506	អូរល្ហុង	Ou Lhong	021105
02110507	គ្រួសក្រហម	Krus Kraham	021105
02110508	ដីល្អ	Dei Laor	021105
02120101	កំរៀង	Kamrieng	021201
02120102	ស្វាយវែង	Svay Veaeng	021201
02120103	ស្វាយស	Svay Sa	021201
02120104	ស្រឡៅទង	Sralau Tong	021201
02120105	អូរជ្រៃ	Ou Chrey	021201
02120106	រកាបុស	Roka Bos	021201
02120107	ឡាក់ហុកពីរ	Lak Hokpir	021201
02120108	បឹងអូរជាង	Boeng Ou Cheang	021201
02120201	ដូង	Doung	021202
02120202	អូរដាលើ	Ou Da Leu	021202
02120203	អូរក្រូច	Ou Krouch	021202
02120204	ស្វាយ	Svay	021202
02120205	ស្វាយធំ	Svay Thum	021202
02120206	បឹងរាំង	Boeng Reang	021202
02120207	ព្រះពុទ្ធ	Preah Puth	021202
02120208	ភ្នំចាប	Phnom Chap	021202
02120301	កណ្ដាល	Kandal	021203
02120302	ស្វាយជ្រុំ	Svay Chrum	021203
02120303	អូរគគី	Ou Kokir	021203
02120304	អូរដា	Ou Da	021203
02120305	ថ្មី	Thmei	021203
02120306	កំពង់ឡី	Kampong Lei	021203
02120307	លំផាត់	Lumphat	021203
02120308	ម្នាស់កាល	Mnoas Kal	021203
02120309	សំរោង	Samraong	021203
02120310	តាំងយូ	Tang Yu	021203
02120401	ត្រាង	Trang	021204
02120402	កណ្ដាល	Kandal	021204
02120403	ស្វាយព្រៃ	Svay Prey	021204
02120404	ថ្មី	Thmei	021204
02120405	ល្វាទេ	Lvea Te	021204
02120406	តាសែន	Ta Saen	021204
02120407	អូរគគី	Ou Kokir	021204
02120408	អូរចំបក់់	Ou Chambak	021204
02120409	ភ្នំមួយរយ	Phnum Muoyrouy	021204
02120501	ដីក្រហម	Dei Kraham	021205
02120502	អូរចម្លង	Ou Chamlang	021205
02120503	អូរអន្លក់	Ou Anlok	021205
02120504	អូរទឹកថ្លា	Ou Tuek Thla	021205
02120505	សាមគ្គី	Samaki	021205
02120506	អូរត្រជាក់ចិត្ត	Ou TraCheakChet	021205
02120601	ដំណាក់សាលា	Damnak Sala	021206
02120602	កំពង់ចម្លងលើ	Kampong Chamlang Leu	021206
02120603	កំពង់ចម្លងក្រោម	Kampong Chamlang Kraom	021206
02120604	កំប្រង់	Kamprang	021206
02120605	ស្រះទឹកថ្មី	Srah Tuek Thmei	021206
02120606	សាមសិប	Samseb	021206
02120607	ស្រះកំប៉ោក	Srah Kampaok	021206
02120608	តាក្រី	Ta Krei	021206
02120609	ទួលទិល	Tuol Til	021206
02120610	ផ្លូវប្រាំមួយ	Phlov Pram Muoy	021206
02130101	រ៉ា	Ra	021301
02130102	សំរោង	Samraong	021301
02130103	ឆាយបល្ល័ង្គ	Chhay Ballangk	021301
02130104	ជើងទិញ	Cheung Tinh	021301
02130105	តាថុក	Ta Thok	021301
02130106	កន្ទួត	Kantuot	021301
02130107	គោកពោន	Kouk Poun	021301
02130108	បឹងស្នោ	Boeng Snao	021301
02130109	ទួលម្ទេស	Tuol Mtes	021301
02130110	កូនព្រហ្ម	Koun Prum	021301
02130111	បឹងរាំង	Boeng Reang	021301
02130201	គាស់ក្រឡ	Koas Krala	021302
02130202	ស្ពាន	Spean	021302
02130203	មុខវត្ដ	Muk Voat	021302
02130204	ទួលបល្ល័ង្គ	Tuol Ballangk	021302
02130205	ទួលតាមឹម	Tuol Ta Muem	021302
02130206	ថ្មី	Thmei	021302
02130207	ព្រៃពពេល	Prey Popeael	021302
02130208	បឹងឈ្នះ	Boeng Chhneah	021302
02130209	ដំណាក់កកោះ	Damnak KoKaoh	021302
02130301	ហប់	Hab	021303
02130302	ចំបក់	Chambak	021303
02130303	សំបូរ	Sambour	021303
02130304	សាមគ្គី	Sameakki	021303
02130305	ត្រពាំងដងទឹក	Trapeang Dang Tuek	021303
02130306	គោកត្រុំ	Kouk Trom	021303
02130307	ស្លែងជួរ	Slaeng Chuor	021303
02130401	សាច់ហាប់	Sach Hab	021304
02130402	បឹងព្រះ	Boeng Preah	021304
02130403	ព្រៃផ្ដៅ	Prey Phdau	021304
02130404	កាប់ព្រិច	Kab Prich	021304
02130405	តាខោ	Ta Khao	021304
02130406	កុយវែង	Koy Veaeng	021304
02130407	ព្រៃចក	Prey Chak	021304
02130408	តានួត	Ta Nuot	021304
02130409	បឹងព្រះក្រឡាញ់	Boeng Preah Kralanh	021304
02130501	បាស្រែ	Ba Srae	021305
02130502	ដូនបា	Doun Ba	021305
02130503	ព្រៃភ្ញាស់	Prey Phneas	021305
02130504	ទួលលៀប	Tuol Lieb	021305
02130505	គោករកា	Kouk Roka	021305
02130506	ខ្លែងគង់	Klaeng Kong	021305
02130507	ខ្វែង	Khvaeng	021305
02130508	ព្រៃប៉ែន	Prey Paen	021305
02130601	ក្រាំងស្វាត	Krang Svat	021306
02130602	បន្ទាយចារ	Banteay Char	021306
02130603	ព្រៃសិន	Prey Sen	021306
02130604	ព្រៃទទឹង	Prey Totueng	021306
02130605	សំរោង	Samraong	021306
02130606	ឫស្សីព្រះ	Ruessei Preah	021306
02130607	ឆ្នាល់មាន់់	Chhnal Moan	021306
02140101	សៀម	Siem	021401
02140102	ខ្នាចអំពរ	Khnach Ampor	021401
02140103	ឆ្កែខាំប្រើស	Chhkae Kham Praeus	021401
02140104	ព្រែកតាវេន	Preaek Ta Ven	021401
02140105	ព្រែកជីក	Preaek Chik	021401
02140106	អូររំចេក	Ou Rumcheck	021401
02140107	ថ្នំ	Thnam	021401
02140201	ចុងពរ	Chong Por	021402
02140204	ប៉ែន	Paen	021402
02140206	ព្រៃខ្លូត	Prey Khlout	021402
02140207	ព្រៃត្រឡាច	Prey Tralach	021402
02140208	រូង	Roung	021402
02140219	ស្រះថត	Srah That	021402
02140220	រូង២	Roung Pir	021402
02140301	ស្រះគុយ	Srah Kuy	021403
02140302	មុខរាហ៍ ២	Mukh Rea Pir	021403
02140303	ស្វាយយ៉	Svay Ya	021403
02140304	ទួលស្វាយ	Tuol Svay	021403
02140305	តាព្រាត	Ta Preat	021403
02140306	មុខរាហ៍១	Mukh Rea Muoy	021403
02140307	ដង្ហោ	Danghao	021403
02140401	ស្ដុកប្រវឹក	Sdok Pravuek	021404
02140402	កោះធំ	Kaoh Thum	021404
02140403	ព្រះអណ្ដូង	Preah Andoung	021404
02140404	ទួលគគីរ	Tuol Kokir	021404
02140405	ព្រៃអម្ពាន់	Prey Ampoan	021404
02140406	ប្រឡាយ១៨	Pralay Dabprambei	021404
02140501	ឈូក	Chhuk	021405
02140502	បាសាក់	Basak	021405
02140503	កំរ៉ែង	Kamraeng	021405
02140504	តាព្រាល	Ta Preal	021405
02140505	ច្រាំងខ្ពស់	Chrang Khpos	021405
03010101	ស្វាយពក	Svay Pok	030101
03010102	បាធាយ	Batheay	030101
03010103	ស្រះព្រីង	Srah Pring	030101
03010104	ជ្រែក	Chreaek	030101
03010105	ទួល	Tuol	030101
03010106	អូរម៉ាល់	Ou Mal	030101
03010201	ច្បារអំពៅ	Chbar Ampov	030102
03010202	ទួលចាន់	Tuol Chan	030102
03010203	អន្លង់ជ្រៃ	Anlong Chrey	030102
03010204	ស្ទឹងឆ្វេង	Stueng Chveng	030102
03010301	ជាលា	Chea Lea	030103
03010302	តាង៉ិល	Ta Ngil	030103
05031108	ស្វាយ	Svay	050311
03010303	តាំងក្រាំង	Tang Krang	030103
03010304	បែកពាង	Baek Peang	030103
03010305	ភ្នំធំ	Phnum Thum	030103
03010401	ជើងព្រៃ	Cheung Prey	030104
03010402	អណ្ដូងស្នាយ	Andoung Snay	030104
03010403	ប្រសូត្រ "ក"	Prasoutr Ka	030104
03010404	ប្រសូត្រ "ខ"	Prasoutr Kha	030104
03010405	ត្របែក	Trabaek	030104
03010406	ត្រយ៉ងពង	Trayang Pong	030104
03010501	មេព្រីង	Me Pring	030105
03010502	តាំងថ្លើង	Tang Thlaeung	030105
03010503	តាំងស្រី	Tang Srei	030105
03010504	តាំងរលាង	Tang Roleang	030105
03010505	ព្រៃកោ	Prey Kao	030105
03010601	ផ្អាវ	Ph'av	030106
03010602	សំរោង	Samraong	030106
03010603	តាំងបឹង	Tang Boeng	030106
03010604	បាកាល	Ba Kal	030106
03010605	ព្រៃញា	Prey Nhea	030106
03010606	កណ្ដោល	Kandaol	030106
03010701	សំបូរ	Sambour	030107
03010702	បាលាំង	Balang	030107
03010703	វាល	Veal	030107
03010704	សង្កើប	Sangkaeub	030107
03010705	តាពយ	Ta Poy	030107
03010706	ចុង	Chong	030107
03010707	តាបែក	Ta Baek	030107
03010801	កប៉ាល់	Kakpal	030108
03010802	ពោធិស្ទៀង	Pou Stieng	030108
03010803	ស្វាយព្រៃ	Svay Prey	030108
03010804	តាំងជ្រៃ	Tang Chrey	030108
03010805	ស្រឹង្គ	Sroengk	030108
03010901	ភ្នំដិល	Phnum Del	030109
03010902	ជើងឆ្នុក	Cheung Chhnok	030109
03010903	ត្បូងភ្នំ	Tboung Phnum	030109
03010904	ពពិត	Popit	030109
03010905	អកទៀង	Ak Tieng	030109
03010906	កំពង់ព្រះ	Kampong Preah	030109
03010907	តាំងគោក	Tang Kouk	030109
03010908	ប្រាសាទ	Prasat	030109
03011001	បឹងវែង	Boeng Veaeng	030110
03011002	ក្រដាស ក	Kradas Ka	030110
03011003	ក្រដាស ខ	Kradas Kha	030110
03011004	ស្ដុកធំ	Sdok Thum	030110
03011005	ត្រាវភ្នី	Trav Phni	030110
03011006	ខ្វិត	Khvet	030110
03011007	បឹង	Boeng	030110
03011008	ខ្ទុំ	Khtum	030110
03011009	ចាន់	Chan	030110
03011010	ជីនាង	Chi Neang	030110
03011101	រោងដំរី	Roung Damrei	030111
03011102	កំពោក	Kampouk	030111
03011103	ភ្នំតូច	Phnum Touch	030111
03011104	ទំព្រង	Tum Prong	030111
03011105	ថ្មី	Thmei	030111
03011106	ពោធិឫស្សី	Pou Ruessei	030111
03011107	ត្រប់	Trab	030111
03011108	ចាន់គង់	Chan Kong	030111
03011109	ថ្កូវ	Thkov	030111
03011110	ថ្មកែវ	Thma Kaev	030111
03011111	រោធ	Rout	030111
03011201	ទំនប់លើ	Tumnob Leu	030112
03011202	ប្រយុក	Prayuk	030112
03011203	ដូនប៉ែន	Doun Paen	030112
03011204	រូង	Rung	030112
03011205	ប្រសាំ	Prasam	030112
03011206	ស្រឹង្គ	Sroengk	030112
03011207	ត្រពាំងស្នោ	Trapeang Snao	030112
03020101	សារ៉ាយ	Saray	030201
03020102	ដូនធី	Doun Thi	030201
03020103	ថ្លុកក្រវ៉ាន់	Thlok Kravan	030201
03020104	វាលធ្នង់	Veal Thnong	030201
03020105	បុសខ្នុរ	Bos Khnor	030201
03020106	ច្រណោម	Chranaom	030201
03020107	ប្រសើរ	Prasaeur	030201
03020108	១០មករា	Dab Meakkakra	030201
03020109	សាមគ្គី	Sameakki	030201
03020110	ចំការកប្បាស	Chamkar Kabbas	030201
03020111	៣៥	Samsebpram	030201
03020201	ចំការអណ្ដូង	Chamkar Andoung	030202
03020202	សូរជៃ	Souchey	030202
03020203	ស្វាយជួរ	Svay Chuor	030202
03020204	អូរក្រវ៉ាន់	Ou Kravan	030202
03020205	ដូនបុស្ស	Doun Bos	030202
03020206	ជាំជ្រៃ	Choam Chrey	030202
03020208	ភូមិលេខ ២	Phum Lekh Pir	030202
03020209	ភូមិ១១	Phum Dab Muoy	030202
03020210	ភូមិ៣៣	Phum Sam Bei	030202
03020211	ភូមិ២២	Phum Mphey Pir	030202
03020212	តាប្រ៉ុក	Ta Prok	030202
03020213	ភូមិលេខ ១	Phum Lekh Muoy	030202
03020214	សហគ្រាស	Sahak Kreas	030202
03020215	សហគ្រាន់	Sahak Kroan	030202
03020216	ស្រោងចាន់	Sraong Chan	030202
03020217	រោងចក្រ	Roung Chakr	030202
03020218	ក្រុមហ៊ុន	Kromhun	030202
03020301	ស្ពឺ "ក"	Spueu Ka	030203
03020302	ជយោ	Cheyyou	030203
03020303	អូរប៉ិះ	Ou Peh	030203
03020304	ត្រពាំងឫស្សី	Trapeang Ruessei	030203
03020305	ត្រពាំងល្ពៅ	Trapeang Lpov	030203
03020401	ក្បាលហុងថ្មី	Kbal Hong Thmei	030204
06040302	ស្រម៉	Srama	060403
03020402	ក្បាលហុងចាស់	Kbal Hong Chas	030204
03020403	ក្រឡែងកើត	Kralaeng Kaeut	030204
03020404	ក្រឡែងលិច	Kralaeng Lech	030204
03020405	ល្វាជើង	Lvea Cheung	030204
03020406	ល្វាត្បូង	Lvea Tboung	030204
03020407	ភូមិ បី	Phum Bei	030204
03020501	បន្ទាយជ័យ	Banteay Chey	030205
03020502	ពព្រេង	Popreng	030205
03020503	អូរវាយ	Ou Veay	030205
03020504	ពែងមាសជើង	Peaeng Meas Cheung	030205
03020505	ពែងមាសត្បូង	Peaeng Meas Tboung	030205
03020506	ស្ពឺលិច	Spueu Lech	030205
03020507	ស្ពឺកើត	Spueu Kaeut	030205
03020508	វាល	Veal	030205
03020601	ត្រពាំងបេង	Trapeang Beng	030206
03020602	ប្រម៉ាត់ដី	Pramat Dei	030206
03020603	វាលរីលិច	Veal Ri Lech	030206
03020604	ស្វាយទាប	Svay Teab	030206
03020605	ព្រឹក្ស	Proeks	030206
03020606	ថ្នល់បែកលិច	Thnal Baek Lech	030206
03020607	តាំងក្រង់	Tang Krang	030206
03020608	មហា	Moha	030206
03020609	បុសថ្លាន់	Bos Thlan	030206
03020610	ស្រែព្រាល	Srae Preal	030206
03020611	អូរដា	Ou Da	030206
03020612	ថ្នល់បែកកើត	Thnal Baek Kaeut	030206
03020613	វាលរីកើត	Veal Ri Kaeut	030206
03020614	ភូមិ៧៧	Phum Chetseb Prampir	030206
03020701	តាអុង	Ta Ong	030207
03020702	សំពរ័	Sampoar	030207
03020703	ទួលប្រាក់	Tuol Prak	030207
03020704	ទួលមាស	Tuol Meas	030207
03020705	ទួលប៉ែន	Tuol Paen	030207
03020706	ចំរើនផល	Chamraeun Phal	030207
03020707	ត្រពាំងឈូក	Trapeang Chhuk	030207
03020708	ទួលស្រូវ	Tuol Srov	030207
03020709	ភូមិ ៣០	Phum Samseb	030207
03020710	ភូមិ ៣១	Phum Sammuoy	030207
03020711	ភូមិ ៣២	Phum Sampir	030207
03020712	ភូមិ ៣៣	Phum Sambei	030207
03020713	ភូមិ ៣៤	Phum Sambuon	030207
03020801	ស្រែប្រាំង	Srae Prang	030208
03020802	រំចេក	Rumchek	030208
03020803	នាងលើង	Neang Leung	030208
03020804	ស្វាយទាប	Svay Teab	030208
03020805	អូរតាសែង	Ou Ta Saeng	030208
03020806	ឈូក	Chhuk	030208
03020807	ផ្លាក	Phlak	030208
03030101	រវៀង	Rovieng	030301
03030102	ខ្នុរដំបង	Khnor Dambang	030301
03030103	វាល	Veal	030301
03030201	គោករវៀង	Kouk Rovieng	030302
03030202	ទទោល	Totoul	030302
03030203	បាគ្រង	Ba Krong	030302
03030204	ឈូក	Chhuk	030302
03030301	ផ្ដៅជុំលិច	Phdau Chum Lech	030303
03030302	ផ្ដៅជុំកើត	Phdau Chum Kaeut	030303
03030303	ឈើទាល	Chheu Teal	030303
03030304	ចាំនាង	Cham Neang	030303
03030401	ពៅ្នលិច	Pnov Lech	030304
03030402	ពៅ្នកើត	Pnov Kaeut	030304
03030403	ព្រៃចារក្រៅ	Prey Char Krau	030304
03030404	សៀមបោយ	Siem Baoy	030304
03030405	បាទី	Bati	030304
03030406	ព្រៃចារក្នុង	Prey Char Knong	030304
03030501	ព្រីងជ្រុំ	Pring Chrum	030305
03030502	ត្រពាំងទឹម	Trapeang Tuem	030305
03030503	ត្រពាំងផ្អាវ	Trapeang Ph'av	030305
03030504	តានី	Ta Ni	030305
03030505	កោះចំប៉ា	Kaoh Champa	030305
03030601	ចំបក់	Chambak	030306
03030602	ត្រពាំងស្លា	Trapeang Sla	030306
03030603	ត្រពាំងត្រុំ	Trapeang Trom	030306
03030604	អំពិលទ្វារ	Ampil Tvear	030306
03030605	កកោះ	Kakaoh	030306
03030606	បុស្សតាមុំ	Bos Ta Mom	030306
03030607	ត្រពាំងឈូក	Trapeang Chhuk	030306
03030608	ពោធិ	Pou	030306
03030609	បាខម	Bakham	030306
03030610	សំពងជ័យ	Sampong Chey	030306
03030611	ស្វាយមាស	Svay Meas	030306
03030612	កុមារ	Komar	030306
03030613	ដូន្ដោ	Doun Tao	030306
03030614	សណ្ដែក	Sandaek	030306
03030701	ពង្រ	Pongro	030307
03030702	ស្ដើងជ័យ	Sdaeung Chey	030307
03030703	ប្របឹង	Pra Boeng	030307
03030704	ខ្នារ	Khnar	030307
03030705	សង្កែ	Sangkae	030307
03030706	ក្ដុយ	Kdoy	030307
03030707	ដំណាក់អំពិល	Damnak Ampil	030307
03030801	ប៉ាណា	Pana	030308
03030802	ស្គន់	Skon	030308
03030803	ថ្មី	Thmei	030308
03030804	តាសែន	Ta Saen	030308
03030805	ង៉ូង	Ngoung	030308
03030806	ដូនដុំ	Doun Dom	030308
03030807	បឹងជ្រោយ	Boeng Chrouy	030308
03030808	សូទិព្វ	Soutib	030308
03030901	ស្រាមលិច	Sram Lech	030309
03030902	ស្រាមកើត	Sram Kaeut	030309
03030903	ស្រាមជើង	Sram Cheung	030309
03030904	ភូមិថ្មី	PhumThmei	030309
03030905	ស្រម៉រ	Sramar	030309
03030906	សង្កែពង	Sangkae Pong	030309
03030907	ប្រខ្នោរ	Pra Khnaor	030309
03030908	ក្រឡាញ់	Kralanh	030309
03030909	ប្រធាតុ	Pratheat	030309
03030910	ត្រពាំងត្មាត	Trapeang Tmat	030309
03030911	ស្រាមអង្កាម	Sram Angkam	030309
03030912	អណ្ដូងត្រាំង	Andoung Treang	030309
03030913	ត្រពាំងស្នោ	Trapeang Snao	030309
03031001	ត្រពាំងថ្ម	Trapeang Thma	030310
03031002	ស្អាង	S'ang	030310
03031003	អង្គ	Angk	030310
03031004	ប្រទេន	Praten	030310
03031005	ទម្ពរ	Tumpor	030310
03031006	ត្នោតបាក់	Tnaot Bak	030310
03031007	កណ្ដាល	Kandal	030310
03031008	អារក្ស	Areaks	030310
03031009	ត្រពាំងគរ	Trapeang Kor	030310
03031010	ក្ងោក	Kngaok	030310
03050101	បឹងកុកទី ១	Boeng Kok Ti Muoy	030501
03050102	បឹងកុកទី ២	Boeng Kok Ti Pir	030501
03050103	ចុងថ្នល់ ទី១	Chong Thnal Ti Muoy	030501
03050104	ចុងថ្នល់ ទី២	Chong Thnal Ti Pir	030501
03050105	ឡឥដ្ឋ	La Edth	030501
03050106	ជ្រោយថ្ម	Chrouy Thma	030501
03050107	មេម៉ាយ	Memay	030501
03050201	ភូមិ ទី ៧	Phum Ti Prampir	030502
03050202	ភូមិ ទី ៨	Phum Ti Prambei	030502
03050203	ភូមិ ទី ៩	Phum Ti Prambuon	030502
03050204	ភូមិ ទី ១០	Phum Ti Dab	030502
03050205	ភូមិ ទី ១១	Phum Ti Dabmuoy	030502
03050206	ភូមិ ទី ១២	Phum Ti Dabpir	030502
03050207	ភូមិ ទី ១៣	Phum Ti Dabbei	030502
03050208	ភូមិ ទី ១៤	Phum Ti Dabbuon	030502
03050209	ភូមិ ទី ១៥	Phum Ti Dabpram	030502
03050301	រកាលើ	Roka Leu	030503
03050302	រកាក្រោម	Roka Kraom	030503
03050303	នាងគង្ហីង	Neang Konghing	030503
03050304	បឹងបាសាក់	Boeng Basak	030503
03050305	ចំការខ្ពប	Chamkar Khpob	030503
03050306	បឹងស្នាយ	Boeng Snay	030503
03050307	ព្រែកដើមចាន់	Preaek Daeum Chan	030503
03050308	ព្រែកជីក	Preaek Chik	030503
03050309	កំពង់រលីង	Kampong Roling	030503
03050310	តាណេង	Ta Neng	030503
03050401	ភូមិ ទី ១	Phum Ti Muoy	030504
03050402	ភូមិ ទី ២	Phum Ti Pir	030504
03050403	ភូមិ ទី ៣	Phum Ti Bei	030504
03050404	ភូមិ ទី ៤	Phum Ti Buon	030504
03050405	ភូមិ ទី ៥	Phum Ti Pram	030504
03050406	ភូមិ ទី ៦	Phum Ti Prammuoy	030504
03060101	អណ្ដូងច្រុះ	Andoung Chroh	030601
03060102	អំពិលលើ	Ampil Leu	030601
03060103	អំពិលក្រោម	Ampil Kraom	030601
03060104	ជើងគោក	Cheung Kouk	030601
03060105	រលៀក	Roliek	030601
03060106	រមាស	Romeas	030601
03060107	បន្ទាយថ្ម	Banteay Thma	030601
03060108	ស្រឡៅ	Sralau	030601
03060109	ក្រឡា	Krala	030601
03060110	ជង្ហុក	Chonghuk	030601
03060111	វាលស្បូវ	Veal Sbov	030601
03060112	ស្យា	Sya	030601
03060201	ហាន់ជ័យ	Hanchey	030602
03060202	ក្រូចសើច	Krouch Saeuch	030602
03060203	ល្វាទេ	Lvea Te	030602
03060204	មាន់ហើរ	Moan Haeur	030602
03060301	ព្រែកយួន	Preaek Yuon	030603
03060302	ឥន្ទនេល	Enteak Nel	030603
03060303	ស្ពានថ្មី	Spean Thmei	030603
03060304	បឹងបបុះ	Boeng Baboh	030603
03060305	កៀនជ្រៃក្រៅ	Kien Chrey Krau	030603
03060306	កៀនជ្រៃក្នុង	Kien Chrey Knong	030603
03060401	គគរ១	Kokor Muoy	030604
03060402	គគរ២	Kokor Pir	030604
03060403	ចំការសាមសិប	Chamkar Samseb	030604
03060404	កំពង់ក្របី	Kampong Krabei	030604
03060501	កោះប៉ែន ក	Kaoh Paen Ka	030605
03060502	កោះប៉ែន ខ	Kaoh Paen Kha	030605
03060503	កោះប៉ែន គ	Kaoh Paen Kho	030605
03060505	កោះដាច់	Kaoh Dach	030605
03060506	កោះព្រលូង	Kaoh Prolung	030605
03060507	ស្វាយជ្រុំ	Svay Chrum	030605
03060508	កោះចាស់	Kaoh Chas	030605
03060509	កំពង់ត្រុំក្រោម	Kampong Trom Kraom	030605
03060510	កំពង់ត្រុំលើ	Kampong Trom Leu	030605
03060601	កោះរកាក្រៅ	Kaoh Roka Krau	030606
03060602	កោះរកាក្នុង	Kaoh Roka Knong	030606
03060603	ដំបងដែក	Dambang Daek	030606
03060604	អូរឈ្លើង	Ou Chhleung	030606
03060605	តាមាង	Ta Meang	030606
03060606	ថ្មី	Thmei	030606
03060607	កោះគល់	Kaoh Kol	030606
03060701	ភូមិ ទី ១	Phum Ti Muoy	030607
03060702	ភូមិ ទី ២	Phum Ti Pir	030607
03060703	ភូមិ ទី ៣	Phum Ti Bei	030607
03060704	ភូមិ ទី ៤	Phum Ti Buon	030607
03060705	ភូមិ ទី ៥	Phum Ti Pram	030607
03060706	ភូមិ ទី ៦	Phum Ti Prammuoy	030607
03060707	ភូមិ ទី ៧	Phum Ti Prampir	030607
03060708	ភូមិ ទី ៨	Phum Ti Prambei	030607
03060801	កោះកុក "ក"	Kaoh Kok Ka	030608
03060802	កោះកុក "ខ"	Kaoh Kok Kha	030608
03060803	កោះប្រាក់ក្រោម	Kaoh Prak Kraom	030608
03060804	កោះប្រាក់ក្នុង	Kaoh Prak Knong	030608
03060805	កោះប្រាក់លើ	Kaoh Prak Leu	030608
03060901	ស្ដេចនន	Sdach Non	030609
03060902	ទួលបេង	Tuol Beng	030609
03060903	អណ្ដូងពោធិ៍	Andoung Pou	030609
03060904	ទួលពពេល	Tuol Popel	030609
03060905	ត្រពាំងជ្រៃ	Trapeang Chrey	030609
03060906	ត្រពាំងត្រស់	Trapeang Tras	030609
03060907	ត្រពាំងឫស្សី	Trapeang Ruessei	030609
03060908	អង្គួញដី	Angkuonh Dei	030609
03060909	អំពិលជ្រុំ	Ampil Chrum	030609
03060910	ថ្មី	Thmei	030609
03060911	ត្រពាំងថ្ម	Trapeang Thma	030609
03060912	ត្រពាំងចារ	Trapeang Char	030609
03060913	ត្រកួន	Trakuon	030609
03061001	ព្រៃចក្រី	Prey Chakkrei	030610
03061002	អន្លង់ស្នូក	Anlong Snouk	030610
03061003	អំពិលក្រញ៉ាញ់	Ampil Kranhanh	030610
03061004	អូរស្វាយ	Ou Svay	030610
03061005	ត្រពាំងកក់	Trapeang Kak	030610
03061006	អូរធ្នង់	Ou Thnong	030610
03061007	ខែលជ័យ	Khael Chey	030610
03061101	ថ្មគោល	Thma Koul	030611
03061102	វាលខ្សាច់	Veal Khsach	030611
03061103	ប្រសំ	Prasam	030611
03061104	ពង្រ	Pongro	030611
03061105	រមូល	Romul	030611
03061106	ទួលរកា	Tuol Roka	030611
03061107	រអាងលើ	Ro'ang Leu	030611
03061108	រអាងក្រោម	Ro'ang Kraom	030611
03061201	ឈើទាលស្រុតលើ	Chheu Teal Srot Leu	030612
03061202	ឈើទាលស្រុតក្រោម	Chheu Teal Srot Kraom	030612
03061203	រំលេច	Rumlech	030612
03061204	ថ្មី	Thmei	030612
03061301	ល្ពាក	Lpeak	030613
03061302	ព្រៃគុយ	Prey Kuy	030613
03061303	ស្រក	Srak	030613
03061304	តាម៉ៅ	Ta Mau	030613
03061401	ច្រកស្ដៅ	Chrak Sdau	030614
03061402	វាលក្រៀល	Veal Kriel	030614
03061403	ទ្រាន	Trean	030614
03061404	ត្រពាំងតាសុខ	Trapeang Ta Sokh	030614
03061405	ប្រថង	Prathang	030614
03061406	ប៉ែន	Paen	030614
03061407	ទួលចំបក់	Tuol Chambak	030614
03061408	ច្រនៀង	Chranieng	030614
03061409	ត្រពាំងអំពិល	Trapeang Ampil	030614
03061410	តាខុង	Ta Khong	030614
03061411	ទួលត្រាច	Tuol Trach	030614
03061412	ពោន	Poun	030614
03061501	ព្រៃផ្ដៅ	Prey Phdau	030615
03061502	អណ្ដូងស្វាយ	Andoung Svay	030615
03061503	គោកគ្រាម	Kouk Kream	030615
03061504	ក្ដីបឹង	Kdei Boeng	030615
03061505	ពង្រ	Pongro	030615
03061506	ប្រាសាទ	Prasat	030615
03061507	គោកទទា	Kouk Totea	030615
03061508	វិហារ	Vihear	030615
03061509	គងមហា	Kong Moha	030615
03070101	អង្គរបានទី ១	Angkor Ban Ti Muoy	030701
03070102	អង្គរបានទី ២	Angkor Ban Ti Pir	030701
03070103	អង្គរបានទី ៣	Angkor Ban Ti Bei	030701
03070104	អង្គរបានទី ៤	Angkor Ban Ti Buon	030701
03070105	អង្គរបានទី ៥	Angkor Ban Ti Pram	030701
03070106	អង្គរបានទី ៦	Angkor Ban Ti Prammuoy	030701
03070107	អង្គរបានទី ៧	Angkor Ban Ti Prampir	030701
03070108	អង្គរបានទី ៨	Angkor Ban Ti Prambei	030701
03070109	អង្គរបានទី ៩	Angkor Ban Ti Prambuon	030701
03070201	កងតាណឹងទី ១	Kang Ta Noeng Ti Muoy	030702
03070202	កងតាណឹងទី ២	Kang Ta Noeng Ti Pir	030702
03070203	កងតាណឹងទី ៣	Kang Ta Noeng Ti Bei	030702
03070204	កងតាណឹងទី ៤	Kang Ta Noeng Ti Buon	030702
03070205	កងតាណឹងទី ៥	Kang Ta Noeng Ti Pram	030702
03070206	កងតាណឹងទី ៦	Kang Ta Noeng Ti Prammuoy	030702
03070207	កងតាណឹងទី ៧	Kang Ta Noeng Ti Prampir	030702
03070208	កងតាណឹងទី ៨	Kang Ta Noeng Ti Prambei	030702
03070209	កងតាណឹងទី ៩	Kang Ta Noeng Ti Prambuon	030702
03070301	ថ្លុកជ្រៅ	Thlok Chrov	030703
03070302	ស្វាយពាន់ទី ១	Svay Poan Ti Muoy	030703
03070303	ស្វាយពាន់ទី ២	Svay Poan Ti Pir	030703
03070304	អូពពេល	Ou Popel	030703
03070305	ខ្ចៅទី ១	Khchau Ti Muoy	030703
03070306	ខ្ចៅទី ២	Khchau Ti Pir	030703
03070307	ខ្ចៅទី ៣	Khchau Ti Bei	030703
03070308	វ៉ារិន្ទទី ១	Varint Ti Muoy	030703
03070309	វ៉ារិន្ទទី ២	Varint Ti Pir	030703
03070310	វ៉ារិន្ទទី ៣	Varint Ti Bei	030703
03070401	ដំណាក់ជ្រៃ	Damnak Chrey	030704
03070402	ដំណាក់ស្នាយ	Damnak Snay	030704
03070403	ពាមជីកង	Peam Chi Kang	030704
03070404	សាច់សូរ	Sach Sour	030704
03070405	សំបួរមាស "ក"	Sambuor Meas Ka	030704
03070406	សំបួរមាស "ខ"	Sambuor Meas Kha	030704
03070407	កោះតូច	Kaoh Touch	030704
03070501	ព្រែកកុយ	Preaek Koy	030705
03070502	អន្លង់គគី	Anlong Kokir	030705
03070503	គងជ័យ	Kong Chey	030705
03070504	គហ៊េរ	Koher	030705
03070505	មេសរ	Me Sar	030705
03070506	អូស្វាយលិច	Ou Svay Lech	030705
03070507	អូស្វាយកើត	Ou Svay Kaeut	030705
03070601	ពោធិសាលាទី ១	Pou Sala Ti Muoy	030706
03070602	ពោធិសាលាទី ២	Pou Sala Ti Pir	030706
03070603	ពាមក្នុង	Peam Knong	030706
03070604	ព្រែកអណ្ដូង	Preaek Andoung	030706
03070605	ព្រែកក្របៅ	Preaek Krabau	030706
03070606	អូរកណ្ដោល	Ou Kandaol	030706
03070607	អណ្ដូងតាអុង	Andoung Ta Ong	030706
03070608	អណ្ដូងដៃ	Andoung Dai	030706
03070609	ទឹកចេញ	Tuek Chenh	030706
03070610	ចំការឪឡឹក	Chamkar Ovloek	030706
03070701	កន្លែងរុន	Kanlaeng Run	030707
03070702	បឹងទទា	Boeng Totea	030707
03070703	ទួលវិហារ	Tuol Vihear	030707
03070704	ទួលបី	Tuol Bei	030707
03070705	រាយប៉ាយលើ	Reay Pay Leu	030707
03070706	រាយប៉ាយក្រោម	Reay Pay Kraom	030707
03070707	ព្រែកប្រណាក	Preaek Pranak	030707
03070708	គកក្របី	Kok Krabei	030707
03070801	ព្រែកលីវទី ១	Preaek Liv Ti Muoy	030708
03070802	ព្រែកលីវទី ២	Preaek Liv Ti Pir	030708
03070803	ព្រែកលីវទី  ៣	Preaek Liv Ti Bei	030708
03070804	ព្រែកលីវទី ៤	Preaek Liv Ti Buon	030708
03070805	ជ្រោយក្របៅទី ១	Chrouy Krabau Ti Muoy	030708
03070806	ជ្រោយក្របៅទី ២	Chrouy Krabau Ti Pir	030708
03070807	ស្វាយស្រណោះទី ១	Svay Sranaoh Ti Muoy	030708
03070808	ស្វាយស្រណោះទី ២	Svay Sranaoh Ti Pir	030708
03070809	រកាអារ	Roka Ar	030708
03070901	រកាគយ "ក"	Roka Koy Ka	030709
03070902	រកាគយ "ខ"	Roka Koy Kha	030709
03070903	ភូមិថ្មី "ក"	Phum Thmei Ka	030709
03070904	ភូមិថ្មី "ខ"	PhumThmei Kha	030709
03070905	ពង្រ	Pongro	030709
03070906	ស្វាយតាហែន	Svay Ta Haen	030709
03070907	ដំណាក់ល្អិត	Damnak L'et	030709
03071001	ខ្ពបលើ	Khpob Leu	030710
03071002	ខ្ពបក្រោម	Khpob Kraom	030710
03071003	ស្ដៅ	Sdau	030710
03071004	ល្វាលើ	Lvea Leu	030710
03071005	ល្វាក្រោម	Lvea Kraom	030710
03071006	អន្លង់គគីរ	Anlong Kokir	030710
03071101	កោះតាង៉ោទី ១	Kaoh Ta Ngao Ti Muoy	030711
03071102	កោះតាង៉ោទី ២	Kaoh Ta Ngao Ti Pir	030711
03071103	កោះតាង៉ោទី ៣	Kaoh Ta Ngao Ti Bei	030711
03071104	បឹងសាងកើត	Boeng Sang Kaeut	030711
03071105	បឹងសាងលិច	Boeng Sang Lech	030711
03071106	ក្ដី	Kdei	030711
03071107	សូរគេន	Sourken	030711
03071108	បឹងត្រាវ	Boeng Trav	030711
03071109	ព្រែកគ្រួស	Preaek Kruos	030711
03071110	អន្លង់អកលិច	Anlong Ak Lech	030711
03071111	អន្លង់អកកើត	Anlong Ak Kaeut	030711
03080101	កោះចិនក្រោម	Kaoh Chen Kraom	030801
03080102	កោះចិនលើ	Kaoh Chen Leu	030801
03080103	កំពង់រាបលើ	Kampong Reab Leu	030801
03080104	កំពង់រាបក្រោម	Kampong Reab Kraom	030801
03080105	កំពង់ស្ដីលើ	Kampong Sdei Leu	030801
03080106	កំពង់ស្ដីក្រោម	Kampong Sdei Kraom	030801
03080107	កំពង់ស្ដីកណ្ដាល	Kampong Sdei Kandal	030801
03080108	កំពង់ស្ដីក្នុង	Kampong Sdei Knong	030801
03080201	ភូមិទី១	Phum Ti Muoy	030802
03080202	ភូមិទី២	Phum Ti Pir	030802
03080203	ភូមិទី៣	Phum Ti Bei	030802
03080204	ភូមិទី៤	Phum Ti Buon	030802
03080205	ភូមិទី៥	Phum Ti Pram	030802
03080206	ភូមិទី៦	Phum Ti Prammuoy	030802
03080207	ភូមិទី៧	Phum Ti Prampir	030802
03080208	ភូមិទី៨	Phum Ti Prambei	030802
03080209	ភូមិទី៩	Phum Ti Prambuon	030802
03080210	ភូមិទី១០	Phum Ti Dab	030802
03080211	ភូមិទី១១	Phum Ti Dabmuoy	030802
03080212	ភូមិទី១២	Phum Ti Dabpir	030802
03080213	ភូមិទី១៣	Phum Ti Dabbei	030802
03080214	ភូមិទី៎១៤	Phum Ti Dabbuon	030802
06040303	ផ្ដៀក	Phdiek	060403
03080301	ដំណាក់ស្វាយ	Damnak Svay	030803
03080302	រកាកោង	Roka Kaong	030803
03080303	ព្រែកគល់	Preaek Kol	030803
03080304	បទស្រីទន្ទឹង	Bat Srei Tontueng	030803
03080305	អំបែងចេះ	Ambaeng Cheh	030803
03080306	ល្វេលើ	Lve Leu	030803
03080307	ល្វេក្រោម	Lve Kraom	030803
03080308	ទំពូង	Tumpoung	030803
03080309	ព្រែកតាកែ	Preaek Ta Kae	030803
03080310	ព្រែកចង្ក្រាន	Preaek Changkran	030803
03080401	ចុងព្រែក	Chong Preaek	030804
03080402	មហាលាភជើង	Moha Leaph Cheung	030804
03080403	មហាលាភត្បូង	Moha Leaph Tboung	030804
03080404	រកាកោងត្បូង	Roka Kaong Tboung	030804
03080405	រកាកោងជើង	Roka Kaong Cheung	030804
03080406	ដំណាក់ព្រីងកើត	Damnak Pring Kaeut	030804
03080407	ដំណាក់ព្រីងលិច	Damnak Pring Lech	030804
03080408	រត្នមុនី	Roat Muni	030804
03080409	ជ្រោយសសិត	Chrouy Saset	030804
03080410	ព្រែក	Preaek	030804
03080501	ខ្ពប	Khpob	030805
03080502	មហាសៀកលើ	Mohasiek Leu	030805
03080503	មហាសៀកក្រោម	Mohasiek Kraom	030805
03080504	កំពង់ចម្លង	Kampong Chamlang	030805
03080505	ខ្ញូងលើ	Khnhoung Leu	030805
03080506	កណ្ដាលខ្ញូង	Kandal Khnhoung	030805
03080507	ចុងខ្ញូង	Chong Khnhoung	030805
03080508	អង្គរជ័យលើ	Angkor Chey Leu	030805
03080509	អង្គរជ័យក្រោម	Angkor Chey Kraom	030805
03080601	ផ្សារថ្មី	Phsar Thmei	030806
03080602	ពាម	Peam	030806
03080603	ថ្មី	Thmei	030806
03080604	ក្រពើគម	Krapeu Korm	030806
03080605	ប៉ាក់ណាម	Pak Nam	030806
03080606	ជីហែ	Chihae	030806
03080607	សំរោង	Samraong	030806
03080608	មហាលាភ	Moha Leaph	030806
03080609	ពង្រ	Pongro	030806
03080610	ទួលក្ដុល	Tuol Kdol	030806
03080611	វាល	Veal	030806
03080612	ទួលកំពត	Tuol Kampot	030806
03080613	ទួលធាតុ	Tuol Theat	030806
03080701	កំពង់ឪជ្រឹង	Kampong Ov Chrueng	030807
03080702	ព្រែករំដេងកើត	Preaek Rumdeng Kaeut	030807
03080703	ព្រែករំដេងលិច	Preaek Rumdeng Lech	030807
03080704	ពង្រកើត	Pongro Kaeut	030807
03080705	ពង្រលិច	Pongro Lech	030807
03080706	ដើមស្ដៅ	Daeum Sdau	030807
03080707	ប៉ាក់ណាម	Pak Nam	030807
03080708	អន្លង់ដូង	Anlong Doung	030807
03080801	ភូមិ ទី១	Phum Ti Muoy	030808
03080802	ភូមិ ទី២	Phum Ti Pir	030808
03080803	ភូមិ ទី៣	Phum Ti Bei	030808
03080804	ភូមិ ទី៤	Phum Ti Buon	030808
03080805	ភូមិ ទី៥	Phum Ti Pram	030808
03080806	ភូមិ ទី៦	Phum Ti Prammuoy	030808
03080807	ភូមិ ទី៧	Phum Ti Prampir	030808
03080808	ភូមិ ទី៨	Phum Ti Prambei	030808
03080809	ភូមិ ទី៩	Phum Ti Prambuon	030808
03080810	ភូមិ ទី១០	Phum Ti Dab	030808
03080811	ភូមិ ទី១១	Phum Ti Dabmuoy	030808
03080812	ភូមិ ទី១២	Phum Ti Dabpir	030808
03080813	ភូមិ ទី១៣	Phum Ti Dabbei	030808
03130101	ព្រៃខ្ជាយ	Prey Khchay	031301
03130102	ទួលចំបក់	Tuol Chambak	031301
03130103	ត្រពាំងបេង	Trapeang Beng	031301
03130104	លាងខ្សាច់	Leang Khsach	031301
03130105	ត្រពាំងបី	Trapeang Bei	031301
03130106	អូរកំបោរ	Ou Kambaor	031301
03130107	គោកស្រឡៅ	Kouk Sralau	031301
03130108	រោងគោ	Roung Kou	031301
03130109	វត្ដចាស់	Voat Chas	031301
03130110	រោលជ្រូក	Roul Chruk	031301
03130111	ព្រៃរំដេង	Prey Rumdeng	031301
03130112	សំណាក់ជើង	Samnak Cheung	031301
03130113	សំណាក់ត្បូង	Samnak Tboung	031301
03130201	កុមារាជ្យ	Komar Reach	031302
03130202	ត្រពាំងអញ្ចញ	Trapeang Anhchanh	031302
03130203	ថ្មដា	Thma Da	031302
03130204	ថ្មគោល	Thma Koul	031302
03130205	ត្រពាំងបិត	Trapeang Bet	031302
03130206	បឹងណាយ	Boeng Nay	031302
03130207	ត្រពាំងធំ	Trapeang Thum	031302
03130208	ប្រវ៉ាស់	Pravas	031302
03130209	អ្នកតាស្នឹង	Neak Ta Snoeng	031302
03130210	តាអុក	Ta Ok	031302
03130211	ក្បាលដំរី	Kbal Damrei	031302
03130212	ទួលខ្វាវ	Tuol Khvav	031302
03130213	ឈូកស	Chhuk Sa	031302
03130214	ឈើបាក់	Chheu Bak	031302
03130215	ត្រើង	Traeung	031302
03130216	ជន្លាត់ដៃ	Chonloat Dai	031302
03130217	វត្ដចាស់	Voat Chas	031302
03130301	ដៃបួន	Dai Buon	031303
03130302	ដូនដី	Doun Dei	031303
03130303	ត្រពាំងទូក	Trapeang Tuk	031303
03130304	ស្លែង	Slaeng	031303
03130305	បន្ទាយរឹង	Banteay Rueng	031303
03130306	ទួលតាកោ	Tuol Ta Kao	031303
03130307	ក្រឡោង	Kralaong	031303
03130308	អូរកំបុត	Ou Kambot	031303
03130309	ខ្វិតតូច	Khvet Touch	031303
03130310	ជ្រៃវៀន	Chrey Vien	031303
03130311	ត្រពាំងអំពិល	Trapeang Ampil	031303
03130312	តារាម	Ta Ream	031303
03130313	ក្លែងពណ៌	Klaeng Poar	031303
03130314	ទឹកនឹម	Tuek Nuem	031303
03130315	ទួលបាក់គាំ	Tuol Bak Koam	031303
03130316	ត្រពាំងសង្កែ	Trapeang Sangkae	031303
03130317	ព្រៃទទឹង	Prey Totueng	031303
03130318	ត្រពាំងព្នៅ	Trapeang Pnov	031303
03130401	ខ្វិតធំ	Khvet Thum	031304
03130402	បារាយណ៍	Baray	031304
03130403	អង្ក្រង	Angkrang	031304
03130404	តាង៉ាល	Ta Ngal	031304
03130405	អំពិលធំ	Ampil Thum	031304
03130406	ដង្កោ	Dangkao	031304
03130407	ប្រធាតុ	Pratheat	031304
03130408	កប្បាស	Kabbas	031304
03130501	ដូនឡី	Doun Lei	031305
03130502	ម្រេញ	Mrenh	031305
03130503	តាមាស	Ta Meas	031305
03130504	តាកែវ	Ta Kaev	031305
03130505	តាលៃ	Ta Ley	031305
03130506	តាម៉ូត	Ta Mout	031305
03130507	រំដួល	Rumduol	031305
03130508	ស្វាយប៉ិន	Svay Pen	031305
03130509	ក្រោយវត្ដ	Kraoy Voat	031305
03130510	ត្រពាំងពោន	Trapeang Poun	031305
03130601	អូរជ្រក	Ou Chrok	031306
03130602	ព្រៃសាក់	Prey Sak	031306
03130603	ទួលខ្ពស់	Tuol Khpos	031306
03130604	ក្រសាំងតាម៉ង់	Krasang Ta Mang	031306
03130605	ក្រូច	Krouch	031306
03130606	ថ្មី	Thmei	031306
03130607	សំរោង	Samraong	031306
03130701	គក	Kok	031307
03130702	ត្រពាំងជីនាង	Trapeang Chi Neang	031307
03130703	គោកទ្រាកើត	Kouk Trea Kaeut	031307
03130704	គោកទ្រាលិច	Kouk Trea Lech	031307
03130705	ស្ដុកអន្ទង់	Sdok Antong	031307
03130706	តាចាក់	Ta Chak	031307
03130707	មេមាំង	Me Meang	031307
03130708	តាំងគោក	Tang Kouk	031307
03130709	ល្វា	Lvea	031307
03130710	តាំងត្រពាំង	Tang Trapeang	031307
03130801	ទួលព្រិច	Tuol Prich	031308
03130802	អូរសង្កែ	Ou Sangkae	031308
03130803	កេះ	Keh	031308
03130804	ត្រពាំងឈូក	Trapeang Chhuk	031308
03130805	ណាំកិន	Nam Ken	031308
03130806	មៀន	Mien	031308
03130807	ទួលពោន	Tuol Poun	031308
03130808	ផ្កាយព្រឹក	Phkay Proek	031308
03130809	កំពង់សំរិត	Kampong Samret	031308
03130810	ក្រសាំងពុល	Krasang Pul	031308
03130811	ដំណាក់ពង្រ	Damnak Pongro	031308
03130812	កំពង់សំណាញ់	Kampong Samnanh	031308
03130813	អូរតានៅ	Ou Ta Nov	031308
03130814	ដីក្រហម	Dei Kraham	031308
03130815	ឃ្លោយទី ១	Khlouy Ti Muoy	031308
03130816	ឃ្លោយទី ២	Khlouy Ti Pir	031308
03130817	ឃ្លោយទី ៣	Khlouy Ti Bei	031308
03130818	ឃ្លោយទី ៤	Khlouy Ti Buon	031308
03130819	ត្រើង	Traeung	031308
03130901	ព្រៃឈរ	Prey Chhor	031309
03130902	សេកយំ	Sek Yum	031309
03130903	ជ្រេស	Chres	031309
03130904	សង្កែ	Sangkae	031309
03131001	សូរ្យសែន	Sour Saen	031310
03131002	អណ្ដូង	Andoung	031310
03131003	ត្រពាំងរាំង	Trapeang Reang	031310
03131004	ត្រពាំងត្នោត	Trapeang Tnaot	031310
03131005	ត្រើយអូរ	Traeuy Ou	031310
03131006	ត្រពាំងត្បាល់	Trapeang Tbal	031310
03131007	ចំបក់ថ្ម	Chambak Thma	031310
03131008	ស្វាយរ័ក្ស	Svay Reaks	031310
03131101	បន្ទាយថ្មី	Banteay Thmei	031311
03131102	តាក្រិត	Ta Kret	031311
03131103	កណ្ដោលកោង	Kandaol Kaong	031311
03131104	ឫស្សី	Ruessei	031311
03131105	ស្វាយព្រៃ	Svay Prey	031311
03131106	សំរោង	Samraong	031311
03131107	សូដី	Soudei	031311
03131108	ថ្មី	Thmei	031311
03131109	វាល	Veal	031311
03131110	ស្មេរ	Smer	031311
03131111	ព្រៃខ្ជាយ	Prey Khchay	031311
03131201	ស្រង៉ែជើង	Srangae Cheung	031312
03131202	ស្រង៉ែត្បូង	Srangae Tboung	031312
03131203	សេនសុនត្បូង	Senson Tboung	031312
03131204	សេនសុនជើង	Senson Cheung	031312
03131205	តាសរ	Ta Sar	031312
03131206	តាកុច	Ta Koch	031312
03131207	ត្រពាំងធំ	Trapeang Thum	031312
03131208	ត្រពាំងរូង	Trapeang Rung	031312
03131301	ត្រាំង	Trang	031313
03131302	អណ្ដូងតាពេជ្រ	Andoung Ta Pech	031313
03131303	ត្រពាំងបឹង	Trapeang Boeng	031313
03131304	ទួលថ្ម	Tuol Thma	031313
03131305	លិចវត្ដ	Lech Voat	031313
03131306	អណ្ដូងផ្ដៅ	Andoung Phdau	031313
03131307	ថ្មពូនកណ្ដាល	Thma Pun Kandal	031313
03131308	អណ្ដូងតាឡឹង	Andoung Ta Loeng	031313
03131309	អូរតាថុក	Ou Ta Thok	031313
03131401	តុងរ៉ុង	Tong Rong	031314
03131402	ផ្ទះខ្ពស់	Phteah Khpos	031314
03131403	ធ្នង់	Thnong	031314
03131404	ប្រាសាទ	Prasat	031314
03131405	សំរោង	Samraong	031314
03131406	ព្រះស្រុក	Preah Srok	031314
03131407	គកកណ្ដាល	Kok Kandal	031314
03131408	ទ្រមុខទី ១	Tro Mukh Ti Muoy	031314
03131409	ទ្រមុខទី ២	Tro Mukh Ti Pir	031314
03131410	ដូង	Doung	031314
03131501	កោះស្វាយ	Kaoh Svay	031315
03131502	ព្រីងបីដើម	Pring Bei Daeum	031315
03131503	ចចក	Chachak	031315
03131504	ព្រៃស្រឡៅ	Prey Sralau	031315
03131505	ពួនប្រម៉ាត់	Puon Pramat	031315
03131506	គូរ	Kur	031315
03131507	ស្បែង	Sbaeng	031315
03131508	ព្រៃស្រឡាញ	Prey Sralanh	031315
03131509	ត្រពាំងល័ក្ខ	Trapeang Leak	031315
03131510	អូរដា	Ou Da	031315
03131511	ត្រពាំងរាំង	Trapeang Reang	031315
03131512	ទួលអំពិល	Tuol Ampil	031315
03131513	តាលន	Ta Lon	031315
03131514	កោះកាភេម	Kaoh Kaphem	031315
03131515	ត្រពាំងស្វាយ	Trapeang svay	031315
03131516	អង	Ang	031315
03131517	ដូង	Doung	031315
03131518	ទន្លេស	Tonle Sa	031315
03131519	កកោះ	Kakaoh	031315
03131520	អូរដូនញា	Ou Doun Nhea	031315
03131521	ខ្វាវ	Khvav	031315
03131522	ដីឡូតិ៍	Dei Lou	031315
03131523	រលួស	Roluos	031315
03131524	ត្រពាំងក្រសាំង	Trapeang Krasang	031315
03140101	ស្យាបឹងវែង	Sya Boeng Veaeng	031401
03140102	ស្យាអំពិល	Sya Ampil	031401
03140103	បន្ទាយ	Banteay	031401
03140104	កំផ្លាក	Kamphlak	031401
03140201	ខ្នុរដូង	Khnor Doung	031402
03140202	ស្លែង	Slaeng	031402
03140203	ជីបាល	Chi Bal	031402
03140204	តាំងក្រាំង	Tang Krang	031402
03140205	ខ្យោង	Khyaong	031402
03140301	អង់	Ang	031403
03140302	ក្ងោក	Kngaok	031403
03140303	ទ្រារស	Trea Sa	031403
03140304	ខ្នារ	Khnar	031403
03140305	អំពិល	Ampil	031403
03140401	ក្បាលកោះ	Kbal Kaoh	031404
03140402	គគីរ	Kokir	031404
03140403	ចុងកោះ	Chong Kaoh	031404
03140404	ក្រូចសើច	Krouch Saeuch	031404
03140501	វាល	Veal	031405
03140502	មាន់ដប់លើ	Moan Dab Leu	031405
03140503	មាន់ដប់ក្រោម	Moan Dab Kraom	031405
03140504	កោះគោ	Kaoh Kou	031405
03140505	ជ័យ	Chey	031405
03140506	សំរោង	Samraong	031405
03140507	ប៉ុកប៉ែន	Pok Paen	031405
03140601	អូលាវ	Ou Leav	031406
03140602	ផ្ទះកណ្ដាលលើ	Phteah Kandal Leu	031406
03140603	ផ្ទះកណ្ដាលក្រោម	Phteah Kandal Kraom	031406
03140604	ចុងបឹងក្រៅ	Chong Boeng Krau	031406
03140701	ប្រាំយ៉ាម	Pram Yam	031407
03140702	ក្ដីថ្ក	Kdei Thka	031407
03140703	ជើងដឹក	Cheung Doek	031407
03140704	ជីប្រាយ	Chi Pray	031407
03140801	តាកយ	Ta Kay	031408
03140802	តាម៉ឺន	Ta Meun	031408
03140803	តាមល់	Ta Mol	031408
03140804	ចុងបឹងក្នុង	Chong Boeng Knong	031408
03140805	ព្រែកដំបូកក្រោម	Preaek Dambouk Kraom	031408
03140806	ព្រែកដំបូកលើ	Preaek Dambouk Leu	031408
03140807	ស្វាយម៉ូ	Svay Mou	031408
03140808	អំពិល	Ampil	031408
03140809	ផ្ទះវាល	Phteah Veal	031408
03140901	រកាទ្វារ	Roka Tvear	031409
03140902	ព្រែកពោធិ៍លើ	Preaek Pou Leu	031409
03140903	ព្រែកពោធិ៍ក្រោម	Preaek Pou Kraom	031409
03140904	ច្រស់	Chras	031409
03140905	ប្រថ្នល់	Prathnal	031409
03140906	គោកចារ	Kouk Char	031409
03140907	សន្ទៃ	Santey	031409
03140908	ថ្មដា	Thma Da	031409
03140909	ទូរីលើ	Turi Leu	031409
03140910	ទូរីកណ្ដាល	Turi Kandal	031409
03140911	ទូរីក្រោម	Turi Kraom	031409
03140912	ព្រៃត្បេះ	Prey Tbeh	031409
03141001	ក្សេរ	Kser	031410
03141002	អូឡេង	Ou Leng	031410
03141003	ត្នោត "ក"	Tnaot Ka	031410
03141004	ត្នោត "ខ"	Tnaot Kha	031410
03141005	ព្រែករំដេង "ក"	Preaek Rumdeng Ka	031410
03141006	ព្រែករំដេង "ខ"	Preaek Rumdeng Kha	031410
03141007	ព្រែករំដេង "គ"	Preaek Rumdeng Kho	031410
03141008	ព្រែកឪជ្រឹង "ក"	Preaek Ouv Chrueng Ka	031410
03141009	ព្រែកឪជ្រឹង "ខ"	Preaek Ouv Chrueng Kha	031410
03141010	ស្វាយតានាន់ "ក"	Svay Ta Noan Ka	031410
03141011	ស្វាយតានាន់ "ខ"	Svay Ta Noan Kha	031410
03141012	កំពង់ព្នៅ	Kampong Pnov	031410
03141013	តាកុច	Ta Koch	031410
03141014	តាង៉កថ្មី	Ta Ngak Thmei	031410
03141101	ត្នោតក្រោម	Tnaot Kraom	031411
03141102	ព្រៃទទឹង	Prey Totueng	031411
03141103	ឫស្សីស្រុក	Ruessei Srok	031411
03141104	ត្នោតលើ	Tnaot Leu	031411
03141201	ពោធិ៍	Pou	031412
03141202	ស្វាយ	Svay	031412
03141203	ជីប៉ោ	Chi Pao	031412
03141204	ទាហ៊ា	Tea Hea	031412
03141205	ទ្រា	Trea	031412
03141206	ខ្វិត	Khvet	031412
03141301	ស្វាយលើ	Svay Leu	031413
03141302	ស្វាយកណ្ដាល	Svay Kandal	031413
03141303	ស្វាយត្បូង	Svay Tboung	031413
03141304	ស្វាយក្រោម	Svay Kraom	031413
03141401	ទងត្រឡាច	Tong Tralach	031414
03141402	បឹងទីង	Boeng Ting	031414
03141403	ខ្ទឹង	Khtueng	031414
03141404	ចន្លាត់ដៃ	Chonloat Dai	031414
03150101	អារក្សត្នោត	Areaks Tnaot	031501
03150102	ល្វា	Lvea	031501
03150103	គីឡូ​ ៧	Kilou Prampir	031501
03150104	គីឡូ ១០	Kilou Dab	031501
03150105	បែកអន្លូង	Baek Anlung	031501
03150301	សន្ទិចកើត	Santich Kaeut	031503
03150302	សន្ទិចលិច	Santich Lech	031503
03150303	សន្ទិចកណ្ដាល	Santich Kandal	031503
03150304	ហុងប្រម៉ា	Hong Prama	031503
03150305	ជ្រៃហាយ	Chrey Hay	031503
03150306	ថ្មី	Thmei	031503
03150307	ស្រែរំដួល	Srae Rumduol	031503
03150308	តារៀម	Ta Riem	031503
03150309	ស្ដៅ	Sdau	031503
03150310	អូរពីរ	Ou Pir	031503
03150401	អូររុន	Ou Run	031504
03150402	អន្លង់សំឡី	Anlong Samlei	031504
03150403	ព្រែកទក់	Preaek Tok	031504
03150404	ខ្ពបតាងួន	Khpob Ta Nguon	031504
03150405	ឈើទើ	Chheu Teu	031504
03150406	វាលបំពង់	Veal Bampong	031504
03150501	អូរលើ	Ou Leu	031505
03150502	ក្បាលអូរ	Kbal Ou	031505
03150503	បុសពោធិ	Bos Pou	031505
03150504	អូរបេង	Ou Beng	031505
03150505	ត្រពាំងឈូក	Trapeang Chhuk	031505
03150601	ខ្ទួយទី១	Khtuoy Ti Muoy	031506
03150602	ខ្ទួយទី២	Khtuoy Ti Pir	031506
03150603	ខ្ទួយទី ៣	Khtuoy Ti Bei	031506
03150604	ខ្ទួយទី ៤	Khtuoy Ti Buon	031506
03150605	អូរប្រឡោះ	Ou Pralaoh	031506
03150606	អូរកាប់មាន់	Ou Kab Moan	031506
03150607	អូរឫស្សី	Ou Ruessei	031506
03150608	អូរតាសេក	Ou Ta Sek	031506
03150609	សំរោង	Samraong	031506
03150610	ប្រទង	Pratong	031506
03150611	បិទធ្នូ	Bet Thnu	031506
03150612	ស្ពង់សាខាថ្មី	Spong Sakha Thmei	031506
03150613	ស្ពង់សាខាចាស់	Spong Sakha Chas	031506
03150701	ពាមក្រៅ	Peam Krau	031507
03150702	ពាមក្នុង	Peam Knong	031507
03150703	ដីលើ	Dei Leu	031507
03150704	ទួលរការ	Tuol Rokar	031507
03150705	ដីដុះ	Dei Doh	031507
03150706	ព្រែកសង្កែកើត	Preaek Sangkae Kaeut	031507
03150707	ព្រែកសង្កែលិច	Preaek Sangkae Lech	031507
03150708	កោះកណ្ដាល	Kaoh Kandal	031507
03150709	ស្រែសង្កែ	Srae Sangkae	031507
03150801	ព្រែកស្ដី	Preaek Sdei	031508
03150802	ព្រះអណ្ដូង ទី ១	Preah Andoung Ti Muoy	031508
03150803	ព្រះអណ្ដូង ទី ២	Preah Andoung Ti Pir	031508
03150901	ព្រែកបាក់	Preaek Bak	031509
03150902	ព្រែកកក់	Preaek Kak	031509
03150903	ព្រែករលួស	Preaek Roluos	031509
03150904	ព្រែកព្រះអង្គ	Preaek Preah Angk	031509
03151001	អណ្ដូងពេជ្រ	Andoung Pech	031510
03151002	មាឃ ១	Meakh Muoy	031510
03151003	មាឃ ២	Meakh Pir	031510
03151004	ត្នោតតាសាយ	Tnaot Ta Say	031510
03151005	បឹងកាចូត	Boeng Kachout	031510
03151006	អូរប្រាំទី ២	Ou Pram Ti Pir	031510
03151007	ទួលពោធិ៍	Tuol Pou	031510
03151008	ព្រះ	Preah	031510
03151009	ភ្នំមន្ទីរ	Phnum Montir	031510
03151010	ព្រែកបារាំង	Preaek Barang	031510
03151011	បឹងដែង	Boeng Daeng	031510
03151012	ភ្នំអំពិល	Phnum Ampil	031510
03151013	បឹងកេតលើ	Boeng Ket Leu	031510
03151014	បឹងកេតក្រោម	Boeng Ket Kraom	031510
03151015	ភូមិ ៥៦	Phum Haprammuoy	031510
03151016	ចេកជ្វា	Chek Chvea	031510
03151017	អូរចក	Ou Chak	031510
03151018	ភូមិ គីឡូ ៣	Phum Kilou Bei	031510
03151019	ភូមិ ៣៥	Phum Sampram	031510
03151020	ភូមិ ៧០	Phum Chetseb	031510
03151021	អូរប្រាំទី១	Ou Pram Ti Muoy	031510
03151022	មាឃ ៣	Meakh Bei	031510
03151023	អណ្ដូងស្វាយ	Andoung Svay	031510
03151201	សូភាស	Soupheas	031512
03151202	អង្កោល	Angkaol	031512
03151203	ស្រប	Srab	031512
03151204	ប៉ប្រក	Paprak	031512
03151205	សំបូរ	Sambour	031512
03151206	ដីក្រហម	Dei Kraham	031512
03151207	ទ័ព	Toap	031512
03151301	ធំ	Thum	031513
03151302	ថ្មី	Thmei	031513
03151303	តាមើង	Ta Meung	031513
03151304	វត្ដ	Voat	031513
03151305	ដូនទរ	Doun Tor	031513
03151306	សំពៀងលើ	Sampieng Leu	031513
03151307	សំពៀងក្រោម	Sampieng Kraom	031513
03151401	ទួលសំបួរ	Tuol Sambuor	031514
03151402	ពោន	Poun	031514
03151403	ស្រែអំពៅ	Srae Ampov	031514
03151404	វាលព្រះ	Veal Preah	031514
04010101	អញ្ចាញរូង	Anhchanh Rung	040101
04010102	អណ្ដូងរវៀង	Andoung Rovieng	040101
04010103	ដំរីកូន	Damrei Koun	040101
04010104	ព្រៃព្រាល	Prey Preal	040101
04010105	ស្ទឹងថ្មី	Stueng Thmei	040101
04010106	ថ្លុកជ្រៅ	Thlok Chrov	040101
04010201	ឆ្នុកទ្រូ	Chhnok Tru	040102
04010202	កំពង់ព្រះ	Kampong Preah	040102
04010203	សេះស្លាប់	Seh Slab	040102
04010301	តាប៉ាង	Ta Pang	040103
04010302	ពោម្រះ	Pou Mreah	040103
04010303	អូររំចេក	Ou Rumchek	040103
04010304	ចក	Chak	040103
04010305	ដង្ខៅម៉ៅ	Dangkhau Mau	040103
04010401	ស្នោ	Snao	040104
04010402	ដើមជ្រែ	Daeum Chreae	040104
04010403	សិរី	Serei	040104
04010404	ល្បើក	Lbaeuk	040104
04010405	កន្សែង	Kansaeng	040104
04010406	ដក់ពរ	Dak Por	040104
04010407	គក	Kok	040104
04010408	ពពេល	Popel	040104
04010409	ត្រពាំងពោធិ៍	Trapeang Pou	040104
04010410	កំពង់អួរ	Kampong Uor	040104
04010501	ព្រែកស្ពាន	Preaek Spean	040105
04010502	កោះតាម៉ូវ	Kaoh Ta Mouv	040105
04010503	ស្ទឺងជ្រៅ	Stueng Chrov	040105
04010504	ដំណាក់រាជ្យ	Damnak Reach	040105
04010601	ស្រះកែវ	Srah Kaev	040106
04010602	ទួលធ្លក	Tuol Thlok	040106
04010603	មេលំ	Melum	040106
04010604	កាន់យួរ	Kan Yuor	040106
04010605	ទួលរការ	Tuol Rokar	040106
04010701	ក្បាលថ្នល់	Kbal Thnal	040107
04010702	កំព្រង	Kamprong	040107
04010703	ផ្សារ	Phsar	040107
04010704	ថ្មី	Thmei	040107
04010705	ជំទាវបុត្រី	Chumteav Botrei	040107
04010706	ព្រៃតាមូង	Prey Ta Mung	040107
04010707	ភ្នៀត	Phniet	040107
04010801	តាំងធ្នឹម	Tang Thnuem	040108
04010802	តាំងត្រពាំង	Tang Trapeang	040108
04010803	ល្វា	Lvea	040108
04010804	ក្រាំងកកោះ	Krang Kakaoh	040108
04010805	ទឹកជ្រាប់	Tuek Chroab	040108
04010806	ថ្នល់	Thnal	040108
04010901	ជាងហ្លួង	Cheang Luong	040109
04010902	អូរ	Ou	040109
04010903	ទួលពោធិ៍	Tuol Pou	040109
04010904	ក្រោលជី	Kraol Chi	040109
04010905	បុសមាស	Bos Meas	040109
04010906	សាលាឃុំ	Sala Khum	040109
04010907	ក្រាំងខ្មែរ	Krang Khmer	040109
04010908	អង្គ	Angk	040109
04011001	ពន្លៃ	Ponley	040110
04011002	ជើងខ្នារ	Cheung Khnar	040110
04011003	កែវឡាត	Kaev Lat	040110
04011004	ស្វាយគយ	Svay Koy	040110
04011005	អូរ	Ou	040110
04011006	ជាងហ្លួង	Cheang Luong	040110
04011101	ត្រពាំងចាន់	Trapeang Chan	040111
04011102	កណ្ដាល	Kandal	040111
04011103	សន្លង់	Sanlang	040111
04011104	ក្បាលដំរី	Kbal Damrei	040111
04020101	កំពង់ខ្លាញ់	Kampong Khlanh	040201
04020102	ទន្លេក្រៅ	Tonle Krau	040201
04020103	ឫស្សីដង្គួច	Ruessei Dangkuoch	040201
04020104	ព្រែកទ្រព្យ	Preaek Trop	040201
04020105	កំពង់បាស្រូវ	Kampong Ba Srov	040201
04020106	កំពង់បាស្រូវត្បូង	Kampong Ba Srov Tboung	040201
04020201	បត់ត្រង់	Bat Trang	040202
04020202	កោះលត	Kaoh Lot	040202
04020203	កោះស្លែង	Kaoh Slaeng	040202
04020204	ពាមពពេច	Peam Popech	040202
04020205	តាមលលើ	Ta Mol Leu	040202
04020206	កោះថ្កូវ	Kaoh Thkov	040202
04020207	តាមលក្រោម	Ta Mol Kraom	040202
04020208	គជ្រុំ	Ko Chrum	040202
04020209	ដងទង់	Dang Tong	040202
04020210	ពាមជ្រៃ	Peam Chrey	040202
04020301	កំពង់អុស	Kampong Os	040203
04020302	កៀនតាម៉ា	Kien Ta Ma	040203
04020303	ថ្មី	Thmei	040203
04020304	ព្រែកឆ្ដោ	Preaek Chhdaor	040203
04020401	ពាមឆ្កោក	Peam Chhkaok	040204
04020402	អន្លង់មេត្រី	Anlong Metrei	040204
04020403	ភ្លង	Phlong	040204
04020404	ក្បាលកន្លង់	Kbal Kanlang	040204
04020501	ព្រៃគ្រីត្បូង	Prey Kri Tboung	040205
04020502	កោះធំ	Kaoh Thum	040205
04020503	ព្រៃគ្រីជើង	Prey Kri Cheung	040205
04020504	ជំពារ	Chum Pear	040205
04020505	តាកាន់	Ta Khan	040205
04030101	ផ្សារលើ	Phsar Leu	040301
04030102	ផ្សារឆ្នាំង	Phsar Chhnang	040301
04030103	ចុងកោះ	Chong Kaoh	040301
04030104	សំរោង	Samraong	040301
04030105	កោះក្របី	Kaoh Krabei	040301
04030106	ត្រពាំងបី	Trapeang Bei	040301
04030107	កំពង់អុស	Kampong Os	040301
04030108	កណ្ដាល	Kandal	040301
04030201	ស្រែព្រីង	Srae Pring	040302
04030202	ដំណាក់ពពូល	Damnak Popul	040302
04030203	ឡទឹកត្រី	La Tuek Trei	040302
04030204	កណ្ដាល	Kandal	040302
04030205	ត្រពាំងចឹកសា	Trapeang Choek Sa	040302
04030206	ទួលក្រឡាញ់	Tuol Kralanh	040302
04030301	ប្អេរ	B'er	040303
04030302	ធម្មយុត្ដិ	Thommeak Yutt	040303
04030303	ម៉ុងបារាំង	Mong Barang	040303
04030304	ឃ្លាំងប្រាក់	Khleang Prak	040303
04030401	ទី១	Ti Muoy	040304
04030402	ទី២	Ti Pir	040304
04030403	ទី៣	Ti Bei	040304
04030404	ទី៤	Ti Buon	040304
04030405	ទី៥	Ti Pram	040304
04030406	ទី៦	Ti Prammuoy	040304
04030407	ទី៧	Ti Prampir	040304
04030408	ទី៨	Ti Prambei	040304
04040101	កង្កែប	Kangkaeb	040401
04040102	ធ្លក	Thlok	040401
04040103	ឯលិច	Ae Lech	040401
04040104	កណ្ដាល	Kandal	040401
04040201	ដារ	Dar	040402
04040202	ថ្នល់	Thnal	040402
04040203	ជ្រលង	Chrolong	040402
04040204	ប្រាសាទ	Prasat	040402
04040205	គុយ	Kuy	040402
04040301	កំពង់បឹង	Kampong Boeng	040403
04040302	កែងតាសុខ	Kaeng Ta Sokh	040403
04040303	ត្អួរលំ	T'uor lum	040403
04040304	ស្ទឹងសណ្ដែក	Stueng Sandaek	040403
04040305	កោះក្អែក	Kaoh K'aek	040403
04040306	ដូនវៀត	Doun Viet	040403
04040401	ថ្នល់ឈើទាល	Thnal Chheu Teal	040404
04040402	ពាមខ្នង	Peam Khnang	040404
04040403	ស្លត	Slat	040404
04040501	ពោធិ៍	Pou	040405
04040502	សំរោង	Samraong	040405
04040503	ពាមទន្លា	Peam Tonlea	040405
04040504	ថ្មី	Thmei	040405
04040505	ដំណាក់កកោះ	Damnak Kakaoh	040405
04040506	កំពង់បាចិន	Kampong Ba Chen	040405
04040601	ប្រឡាយមាស	Pralay Meas	040406
04040602	ក្រងផ្ដិល	Krang Phtel	040406
04040603	ក្រម៉ាល់	Kramal	040406
04040604	អន្លង់កញ្ចុះ	Anlong Kanhchoh	040406
04040605	តាដោក	Ta Daok	040406
04040606	កោះឫស្សី	Kaoh Ruessei	040406
04040701	សំរោងសែន	Samraong Saen	040407
04040702	ប៉ប្រក	Paprak	040407
04040801	ចំបក់ខ្ពស់	Chambak Khpos	040408
04040802	ក្នុង	Knong	040408
04040803	ជើងគ្រួស	Cheung Kruos	040408
04040804	ល្វា	Lvea	040408
04040805	តាឡាត់	Ta Lat	040408
04040901	ត្រងិល	Trangel	040409
04040902	ត្របែក	Trabaek	040409
04040903	ច្រេស	Chres	040409
04040904	ទំនប់	Tumnob	040409
04040905	ត្រពាំងមាស	Trapeang Meas	040409
04040906	អណ្ដូងរនុក	Andoung Ronuk	040409
04040907	ខ្លែងពណ៌	Khlaeng Poar	040409
04050101	ស្ទឹងស្ងួត	Stueng Snguot	040501
04050102	គៀនឃ្លាំង	Kien Khleang	040501
04050103	វាលស្បូវ	Veal Sbov	040501
04050104	ក្អែកពង	K'aek Pong	040501
04050105	អំពិលទឹក	Ampil Tuek	040501
04050106	បែកចាន	Baek Chan	040501
04050107	អូរម៉ាល់	Ou Mal	040501
04050108	បាក់ភ្នំ	Bak Phnum	040501
04050109	ក្បាលកោះ	Kbal Kaoh	040501
04050110	ខ្លាគ្រហឹម	Khla Krohuem	040501
04050111	ស្ដីបន្លិច	Sdei Banlich	040501
04050201	អណ្ដូងត្រមូង	Andoung Tramung	040502
04050202	ច្រករមៀត	Chrak Romiet	040502
04050203	ព្រៃពិស	Prey Pis	040502
04050204	ព្រៃពារ	Prey Pear	040502
04050205	ស្នាពេជ្រ	Snar Pechr	040502
04050206	ឈូកក្រញ៉ាស់	Chhuk Kranhas	040502
04050207	ក្រសះថ្មី	Krasah Thmei	040502
04050208	ត្រពាំងជ្រៅ	Trapeang Chrov	040502
04050209	ត្រពាំងខ្ទុំ	Trapeang Khtum	040502
04050210	ទួល	Tuol	040502
04050211	អូររូង	Ou Rung	040502
04050212	ស្ដុកលិច	Sdok Lech	040502
04050213	ស្រែសារ	Srae Sar	040502
04050214	ជ្រលងកៃស្នា	Chrolong Kaisna	040502
04050301	ត្រពាំងភ្នៅ	Trapeang Pnov	040503
04050302	សេរីឆោម	Serei Chhaom	040503
04050303	វាលល្វៀង	Veal Lvieng	040503
04050304	អូរ	Ou	040503
04050305	ជំទាវសុខ	Chumteav Sokh	040503
04050306	សារាយអណ្ដែត	Saray Andaet	040503
04050307	កញ្ជោង	Kanhchoung	040503
04050308	ព្រៃពិស	Prey Pis	040503
04050309	ក្បាលដំរី	Kbal Damrei	040503
04050310	ប្របផ្ទះ	Prab Phteah	040503
04050311	ច្រមុះជ្រូក	Chramoh Chruk	040503
04050312	ចក	Chak	040503
04050313	ដកស្និត	Dak Snet	040503
04050314	ជំទាវ	Chumteav	040503
04050401	កំពង់ត្រឡាចលើ	Kampong Tralach Leu	040504
04050402	កំពង់ត្រឡាចក្រោម	Kampong Tralach Kraom	040504
04050403	អ្នកតាហាង	Neak Ta Hang	040504
05011112	មីលាវ	Mi Leav	050111
04050404	សំរិទ្ធិជ័យ	Samretthi Chey	040504
04050405	ព្រែកគន្លង	Preaek Kanlang	040504
04050406	កំពង់ក្ដារ	Kampong Kdar	040504
04050407	គៀនរការ	Kien Roka	040504
04050501	ឧកញ៉ាប៉ាង	Oknha Pang	040505
04050502	ត្រពាំងចំបក់	Trapeang Chambak	040505
04050503	ផ្សារត្រាច	Phsar Trach	040505
04050504	អន្លង់ត្នោត	Anlong Tnaot	040505
04050505	ស្រះចក	Srah Chak	040505
04050506	វត្ដ	Voat	040505
04050507	ត្រពាំងសំរោង	Trapeang Samraong	040505
04050508	បឹងកក់	Boeng Kak	040505
04050601	ច្រករមៀត	Chrak Romiet	040506
04050602	សាលាលេខប្រាំ	Sala Lekh Pram	040506
04050603	អូរឫស្សី	Ou Ruessei	040506
04050604	ស្រែប្រិយ៍	Srae Prei	040506
04050605	ចាន់កៀក	Chan Kiek	040506
04050606	ក្រឡាញ់	Kralanh	040506
04050607	ធ្នង់	Thnong	040506
04050608	លាជ	Leach	040506
04050701	កាអត	Ka At	040507
04050702	សុបិន	Soben	040507
04050703	តាកុល	Ta Kol	040507
04050704	ស្ទឹង	Stueng	040507
04050705	ព្រៃសាក់	Prey Sak	040507
04050706	ពានី	Peani	040507
04050707	គក	Kok	040507
04050708	ទួលសេរី	Tuol Serei	040507
04050709	ក្រាំងតាឯក	Krang Ta Aek	040507
04050801	ខ្នាយកកោះ	Khnay Kakaoh	040508
04050802	ទឹកល្អក់	Tuek L'ak	040508
04050803	ក្បាលថ្នល់	Kbal Thnal	040508
04050804	តាសុខ	Ta Sokh	040508
04050805	តាសូ	Ta Sou	040508
04050806	ដូនទយ	Doun Toy	040508
04050807	តាណុប	Ta Nob	040508
04050808	ចំបក់ផ្អែម	Chambak Ph'aem	040508
04050809	ក្រឡាញ់	Kralanh	040508
04050810	កំពង់ប្រាសាទ	Kampong Prasat	040508
04050811	ប្រវឹកពង	Pravoek Pong	040508
04050812	ខ្នាយកកោះថ្មី	Khnay Kakaoh Thmei	040508
04050901	បឹងកក់	Boeng Kak	040509
04050902	ឡពាង	La Peang	040509
04050903	អូររូង	Ou Rung	040509
04050904	សំរោង	Samraong	040509
04050905	ស្វាយក្រោម	Svay Kraom	040509
04050906	សូវង្ស	Souvong	040509
04050907	ស្នាយ	Snay	040509
04050908	ស្វាយបាកាវ	Svay Bakav	040509
04050909	វត្ដថ្មី	Voat Thmei	040509
04050910	ធ្លកយល់	Thlok Yol	040509
04050911	តាកោះ	Ta Kaoh	040509
04050912	ត្រពាំងព្រាល	Trapeang Preal	040509
04050913	បន្ទាយមាស	Banteay Meas	040509
04050914	សំព័រ	Sampoar	040509
04050915	តាជេស	Ta Ches	040509
04051001	ដើមពពេល	Daeum Popel	040510
04051002	ស្នងមុំ	Snang Mom	040510
04051003	ថ្មឥដ្ឋ	Thma Edth	040510
04051004	គរ	Kor	040510
04051005	ត្រពាំងក្ដារ	Trapeang Kdar	040510
04060101	ស្ពករាជ្យ	Spok Reach	040601
04060102	អណ្ដូងស្នាយ	Andoung Snay	040601
04060103	អណ្ដូងជ្រៃ	Andoung Chrey	040601
04060104	ចារថ្មី	Char Thmei	040601
04060105	ត្បែង	Tbaeng	040601
04060107	បំពង់ផ្ចឹក	Bampong Phchoek	040601
04060201	ព្រាល	Preal	040602
04060202	ថ្មរាប	Thma Reab	040602
04060203	ផ្លូវគោ	Phlov Kou	040602
04060204	ទ័ពស្រូវ	Toap Srov	040602
04060205	ទ័ពត្បែង	Toap Tbaeng	040602
04060206	ឈើនាគ	Chheu Neak	040602
04060207	ស្ដុកកប្បាស	Sdok Kabbas	040602
04060208	ត្រពាំងផ្គាំ	Trapeang Phkoam	040602
04060209	អូរលាជ	Ou Leach	040602
04060210	ឫស្សីដួច	Ruessei Duoch	040602
04060301	តាលោ	Ta Lou	040603
04060302	ត្រពាំងពពេល	Trapeang Popel	040603
04060303	ព្រីងកោង	Pring Kaong	040603
04060304	ហ្លួង	Luong	040603
04060305	អណ្ដូងចេក	Andoung Chek	040603
04060306	ទឹកចេញ	Tuek Chenh	040603
04060307	សូភី	Souphi	040603
04060308	តាំងបំពង់	Tang Bampong	040603
04060309	ដំណាក់កី	Damnak Kei	040603
04060310	ខ្នាចកកោះ	Khnach Kakaoh	040603
04060311	អូរលយ	Ou Loy	040603
04060401	ទួលខ្សាច់	Tuol Khsach	040604
04060402	ព្រៃកោះ	Prey Kaoh	040604
04060403	ព្រៃពួច	Prey Puoch	040604
04060404	ថ្មី	Thmei	040604
04060405	ថ្នល់ថ្មី	Thnal Thmei	040604
04060406	ជ្រៃបាក់	Chrey Bak	040604
04060407	អូរកំណប់	Ou Kamnab	040604
04060408	អូរកណ្ដោល	Ou Kandaol	040604
04060409	ព្រៃលាក់នាង	Prey Leak Neang	040604
04060410	បាញ់ឆ្គោល	Banh Chhkoul	040604
04060411	ត្រពាំងអន	Trapeang An	040604
04060412	ឃ្លៃ	Khley	040604
04060413	អាឡែង	Alaeng	040604
04060414	ត្រពាំងគរ	Trapeang Kor	040604
04060415	ព្រះរាមរង្សី	Preah Ream Reangsei	040604
04060416	អូររោង	Ou Roung	040604
04060501	គោកបន្ទាយ	Kouk Banteay	040605
04060502	ពពេលពក	Popel Pok	040605
04060503	មានជ័យ	Mean Chey	040605
04060504	ទ្រនាមពេជ្រ	Troneam Pech	040605
04060505	អូរតាសេក	Ou Ta Sek	040605
04060506	ឈើត្រាច	Chheu Trach	040605
04060507	កងមាស	Kang Meas	040605
04060508	កន្លែងភេ	Kanlaeng Phe	040605
04060601	ក្រាំងលាវ	Krang Leav	040606
04060602	ថ្មី	Thmei	040606
04060603	ទឹកល្អក់	Tuek L'ak	040606
04060604	ប៉ាតឡាង	Pat Lang	040606
04060605	បឹងវែង	Boeng Veaeng	040606
04060606	ស្រែវាល	Srae Veal	040606
04060607	ជ្រលងកក់	Chrolong Kak	040606
04060608	អណ្ដូងប្រេង	Andoung Preng	040606
04060701	ត្រពាំងពោធិ៍	Trapeang Pou	040607
04060702	ខ្វិត	Khvet	040607
04060703	ស្រាងខ្ពស់	Srang Khpos	040607
04060704	ភ្នំតូច	Phnum Touch	040607
04060705	សន្ទៃ	Santey	040607
04060706	ដក់គ្រង	Dak Krong	040607
04060707	អណ្ដូងពោធិ៍	Andoung Pou	040607
04060708	ថ្មី	Thmei	040607
04060709	ប្រាំបីឆោម	Prambei Chhaom	040607
04060710	ត្រពាំងធំ	Trapeang Thum	040607
04060711	ថ្មរាប	Thma Reab	040607
04060712	ទ័ពត្បែង	Toap Tbaeng	040607
04060801	ព្រៃសំពៅ	Prey Sampov	040608
04060802	ជន្លាវ	Chonleav	040608
04060803	សាអង	S​a ang	040608
04060804	ស្រងាំទេរ	Srangam Ter	040608
04060805	ត្រពាំងអំពិល	Trapeang Ampil	040608
04060806	ប្រស្នឹប	Prasnoeb	040608
04060807	ជរ	Chor	040608
04060901	ព្រៃក្រោល	Prey Kraol	040609
04060902	ព្រៃមូល	Prey Mul	040609
04060903	ប្រច័ក្ស	Prachak	040609
04060904	ត្រពាំងក្រវ៉ាន់	Trapeang Kravan	040609
04060905	ត្រពាំងតាសុខ	Trapeang Ta Sokh	040609
04060906	តាវ៉ាក	Ta Vak	040609
04060907	ក្លែងពណ៌	Klaeng Poar	040609
04061001	គ្រួស	Kruos	040610
04061002	ព្រៃខ្មែរ	Prey Khmer	040610
04061003	អណ្ដូងច្រុះ	Andoung Chroh	040610
04061004	ជារៅ	Chea Rov	040610
04061005	ត្រពាំងត្រាច	Trapeang Trach	040610
04061006	អូរតានេស	Ou Ta Nes	040610
04061101	ក្ដីត្នោត	Kdei Tnaot	040611
04061102	ចំការតាម៉ៅ	Chamkar Ta Mau	040611
04061103	សន្ទូច	Santuch	040611
04061104	ត្រោកកើត	Traok Kaeut	040611
04061105	ត្រោកកណ្ដាល	Traok Kandal	040611
04061106	ត្រោកលិច	Traok Lech	040611
04061107	គល់គប់	Kol Kob	040611
04061108	ត្រពាំងស្បូវ	Trapeang Sbov	040611
04061109	ព្រៃមាន់	Prey Moan	040611
04061110	អណ្ដូងឫស្សី	Andoung Ruessei	040611
04061111	ទ្រាត្បូង	Trea Tboung	040611
04061112	ទ្រាជើង	Trea Cheung	040611
04061201	ថ្មកែវ	Thma Kaev	040612
04061202	ក្នុង	Knong	040612
04061203	គ្រាំងប្រស្វាយ	Krang Prasvay	040612
04061204	ឧទុម្ពរ	Utumpor	040612
04061205	សិឡាង	Selang	040612
04061206	ស្វាយជ្រុំថ្មី	Svay Chrum Thmei	040612
04061207	ចំការឃ្លៃ	Chamkar Khley	040612
04061208	ចិន	Chen	040612
04061209	ផ្លូវវាយ	Phlov Veay	040612
04061210	អូរទទឹង	Ou Totueng	040612
04061211	ទួលទ្រា	Tuol Trea	040612
04061212	ស្វាយជ្រុំចាស់	Svay Chrum Chas	040612
04061213	ស្មែត	Smaet	040612
04061214	ធ្នង់កំបុត	Thnong Kambot	040612
04061215	ចន្លោះរេន	Chanlaoh Ren	040612
04061216	ដំបូកកកោះ	Dambouk Kakaoh	040612
04061217	ត្រពាំងអញា្ចញ	Trapeang Anhchanh	040612
04061218	ថ្នល់តាសែង	Thnal Ta Saeng	040612
04061219	កោះកែវ	Kaoh Kaev	040612
04061220	ក្រពើពល់	Krapeu Pul	040612
04061221	ស្វាយចេក	Svay Chek	040612
04061222	កំពង់រាំង	Kampong Reang	040612
04061301	អូរសណ្ដាន់	Ou Sandan	040613
04061302	ទីកហូត	Tik Hout	040613
04061303	ព្រែកសាលា	Preaek Sala	040613
04061304	ននាមទទឹង	Noneam Totueng	040613
04061305	ព្រែករាំង	Preaek Reang	040613
04061306	គោកស្ដៅ	Kouk Sdau	040613
04061307	ត្រពាំងក្រពើ	Trapeang Krapeu	040613
04061308	ទីកល្អក់	Tik L'ak	040613
04061309	អូរសណ្ដាន់ថ្មី	Ou Sandan Thmei	040613
04070101	ច្រកត្នោត	Chrak Tnaot	040701
04070102	ត្រែង	Traeng	040701
04070103	រយាស	Royeas	040701
04070104	ត្រពាំងថ្ម	Trapeang Thma	040701
04070105	ស្រែឫស្សី	Srae Ruessei	040701
04070106	ក្រាំងសំរោង	Krang Samraong	040701
04070107	អន្លង់ព្រីង	Anlong Pring	040701
04070108	ជួញជិត	Chuonh Chit	040701
04070109	គិរីអភិវឌ្ឍន៌	Kiri Akpiwat	040701
04070201	វត្ដ	Voat	040702
04070202	ត្រពាំងស្រងែ	Trapeang Srangae	040702
04070203	ជ្រៃកោងលិច	Chrey Kaong Lech	040702
04070204	ជ្រៃកោងកើត	Chrey Kaong Kaeut	040702
04070205	ថ្មស	Thma Sa	040702
04070206	ខ្នារកណ្ដាល	Khna Kandal	040702
04070207	ត្រដក់ពង	Tradak Pong	040702
04070301	ថ្នល់	Thnal	040703
04070302	ក្រាំងល្វា	Krang Lvea	040703
04070303	អូរកាខុប	Ou Kakhob	040703
04070304	ជ្រេស	Chres	040703
04070305	ខ្នាទៃមោក	KhnaTey Mouk	040703
04070306	តាំងគ្រង	Tang Krong	040703
04070307	ធ្លករលើង	Thlok Roleung	040703
04070308	ជំទាវច្រែង	Chumteav Chraeng	040703
04070309	តាំងគ្រួសលិច	Tang Kruos Lech	040703
04070310	តាំងគ្រួសកើត	Tang Kruos Kaeut	040703
04070311	សំបុកគ្រៀល	Sambok Kreal	040703
04070312	ខ្សាច់ស	Ksach Sar	040703
04070401	តាំងពោន	Tang Poun	040704
04070402	ក្រាំងដូង	Krang Doung	040704
04070403	ចង្វារៀល	Chanva Riel	040704
04070404	ស្រែអណ្ដូង	Srae Andoung	040704
04070405	តាកែវ	Ta Kaev	040704
04070406	ក្រាំងបេង	Krang Beng	040704
04070407	ស្វាយកាំបិត	Svay Kambet	040704
04070408	ច្រាបកន្ទួត	Chrab Kantuot	040704
04070409	ក្រាំងកន្ទ្រោល	Krang Kantroul	040704
04070410	ច្រកស្ដេច	Chrak Sdach	040704
04070411	ច្រកកូវ	Chrak Kov	040704
04070412	សេរីវង្ស	Serei Vong	040704
04070413	សុខសែនជ័យ	Sok Saenchey	040704
04070501	ចំការស្វាយ	Chamkar Svay	040705
04070502	ស្ពានពោធិ៍	Spean Pou	040705
04070503	ថ្លុកឫស្សី	Thlok Ruessei	040705
04070504	បឹងលាជ	Boeng Leach	040705
04070505	ខ្នាច	Khnach	040705
04070506	ក្រាំងសៀម	Krang Siem	040705
04070507	អង្គ្រង	Angkrong	040705
04070508	វត្ដសេដ្ធី	Voat Sedthei	040705
04070509	ពារាជ្យ	Peareach	040705
04070601	ត្រពាំងបួន	Trapeang Buon	040706
04070602	ចំការ	Chamkar	040706
04070603	ហង្សឈូក	Hangs Chhuk	040706
04070604	ត្រពាំងថ្ម	Trapeang Thma	040706
04070605	ទួលពង្រ	Tuol Pongro	040706
04070606	ស្វាយពក	Svay Pok	040706
04070607	ខ្យាងត្បូង	Kyang Tboung	040706
04070608	ខ្យាងជើង	Khyang Cheung	040706
04070609	ក្រសាំងពុល	Krasang Pul	040706
04070610	ពោធិ៍រិទ្ធិក្រៃ	Pou Ritthi Krai	040706
04070611	ថ្មី	Thmei	040706
04070612	ជន្លាត់ដៃ	Chonloat Dai	040706
04070613	ស្វាយផ្អែម	Svay Ph'aem	040706
04070701	ក្ងោកពង់	Kngaok Pong	040707
04070702	ត្រពាំងព្រីង	Trapeang Pring	040707
04070703	ដំណាក់ព្រីង	Damnak Pring	040707
04070704	ត្រពាំងម្ទេស	Trapeang Mtes	040707
04070705	តាំងក្រង	Tang Krang	040707
04070706	ក្រាំងស្រម៉	Krang Srama	040707
04070707	ត្រពាំងទន្លាប់	Trapeang Tunloab	040707
04070708	ព្រៃញាម	Prey Nheam	040707
04070709	តាំងឃ្លៃ	Tang Khley	040707
04070710	ច្រកសង្កែ	Chrak Sangkae	040707
04070711	ក្តុលអភិវឌ្ឍន៌	Kdol Akpiwat	040707
04070801	រលាំង	Roleang	040708
04070802	នាងមាលា	Neang Mealea	040708
04070803	វាលតាគីង	Veal Ta King	040708
04070804	ថ្មីខ្មែរ	Thmei Khmer	040708
04070805	ត្បែងខ្ពស់	Tbaeng Khpos	040708
04070806	ស្រែសារ	Srae Sar	040708
04070807	មានក លិច	Meanok Lech	040708
04070808	មានក កើត	Meanok Kaeut	040708
04070809	រ៉ា	Ra	040708
04070901	ធ្លកវៀន	Thlok Vien	040709
04070902	ស្រែក្រៅ	Srae Krau	040709
04070903	តាំងត្បែង	Tang Tbaeng	040709
04070904	ឈូក	Chhuk	040709
04070905	ស្ពានដែក	Spean Daek	040709
04070906	ទ័ពបោះ	Toap Baoh	040709
04070907	ប្រក្លូត	Praklout	040709
04080101	ស្រែតាជៃ	Srae Ta Chey	040801
04080102	ត្រពាំងរាំង	Trapeang Reang	040801
04080103	ស្រែព្រិច	Srae Prich	040801
04080104	ស្រែខ្ទុម្ព	Srae Khtum	040801
04080105	ទឹកជុំ	Tuek Chum	040801
04080106	រពាក់	Ropeak	040801
04080107	ដំរិប	Damreb	040801
04080108	ត្រពាំងព្រីង	Trapeang Pring	040801
04080109	បែកចក	Baek Chak	040801
04080110	ស្រែតាជៃខាងលិច	Srae Ta Chey Khang Lech	040801
04080201	ជីប្រង	Chi Prang	040802
04080202	ទំនប់ថ្មី	Tumnob Thmei	040802
04080203	បឹងស្ទេង	Boeng Steng	040802
04080204	ព្រៃតាំងធ្នង់	Prey Tang Thnong	040802
04080205	កោះកណ្ដាល	Kaoh Kandal	040802
04080206	ឆកកណ្ដោល	Chhak Kandaol	040802
04080207	គោកពេញ	Kouk Penh	040802
04080208	ទ័ពតាឡាត់	Toap Ta Lat	040802
04080209	ស្រែរបង	Sae Robang	040802
04080210	តានៃ	Ta Ney	040802
04080211	កោះខ្ទុម្ព	Kaoh Khtum	040802
04080301	ចោងម៉ោង	Chaong Maong	040803
04080302	ដូនម៉ៅ	Doun Mau	040803
04080303	ខ្សែត	Khsaet	040803
04080304	ថ្មី	Thmei	040803
04080305	ពារាំង	Peareang	040803
04080306	ស្វាយចេក	Svay Chek	040803
04080307	អលង្កែរ	Akleangkaer	040803
04080308	ត្រពាំងជុំ	Trapeang Chum	040803
04080401	ក្រសាំងដុះឡើង	Krasang Doh Laeung	040804
04080402	ដូងស្លា	Doung Sla	040804
04080403	តាំងខ្សាច់	Tang Khsach	040804
04080404	តាំងស្យា	Tang Sya	040804
04080406	ជីពូក	Chipuk	040804
04080407	មោង	Moung	040804
04080408	ព្រៃជ្រៅ	Prey Chrov	040804
04080409	ថ្នល់កែង	Thnal Kaeng	040804
04080410	ខ្វិតទួលឃ្លាំង	Khvit Tuol Khleang	040804
04080501	ត្រពាំងក្របៅ	Trapeang Krabau	040805
04080502	យោត	Yout	040805
04080503	ខ្លុងពពក	Khlong Popok	040805
04080504	តាកាប	Ta Kab	040805
04080505	ក្រោយវត្ដ	Kraoy Voat	040805
04080506	ត្រពាំងជ្រៃ	Trapeang Chrey	040805
04080507	បឹងស្ទេង	Boeng Steng	040805
04080601	ក្រាំងស្គារ	Krang Skear	040806
04080602	ទួលសំរោង	Tuol Samraong	040806
04080603	ភ្នំតាសាំ	Phnum Ta Sam	040806
04080604	ចាន់ត្រក	Chan Trak	040806
04080605	ត្រពាំងម្លូ	Trapeang Mlu	040806
04080606	ចំបក់ប្រាសាទ	Chambak Prasat	040806
04080611	ក្រាំងស្គារខាងត្បូង	Krang Skear Khang Tboung	040806
04080701	ចំបក់កន្ទ្រាញ	Chambak Kantreanh	040807
04080702	ត្បែងខ្ពស់	Tbaeng Khpos	040807
04080703	ចាស់	Chas	040807
04080704	គោកណាំង	Kouk Nang	040807
04080705	ក្រាំងតាមុំ	Krang Ta Mom	040807
04080706	ស្រែអ៊ុក	Srae Uk	040807
04080707	រមាស	Romeas	040807
04080708	គោកពួច	Kouk Puoch	040807
04080709	វាលស្បូវ	Veal Sbov	040807
04080710	ថ្មី	Thmei	040807
04080711	តាំងក្រសាំង	Tang Krasang	040807
04080712	ក្រាំងម៉	Krang Ma	040807
04080801	រកាទង	Roka Tong	040808
04080802	ឡ	La	040808
04080803	វត្ដ	Voat	040808
04080804	ត្រពាំងស្មាច់	Trapeang Smach	040808
04080805	ស្រែចាន	Srae Chan	040808
04080806	ស្លែង	Slaeng	040808
04080807	រលុង	Rolung	040808
04080901	អញ្ចាញ	Anhchanh	040809
04080902	ដំណាក់អំពិល	Damnak Ampil	040809
04080903	ដំណាក់ខ្លុង	Damnak Khlong	040809
04080904	ក្ដុល	Kdol	040809
04080905	អូរល្ពៅ	Ou Lpov	040809
04080906	ភ្នំតាឧស	Phnum Ta Os	040809
05010101	ព្រៃឈើទាល	Prey Chheu Teal	050101
05010102	ព្រៃគោកត្រប់	Prey Kouk Trab	050101
05010103	ព្រៃឃ្លៃ	Prey Khley	050101
05010104	ត្រពាំងឈូក	Trapeang Chhuk	050101
05010105	បឹងស្ដុក	Boeng Sdok	050101
05010106	បឹងសង្កែ	Boeng Sangkae	050101
05010107	ស្រែត្រោក	Srae Traok	050101
05010108	តា្មតលេង	Tmat Leng	050101
05010109	សំព័រ	Sampoar	050101
05010110	ចំការទួល	Chamkar Tuol	050101
05010111	ព្រៃរំដួលខាងកើត	Prey Rumduol  khang Kaeut	050101
05010112	ព្រៃរំដួលខាងត្បូង	Prey Rumduol khang Tboung	050101
05010113	បឹងធ្នង់	Boeng Thnong	050101
05010114	ព្រៃរំដួលខាងលិច	Prey Rumduol khang Lech	050101
05010115	ព្រៃរំដួលខាងជើង	Prey Rumduol khang Cheung	050101
05010116	ទួលខ្ជាយ	Tuol Khcheay	050101
05010117	ខ្ពបវែង	Khpob Veaeng	050101
05010118	កន្លង់	Kanlang	050101
05010119	ចាស់	Chas	050101
05010120	ត្រពាំងផុង	Trapeang Phong	050101
05010121	ក្រុមហ៊ុន	Kromhun	050101
05010122	តាប្រាជ្ញ	Ta Prach	050101
05010201	ក្រោលក្រសាំង	Kraol Krasang	050102
05010202	រកាកោង	Roka Kaong	050102
05010203	ព្រៃសំព័រ	Prey Sampoar	050102
05010204	ថ្លុកបី	Thlok Bei	050102
05010205	វាលល្វាង	Veal Lveang	050102
05010206	យោលទោង	Youl Toung	050102
05010207	រកាធំ	Roka Thum	050102
05010208	ភ្នំកូប	Phnum Kob	050102
05010209	ចំបក់	Chambak	050102
05010210	អូរ	Ou	050102
05010211	ត្រពាំងពើក	Trapeang Peuk	050102
05010301	ដីក្រហម	Dei Kraham	050103
05010302	ត្រពាំងទូក	Trapeang Tuk	050103
05010303	ត្រាំកង់	Tram Kang	050103
05010304	ហង្ស	Hangs	050103
05010305	ត្រពាំងស្ដៅ	Trapeang Sdau	050103
05010306	ត្រពាំងឈូក	Trapeang Chhuk	050103
05010307	នរាយណ៍	Noreay	050103
05010308	ត្រពាំងខ្យង	Trapeang Khyang	050103
05010309	ត្រពាំងខ្នារ	Trapeang Khnar	050103
05010310	ត្រពាំងសាលា	Trapeang Sala	050103
05010311	ពោធិ៍ត្បែង	Pou Tbaeng	050103
05010312	ក្រសាំងតាគង់	Krasang Ta Kong	050103
05010313	ត្រពាំងអណ្ដូង	Trapeang Andoung	050103
05010314	ត្រពាំងរំដេញ	Trapeang Rumdenh	050103
05010315	សេរីអណ្ដែត	Serei Andaet	050103
05010401	ច្រកព្រាល	Chrak Preal	050104
05010402	ព្រៃរំដែល	Prey Rumdael	050104
05010403	ព្រៃខ្លា	Prey Khla	050104
05010404	ឈូករដ្ឋ	Chhuk Roadth	050104
05010405	គោកកណ្ដាល	Kouk Kandal	050104
05010406	សហគមន៍ខាងកើត	Sahakkom Khang Kaeut	050104
05010407	សហគមន៍ខាងលិច	Sahakkom Khang Lech	050104
05010408	អូរតាពូង	Ou Ta Pung	050104
05010409	តានក	Ta Nok	050104
05010501	ព្រះម្លប់	Preah Mlob	050105
05010502	ថ្មី	Thmei	050105
05010503	ព្រៃកញ្ចាន់	Prey Kanhchan	050105
05010504	ដាសស្គរ	Das Skor	050105
05010505	ព្រៃងោង	Prey Ngoung	050105
05010506	ពីរី	Piri	050105
05010507	តាធម្ម	Ta Thomm	050105
05010508	ត្រពាំងផ្លុង	Trapeang Phlong	050105
05010509	ព្រៃរោង	Prey Roung	050105
05010510	តាសោមអក	Ta Saom Ak	050105
05010511	សំរោងពងទឹក	Samraong Pong Tuek	050105
05010512	សាច់ត្រី	Sach Trei	050105
05010513	ទឹកថ្លា	Tuek Thla	050105
05010601	បឹងតាមុំ	Boeng Ta Mom	050106
05010602	ទួល	Tuol	050106
05010603	ថ្មី	Thmei	050106
05010604	សំបូរមាស	Sambuor Meas	050106
05010605	កន្លង់ជុំ	Kanlang Chum	050106
05010606	ព្រៃម្នោ	Prey Mnou	050106
05010607	ត្រពាំងទឹកជ្រៅ	Trapeang Tuek Chrov	050106
05010608	ត្រពាំងវែង	Trapeang Veaeng	050106
05010609	ឈូកកៀប	Chhuk Kieb	050106
05010610	ត្រពាំងលាប	Trapeang Leab	050106
05010611	ដំបូកខ្ពស់	Dambouk Khpos	050106
05010612	ទួលភ្ងាស	Tuol Phngeas	050106
05010613	ស្រែរលួស	Srae Roluos	050106
05010701	ត្រពាំងប្រិយ៍	Trapeang Prei	050107
05010702	សង្គមមានជ័យ	Sangkom Mean chey	050107
05010703	ត្រពាំងឈូក	Trapeang Chhuk	050107
05010704	កណ្ដោល	Kandaol	050107
05010705	ពោធិធំ	Pou Thum	050107
05010706	ពោធិកណ្ដាល	Pou Kandal	050107
05010707	ព្រៃអិដ្ឋ	Prey Edth	050107
05010708	ច្រនាងចាស់	Chranieng Chas	050107
05010709	ច្រនាងថ្មី	Chranieng Thmei	050107
05010710	ព្រៃខ្លា	Prey Khla	050107
05010711	ត្រពាំងកក់	Trapeang Kak	050107
05010712	សេរីជួបជុំ	Serei Chuob Chum	050107
05010713	ត្រកួន	Trakuon	050107
05010714	ត្រពាំងត្រគៀត	Trapeang Trokiet	050107
05010715	ក្រញូង	Kranhung	050107
05010716	សេរីភ័ត្ដ	Serei Phoat	050107
05010717	ព្រៃស្រូល	Prey Sroul	050107
05010718	នរាយណ៍	Noreay	050107
05010719	ព្រៃតាភេម	Prey Ta Phem	050107
05010801	ឃ្លៃចាស់	Khley Chas	050108
05010802	ឃ្លៃថ្មី	Khley Thmei	050108
05010803	ត្រពាំងសំរោង	Trapeang Samraong	050108
05010804	សក្ការៈ	Sakkarak	050108
05010805	ភ្នំតូច	Phnum Touch	050108
05010806	អង្គតាអាំ	Angk Ta Am	050108
05010807	ស្រែគុយ	Srae Kuy	050108
05010808	ត្រពាំងត្រយឹង	Trapeang Trayueng	050108
05010809	លាំងជៃថ្មី	Leang Chey Thmei	050108
05010810	ត្រពាំងទទ្ទឹម	Trapeang Tuntuem	050108
05010811	លាំងជៃចាស់	Leang Chey Chas	050108
05010812	ព្រៃត្បែង	Prey Tbaeng	050108
05010813	ព្រៃខ្លុង	Prey Khlong	050108
05010814	ខ្ពបរុន	Khpob Run	050108
05010901	អង្គដែកកណ្ដាល	Angk Daek Kandal	050109
05010902	ចំបក់រុន្ធត្បូង	Chambak Run Tboung	050109
05010903	ស្រែខ្ញែរ	Srae Khnher	050109
05010904	ចំបក់រុន្ធជើង	Chambak Run Cheung	050109
05010905	ម្រាលធំ	Mreal Thum	050109
05010906	ម្រាលត្នោតជើង	Mreal Tnaot  Cheung	050109
05010907	ម្រាលត្នោតត្បូង	Mreal Tnaot  Tboung	050109
05010908	អូចារ្យ	Ou Char	050109
05010909	ពោធិ	Pou	050109
05010910	សាឡាំ	Salam	050109
05010911	ត្រពាំងខ្នារ	Trapeang Khnar	050109
05010912	ថ្មី	Thmei	050109
05010913	ចំរើនផល	Chamraeun Phal	050109
05010914	តាដែងថ្មី	Ta Daeng Thmei	050109
05010915	តានួន	Ta Nuon	050109
05010916	តាដែងចាស់	Ta Daeng Chas	050109
05010917	ព្រៃត្បែង	Prey Tbaeng	050109
05010918	ព្រៃឃ្លេ	Prey Khle	050109
05011001	ស្ដុក	Sdok	050110
05011002	ពពូល	Popul	050110
05011003	ចចិប	Chacheb	050110
05011004	ចេក	Chek	050110
05011005	អន្លង់លាក់	Anlong Leak	050110
05011006	ឫស្សីយុល	Ruessei Yul	050110
05011007	អណ្ដូងល្វា	Andoung Lvea	050110
05011008	ចារ	Char	050110
05011009	ត្រពាំងខ្ទុំ	Trapeang Khtum	050110
05011010	ត្រពាំងធ្លក	Trapeang Thlok	050110
05011011	ខ្នាចកន្ទួត	Khnach Kantuot	050110
05011012	ជ្រៃ	Chrey	050110
05011013	ពង្រ	Pongro	050110
05011014	ទ្រយឹងទេ	Troyueng Te	050110
05011015	សង្កែលាក់	Sangkae Leak	050110
05011101	សង្គ្រាមបូរណ៍	Sangkream Bour	050111
05011102	រកាពក	Roka Pok	050111
05011103	ត្រពាំងជំរៅ	Trapeang Chumrov	050111
05011104	ត្រពាំងខ្យង	Trapeang Khyang	050111
05011105	ព្រៃពាយ	Prey Peay	050111
05011106	ព្រៃខ្លា	Prey Khla	050111
05011107	អង្គក្ដី	Angk Kdei	050111
05011108	ត្រពាំងទន្លាប់	Trapeang Tonloab	050111
05011109	ដំណាក់ត្រាច	Damnak Trach	050111
05011110	ព្រៃស្រឡែង	Prey Sralaeng	050111
05011111	អង្គរងាង	Angk Rongeang	050111
05011113	កែស្រែង	Kae Sraeng	050111
05011114	ផាន	Phan	050111
05011115	តាម៉ឺន	Ta Meun	050111
05011201	ទួលសាលា	Tuol Sala	050112
05011202	តាអាំ	Ta Am	050112
05011203	កោះឈើទាល	Kaoh Chheu Teal	050112
05011204	ស្វាយរំពា	Svay Rumpea	050112
05011205	ដូនពេញ	Doun Penh	050112
05011206	រំលឹក	Rumluek	050112
05011207	ព្រៃរងាង	Prey Rongeang	050112
05011208	ព្រីង	Pring	050112
05011209	តាតូវ	Ta Tov	050112
05011210	អូរ	Ou	050112
05011211	ធ្លក	Thlok	050112
05011212	ស្រែឃ្លេ	Srae Khle	050112
05011213	ត្នោត	Tnaot	050112
05011214	ចង្រៀក	Changriek	050112
05011215	វាល	Veal	050112
05011216	ខ្លាជល់	Khla Chol	050112
05011217	ត្រពាំងកក់	Trapeang Kak	050112
05011301	តារាជ	Ta Reach	050113
05011302	ទ័ពម្រាក់	Toap Mreak	050113
05011303	ក្រាំងត្រោក	Krang Traok	050113
05011304	ត្រពាំងទាប	Trapeang Teab	050113
06050504	ថ្មី	Thmei	060505
05011305	ត្រពាំងក្រសាំង	Trapeang Krasang	050113
05011306	ព្រៃឈ្នួល	Prey Snuol	050113
05011307	ឫស្សីវាល	Ruessei Veal	050113
05011308	ក្បាលថ្នល់	Kbal Thnal	050113
05011309	ត្រពាំងព្រីង	Trapeang Pring	050113
05011310	ត្រពាំងឈូក	Trapeang Chhuk	050113
05011311	ខ្នា	Khna	050113
05011312	ជើងភ្នំ	Cheung Phnum	050113
05011313	ព្រេច	Prech	050113
05011314	ផ្ចឹក	Phchoek	050113
05011401	ត្រាំសសរ	Tram Sasar	050114
05011402	ក្បៀរ	Kbier	050114
05011403	ផ្សារស្លាប់លែង	Phsar Slab; Leaeng	050114
05011404	អូរព្រាល	Ou Preal	050114
05011405	ព្រៃដុប	Prey Dob	050114
05011406	ស្លែង	Slaeng	050114
05011407	ត្រពាំងស្យា	Trapeang Sya	050114
05011408	ស្រែព្រីង	Srae Pring	050114
05011409	ធ្លក	Thlok	050114
05011410	ស្លាប់លែង	Slab Leaeng	050114
05011411	គ្រើល	Kreul	050114
05011412	ទួល	Tuol	050114
05011413	ខ្នាតានង់	Khna Ta Nong	050114
05011414	កណ្ដៀង	Kandieng	050114
05011501	ត្នោតម្ដើម	Tnaot Mdaeum	050115
05011502	ព្រៃបាក្រុង	Prey Ba Krong	050115
05011503	បឹង	Boeng	050115
05011504	ត្រពាំងវែង	Trapeang Veaeng	050115
05011505	ខ្នងភូមិ	Khnang Phum	050115
05011506	ថ្នល់ដាច់	Thnal Dach	050115
05011507	ថ្នល់	Thnal	050115
05011508	ឃ្លោក	Khlouk	050115
05011509	ត្រពាំងប្រិយ៍	Trapeang Prei	050115
05020101	តាម៉ុល	Ta Mol	050201
05020102	ផ្គង់	Phkong	050201
05020103	ត្រពាំងលើក	Trapeang Leuk	050201
05020104	ពេជសង្វា	Pech Sangvar	050201
05020105	អង្គប្រាសាទ	Angk Prasat	050201
05020106	រលួស	Roluos	050201
05020108	បូរីកម្មករ	Borei Kammeakkar	050201
05020109	ចំការដូង	Chamkar Doung	050201
05020110	សំបួរ	Sambuor	050201
05020111	ភ្នំដី	Phnum Dei	050201
05020112	ព្រៃស្លឹក	Prey Sloek	050201
05020113	សំពៅ	Sampov	050201
05020114	ខ្ទុំក្រាំង	Khtum Krang	050201
05020201	ថ្មី	Thmei	050202
05020202	កោះវៀន	Kaoh Vien	050202
05020203	រំលោង	Rumloung	050202
05020204	ពង្រ	Pongro	050202
05020205	ផ្សារសាមគ្គី	Phsar Sameakki	050202
05020206	ញរ	Nhor	050202
05020207	កណ្ដោលដុំ	Kandaol Dom	050202
05020208	ត្រពាំងព្រះ	Trapeang Preah	050202
05020209	កាប់ទូក	Kab Tuk	050202
05020210	ស្រែថ្នល់	Srae Thnal	050202
05020301	ក្រាំងពលទេព	Krang Pol Tep	050203
05020302	ពាណិជ្ជកម្ម	Peanicheakkam	050203
05020303	បូរីកម្មករ	Borei Kammeakkar	050203
05020304	សំណង់	Samnang	050203
05020305	មុខខេត្ដ	Mukh Khett	050203
05020306	ស្នោទី១	Snao Ti Muoy	050203
05020307	អង្គសេរី	Angk Serei	050203
05020308	ថ្មី	Thmei	050203
05020309	ទួលធ្នង់	Tuol Thnong	050203
05020310	ខោប	Khaob	050203
05020311	រកាធំ	Rokar Thum	050203
05020312	ត្រពាំងលើក	Trapeang Leuk	050203
05020401	តាំងទន្លេ	Tang Tonle	050204
05020402	រំលោង	Rumloung	050204
05020403	ថ្លុកឈើទាល	Thlok Chheu Teal	050204
05020404	ត្រាចជ្រុំ	Trach Chrum	050204
05020405	ប៉ែលហែល	Pael Hael	050204
05020406	ក្រងផ្កា	Krang Phka	050204
05020407	រំលោងប្រឃ្លះ	Runloung Prakhleah	050204
05020408	ព្រៃកន្ទាច	Prey Kanteach	050204
05020409	ស្នោទី២	Snao Ti Pir	050204
05020410	រលាំងសង្កែ	Roleang Sangkae	050204
05020501	ស្គុះ	Skuh	050205
05020502	ដក់ពរ	Dak Por	050205
05020503	ស្វាយក្រវ៉ាន់	Svay Kravan	050205
05020504	ទួលគក	Tuol Kouk	050205
05020505	ផ្សារចាស់	Phsar Chas	050205
05020506	ថ្នល់បំបែក	Thnal Bambaek	050205
05020507	ព្រៃក្ដី	Prey Kdei	050205
05020508	ត្រស់	Tras	050205
05020509	អំពែភ្នំ	Ampeae Phnum	050205
05020510	ត្រស់សាលា	Tras Sala	050205
05020511	កំណប់	Kamnab	050205
05030101	ល្វា	Lvea	050301
05030102	សោកម៉ោក	Saok Maok	050301
05030103	ក្រសាំងផ្អែម	Krasang Ph'aem	050301
05030104	អង្គពពេល	Angk Popel	050301
05030105	សំរោងចាស់	Samraong Chas	050301
05030106	សំពៅលូន	Sampov Lun	050301
05030107	ធ្លកយល់	Thlok Yol	050301
05030108	កំណប់	Kamnab	050301
05030109	ត្រាំរនាប	Tram Roneab	050301
05030110	អង្គ្រង	Angkrong	050301
05030111	ទូលសុទិន	Tuol Sotin	050301
05030112	សំរោងរស្មី	Samraong Reaksmei	050301
05030113	ស្វាយទាប	Svay Teab	050301
05030201	អង្គក្រសាំង	Angk Krasang	050302
05030202	ព្រៃតាមាន	Prey Ta Mean	050302
05030203	អង្គសង្គ្រាម	Angk Sangkream	050302
05030204	ថ្មក្ដារ	Thma Kdar	050302
05030205	បាំងណា	Bang Na	050302
05030206	អង្គតាឡី	Angk Ta Lei	050302
05030207	កាន់តំរ៉ា	Kan Damra	050302
05030208	ជ្រៃ	Chrey	050302
05030209	ធ្លក	Thlok	050302
05030210	កាយៀវ	Kayiev	050302
05030211	រាំង	Reang	050302
05030212	ព្រៃស្បូវ	Prey Sbov	050302
05030213	ព្រៃតាលឹម	Prey Ta Luem	050302
05030214	ក្រាំងឡង	Krang Lang	050302
05030215	អង្គ្ករមាស	Angk Romeas	050302
05030216	សណ្ដុល	Sandol	050302
05030217	តាមេម	Ta Mem	050302
05030218	ជុំស្រុក	Chum Srok	050302
05030219	ជង្រុក	Chongruk	050302
05030220	ព្រៃរោង	Prey Roung	050302
05030221	បឹងទ័ពព្យុះ	Boeng Toap Pyuh	050302
05030222	ព្រៃក្ដី	Prey Kdei	050302
05030223	ត្រពាំងរនះ	Trapeang Roneah	050302
05030224	ពងទឹក	Pong Tuek	050302
05030225	ក្របីត្រាំ	Krabei Tram	050302
05030301	ទួលវាសនា	Tuol Veasna	050303
05030302	អង្គសុគន្ធា	Angk Sokonthea	050303
05030303	តារាជ្យ	Ta Reach	050303
05030304	អង្គ្កសខ្នាយ	Angk Sa Khnay	050303
05030305	ស្នួល	Snuol	050303
05030306	ព្រៃឃ្លោយ	Prey Khlouy	050303
05030307	កក់ធំ	Kak Thum	050303
05030308	ឈើលំ	Chheu Lum	050303
05030309	ក្រាំងស្បូវ	Krang Sbov	050303
05030310	ក្បាលរមាស	Kbal Romeas	050303
05030311	ក្រាំងឫស្សី	Krang Ruessei	050303
05030312	ទួលព្រិច	Tuol Prich	050303
05030313	ត្រពាំងទាប	Trapeang Teab	050303
05030314	ក្រាំងតាឡាត់	Krang Ta Lat	050303
05030315	ព្រៃទំនប់	Prey Tumnob	050303
05030316	ត្រពាំងចក	Trapeang Chak	050303
05030317	ត្រាចកុះ	Trach Koh	050303
05030318	អង្គរោង	Angk Roung	050303
05030319	សំរោងខ្ពស់	Samraong Khpos	050303
05030320	ត្រពាំងអំពិល	Trapeang Ampil	050303
05030321	ក្រាំងឈើនាង	Krang Chheu Neang	050303
05030322	អង្គរ.មាស	Angkor meas	050303
05030401	ពន្លឺខែ	Ponlueu Khae	050304
05030402	កន្លែងរមាស	Kanlaeng Romeas	050304
05030403	ត្រពាំងស្នួល	Trapeang Snuol	050304
05030404	ត្រពាំងថ្នល់	Trapeang Thnal	050304
05030405	ពេជ្រមុនី	Pechr Muni	050304
05030406	ត្រពាំងរកា	Trapeang Roka	050304
05030407	ថ្នល់បត់	Thnal Bat	050304
05030408	ទួលព្រីង	Tuol Pring	050304
05030409	ទួលម្អម	Tuol M'am	050304
05030410	គោកដង្កោ	Kouk Dangkao	050304
05030411	គគ្រួស	Kokruos	050304
05030412	ចាស់	Chas	050304
05030413	ផ្ចឹកជ្រុំ	Phchoek Chrum	050304
05030501	ដុតកំបោរ	Dot Kambaor	050305
05030502	កញ្ច្រប់	Kanhchrab	050305
05030503	ព្រៃខ្លា	Prey Khla	050305
05030504	គរ	Kor	050305
05030505	គក	Kok	050305
05030506	ដំណាក់មានជ័យ	Damnak Mean chey	050305
05030507	ចំការស្បូវ	Chamkar Sbov	050305
05030508	ច្រាមត្បូង	Chrab Tboung	050305
05030509	ច្រាមជើង	Chrab Cheung	050305
05030510	ព្រៃល្វា	Prey Lvea	050305
05030511	ត្រពាំងស្លា	Trapeang Sla	050305
05030512	បឹងកក់	Boeng Kak	050305
05030513	ទួលធ្នង់	Tuol Thnong	050305
05030514	សាលាគ្រួស	Sala Kruos	050305
05030515	សាយ៉ាវ	Sayav	050305
05030516	ក្រាំងទ្រា	Krang Trea	050305
05030517	លៀក	Liek	050305
05030518	ភានសា	Pheansa	050305
05030519	ព្រៃថ្កូវ	Prey Thkov	050305
05030520	ក្របៅ	Krabau	050305
05030521	ថ្លុកព្រាល	Thlok Preal	050305
05030522	ត្រពាំងចំបក់	Trapeang Chambak	050305
05030523	ឫស្សី	Ruessei	050305
05030524	តាអោង	Ta Aong	050305
05030525	ដក់ពរ	Dak Por	050305
05030526	ព្រៃទទឹង	Prey Totueng	050305
05030527	ព្រៃដងទឹក	Prey Dang Tuek	050305
05030601	ខ្លែងពណ៌ត្បូង	Khlaeng Poar Tboung	050306
05030602	ដូង	Doung	050306
05030603	ស្រែចរ	Srae Char	050306
05030604	ត្រពាំងកន្ថោ	Trapeang Kanthao	050306
05030605	ដំដែក	Dam Daek	050306
05030606	ហោង	Haong	050306
05030607	ព្រៃញាតិ	Prey Nheat	050306
05030608	ស្វាយ	Svay	050306
05030609	តានៃ	Ta Ney	050306
05030610	ស្វាយចារ្យ	Svay Char	050306
05030611	បាក់ក	Bak Kar	050306
05030612	បឹងប្រស្រែ	Boeng Prasrae	050306
05030613	អង្គសំរោង	Angk Samraong	050306
05030614	ព្រៃជរ	Prey Chor	050306
05030615	ត្បូងអង្គ	Tboung Angk	050306
05030616	ព្រៃគុក	Prey Kuk	050306
05030617	ឈូកស	Chhuk Sa	050306
05030618	ផ្លូវដំរី	Phlov Damrei	050306
05030619	ខ្លែងពណ៌ជើង	Khlaeng Poar Cheung	050306
05030620	ព្នៅ	Pnov	050306
05030621	ព្រៃរងៀង	Prey Rongieng	050306
05030622	ត្រពាំងក្រឡាញ់	Trapeang Kralanh	050306
05030623	សម្ដេចឪ	Samdach Ov	050306
05030624	ចាស់	Chas	050306
05030625	ព្រៃទើ	Prey Teu	050306
05030701	ត្រពាំងធ្នង់	Trapeang Thnong	050307
05030702	ដំណាក់ពង្រ	Damnak Pongro	050307
05030703	ថ្មី	Thmei	050307
05030704	អង្គខ្ជាយ	Angk Khcheay	050307
05030705	បឹងរនាល	Boeng Roneal	050307
05030706	ត្រពាំងស្វាយ	Trapeang Svay	050307
05030707	ឯកភាព	Aekak Pheap	050307
05030708	ដំរីស្លាប់	Damrei Slab	050307
05030709	ព្រៃឈើទាល	Prey Chheu Teal	050307
05030710	ទួលត្បែង	Tuol Tbaeng	050307
05030711	ព្រៃស្មាច់	Prey Smach	050307
05030712	តាភោគ	Ta Phouk	050307
05030713	ព្រៃកែស	Prey Kaes	050307
05030714	ចំការដូង	Chamkar Doung	050307
05030715	ព្រៃដំណាក់	Prey Damnak	050307
05030716	បឹងចង្រៀក	Boeng Changriek	050307
05030717	ជ្រៃវារ	Chrey Vear	050307
05030718	ចេកស្រទន់	Chek Sraton	050307
05030719	ត្រពាំងជ្រៃ	Trapeang Chrey	050307
05030801	ដីក្រហម	Dei Kraham	050308
05030802	ព្រីងទឹក	Pring Tuek	050308
05030803	ដូនអៀត	Doun Iet	050308
05030804	ព្រៃតាអូក	Prey Ta Ouk	050308
05030805	ព្រៃពង្រ	Prey Pongro	050308
05030806	តារោង	Ta Roung	050308
05030807	អូរតាពូង	Ou Ta Pung	050308
05030808	ស្រែធ្លក	Srae Thlok	050308
05030809	ព្រៃខ្វាវ	Prey Khvav	050308
05030810	ដំដែក	Dam Daek	050308
05030811	រកាកោះ	Roka Kaoh	050308
05030812	ជៃតាកួន	Chey Ta Kuon	050308
05030901	ក្រាំងខ្លុង	Krang Khlong	050309
05030902	ត្រពាំងលើក	Trapeang Leuk	050309
05030903	ព្រៃចង្វា	Prey Changva	050309
05030904	ស្ដុក	Sdok	050309
05030905	ចេក	Chek	050309
05030906	ព្រៃចារ	Prey Char	050309
05030907	បឹងត្រាវ	Boeng Trav	050309
05030908	ត្រាំកង់	Tram Kang	050309
05030909	ព្រៃខ្វាវ	Prey Khvav	050309
05030910	ប៉ុកតង់	Pok Tang	050309
05030911	ព្រៃអន្ទាវ	Prey Anteav	050309
05030912	ត្រពាំងកកោះ	Trapeang Kakaoh	050309
05030913	បេង	Beng	050309
05030914	ដូង	Doung	050309
05030915	ថ្មី	Thmei	050309
05030916	បឹងព័ទ្ធ	Boeng Poat	050309
05030917	ត្រពាំងព្រលឹត	Trapeang Proluet	050309
05030918	ត្រពាំងស្រស់	Trapeang Sras	050309
05031001	ត្រាំខ្នារ	Tram Khnar	050310
05031002	ត្រពាំងដា	Trapeang Da	050310
05031003	ត្រពាំងស្ទង	Trapeang Stong	050310
05031004	ត្រពាំងធ្លក	Trapeang Thlok	050310
05031005	ស្នួល	Snuol	050310
05031006	សូគង	Soukong	050310
05031007	សំរោង	Samraong	050310
05031008	ឫស្សីស្រុក	Ruessei Srok	050310
05031009	ក្រាំងពន្លៃ	Krang Ponley	050310
05031010	ក្រាំងកណ្ដាល	Krang Kandal	050310
05031011	អង្គកន្ទច	Angk Kantorch	050310
05031012	ថ្មស	Thma Sa	050310
05031013	ព្រៃតាមួច	Prey Ta Muoch	050310
05031014	ព្រៃនូក	Prey Nuk	050310
05031015	កក់ក្រពើ	Kak Krapeu	050310
05031016	ក្រាំងគ្រួស	Krang Kruos	050310
05031017	បល្ល័ង្គរាជា	Ballangk Reachea	050310
05031018	ព្រៃកំបោរ	Prey Kambaor	050310
05031019	ត្រពាំងវែង	Trapeang Veaeng	050310
05031020	អណ្ដូងច្រុះ	Andoung Chroh	050310
05031021	ត្រពាំងមាន	Trapeang Mean	050310
05031022	ត្រើយត្រក	Traeuy Trak	050310
05031023	ថ្លុកមាន	Thlok Mean	050310
05031024	ម្កាក់	Mkak	050310
05031101	អូរពង្រ	Ou Pongro	050311
05031102	អណ្ដូងប្រាំង	Andoung Prang	050311
05031103	អូរតាវ៉ាម	Ou Ta Vam	050311
05031104	រលាំងទឹក	Roleang Tuek	050311
05031105	ថ្លុកដូនស	Thlok Doun Sa	050311
05031106	ត្រពាំងថ្ម	Trapeang Thma	050311
05031107	ស្រង់	Srang	050311
05031109	ត្របែកទូង	Trabaek Tung	050311
05031110	ក្រាំងឃ្នង	Krang Khnong	050311
05070203	ត្រាច	Trach	050702
05031111	អង្គដូនតី	Angk Doun Tei	050311
05031112	ស្លា	Sla	050311
05031113	ស្វាយជ្រុំ	Svay Chrum	050311
05031114	វាល	Veal	050311
05031115	ត្រពាំងត្រាច	Trapeang Trach	050311
05031116	ស្រែមាន់	Srae Moan	050311
05031117	ភែក	Pheaek	050311
05031118	ពង្រ	Pongro	050311
05031201	ច្រេស	Chres	050312
05031202	ចំបក់ក្អែរ	Chambak K'aer	050312
05031203	សន្លង់	Sanlang	050312
05031204	អង្គដូនពិស	Angk Doun Pis	050312
05031205	ប្រវឹកពង	Pravuek Pong	050312
05031206	ក្បាលដំរី	Kbal Damrei	050312
05031207	បឹងងោង	Boeng Ngoung	050312
05031208	ព្រៃកន្ទោច	Prey Kantouch	050312
05031209	តាងៅ	Ta Ngov	050312
05031210	ស្នួលជ្រុំ	Snuol Chrum	050312
05031211	គរ	Kor	050312
05031212	ត្រាវ	Trav	050312
05031301	ត្បូងភ្នំ	Tboung Phnum	050313
05031302	ត្រាវ	Trav	050313
05031303	ក្រសាំងជីមែ	Krasang Chi Meae	050313
05031304	ព្រៃស្ដេច	Prey Sdach	050313
05031305	ព្រៃខ្លុង	Prey Khlong	050313
05031306	ព្រៃខ្ញែ	Prey Khmer	050313
05031307	ព្រៃទទឹងខាងលិច	Prey Totueng Khang Lech	050313
05031308	ត្រពាំងពោធិ៍	Trapeang Pou	050313
05031309	ព្រៃទទឹងខាងកើត	Prey Totueng Khang Kaeut	050313
05031310	ថ្មបាំង	Thma Bang	050313
05031311	តាយ៉ង	Ta Yang	050313
05031312	ព្រៃជ្រៃ	Prey Chrey	050313
05031313	ត្រពាំងវែង	Trapeang Veaeng	050313
05031314	ទួលល្វា	Tuol Lvea	050313
05031315	ឈើទាលជ្រុំ	Chheu Teal Chrum	050313
05031316	ព្រៃស្បាត	Prey Sbat	050313
05031317	ទួលខ្ពស់	Tuol Khpos	050313
05031318	ត្បូងបឹង	Tboung Boeng	050313
05031319	ក្រាំងទាវ	Krang Teav	050313
05031320	លិចបឹង`	Lech Boeng	050313
05031321	ព្រៃស្បូវ	Prey Sbov	050313
05031322	ចាម	Cham	050313
05040101	តាំងរបង	Tang Robang	050401
05040102	ចំប៉ី	Champei	050401
05040103	ដីឆ្នាំង	Dei Chhnang	050401
05040104	ក្រាំងតាវ៉ា	Krang Ta Va	050401
05040105	ក្រាំងគគីរ	Krang Kokir	050401
05040106	ក្រាំង	Krang	050401
05040107	ព្រៃទទឹង	Prey Totueng	050401
05040108	មនោរម្យ	Monourom	050401
05040109	ទួលធ្នង់	Tuol Thnong	050401
05040201	រស្មី	Reaksmei	050402
05040202	សាមគ្គី	Sameakki	050402
05040203	ព្រៃមៀន	Prey Mean	050402
05040204	អូរផ្ដៅ	Ou Phdau	050402
05040205	ពាមរស់	Peam Ros	050402
05040206	ព្រៃធំ	Prey Thum	050402
05040207	ពស់វែក	Pos Vaek	050402
05040208	សង្កែជ្រុំ	Sangkae Chrum	050402
05040301	ព្រៃផ្ដៅ	Prey Phdau	050403
05040302	ផ្លូវគោ	Phlov Kou	050403
05040303	ច្រកទៀក	Chrak Tiek	050403
05040304	ពាមល្វា	Peam Lvea	050403
05040306	ល្ងឹម	Lnguem	050403
05040311	ត្រពាំងអង្គ្រង	Trapeang Angkrong	050403
05040312	ឈើទាលជ្រុំ	Chheu Tealchhum	050403
05040313	អូរតោង	Ou Taong	050403
05040314	ស្វាយទាប	Svay Teab	050403
05040315	ក្រវៀក	Kraviek	050403
05040316	សំរោង	Samraong	050403
05040317	ក្បាលដំរី	Kbal Damrei	050403
05040318	ចំបក់	Cham Bok	050403
05040319	ត្រាង	Traing	050403
05040320	តានិល	Ta Nil	050403
05040321	កោរដូនតី	Koa Doun Tei	050403
05040322	ពុទ្រា	Putrea	050403
05040323	ក្រាំងធ្នង់	Kraing Thnung	050403
05040401	ជំនាប់	Chumnoab	050404
05040402	ពាម	Peam	050404
05040403	ព្រីងកោង	Pring Kaong	050404
05040404	យ៉ាងពិស	Yang Pis	050404
05040405	តាំងស្រឹង	Tang Sroeng	050404
05040406	ទួលឈីនាង	Tuol Chheu Neang	050404
05040407	តាមិញ	Ta Minh	050404
05040408	កន្ទួត	Kantuot	050404
05040409	តាដែស	Ta Daes	050404
05040410	ដំបងវេញ	Dambang Vinh	050404
05040411	គោក	Kouk	050404
05040412	ក្រាំងពង្រ	Krang Pongro	050404
05040413	ផ្សារកន្ទួត	Phsar Kantuot	050404
05040414	ស្រែវៀន	Srae Vien	050404
05040415	ត្រពាំងគង	Trapeang Kong	050404
05040501	តាសាល	Ta Sal	050405
05040502	អន្លង់សង្កែ	Anlong Sangkae	050405
05040503	កោះរុន	Kaoh Run	050405
05040504	ក្នុងអាយ	Knong Ay	050405
05040505	រោងម៉ាស៊ីន	Roung Masin	050405
05040506	ត្រពាំងឆ្មៀ	Trapeang Chhmea	050405
05040507	ដូង	Doung	050405
05040508	កំប៉េះ	Kampeh	050405
05040509	តាំងបំពង់	Tang Bampong	050405
05040510	កេះ	Keh	050405
05040511	ជាំ	Choam	050405
05040512	សុរិយា	Sorya	050405
05040513	ក្រៀលពង	Kreal Pong	050405
05040514	ដូនជន់	Doun Chun	050405
05040515	ថ្មី	Thmei	050405
05040516	រមាំង ស	Romeang Sor	050405
05040517	អូរអញ្ចា	Ou Ancha	050405
07020101	ពេជ្ជនា	Pechonea	070201
05060101	ក្រាំងចេក	Krang Chek	050601
05060102	បេង	Beng	050601
05060103	ថ្មី	Thmei	050601
05060104	ចំបក់ដង្គុំ	Chambak Dangkum	050601
05060201	ក្បាលទឹកលើ	Kbal Tuek Leu	050602
05060202	ដូង	Doung	050602
05060203	តានៃ	Ta Ney	050602
05060204	ព្រៃឫស្សី	Prey Ruessei	050602
05060205	ក្បាលទឹកក្រោម	Kbal Tuek Kraom	050602
05060206	ថ្មី	Thmei	050602
05060207	សាលា	Sala	050602
05060208	រស្មីសាមគ្គី	Raksmey Samaki	050602
05060209	ច្រាបក្រសាំង	Chrab Krasang	050602
05060301	ពាមខ្វាវ	Peam Khvav	050603
05060302	សំបួរ	Sambuor	050603
05060303	ដំណាក់ត្រាច	Damnak Trach	050603
05060304	មានជ័យ	Mean Chey	050603
05060305	ដំបូករូង	Dambouk Rung	050603
05060306	ត្រពាំងខ្លុង	Trapeang Khlong	050603
05060307	មានសិរី	Mean Serei	050603
05060308	ទឹកថ្លា	Toek Thla	050603
05060401	ត្រពាំងក្រឡឹង	Trapeang Kraloeng	050604
05060402	ត្រពាំងអត់ទឹក	Trapeang At Tuek	050604
05060403	ក្រាំងច្រេស	Krang Chres	050604
05060404	ក្រាំងប្រស្រុក	Krang Prasrok	050604
05060405	ក្រាំងសេរី	Krang Serei	050604
05060406	ក្រាំងខ្វាវ	Krang Khvav	050604
05060407	ក្រាំងពន្លៃ	Krang Ponley	050604
05060408	ផ្សារត្រពាំងក្រឡឹង	Phsar Trapeang Kraloeng	050604
05060409	ក្រាំងស្យា	Krang Sya	050604
05060501	បន្ទាយរកា	Banteay Rokar	050605
05060502	ក្រសាំងខ្ពស់	Krasang Khpos	050605
05060503	ត្រពាំងប្រិយ៍	Trapeang Prei	050605
05060504	ក្រាំងគរ	Krang Kor	050605
05060505	ក្រាំងក្រូច	Krang Krouch	050605
05060506	ដក់ពរ	Dak Por	050605
05060507	ព្រៃទទឹង	Prey Totueng	050605
05060508	ដូង	Doung	050605
05060509	ព្រៃកាហៀច	Prey Kahiech	050605
05060601	ភក់	Phok	050606
05060602	បន្ទាប់	Bantoab	050606
05060603	ត្រពាំងឱប	Trapeang Aob	050606
05060604	ក្រាំងថ្នល់	Krang Thnal	050606
05060605	អន្លង់ថ្លឹង	Anlong Thloeng	050606
05060606	ក្រាំងចចាត	Krang Chachat	050606
05060607	ក្រឡាញ់	Kralanh	050606
05060608	ក្រាំងក្ដី	Krang Kdei	050606
05060609	ក្រាំងជ្រែ	Krang Chreae	050606
05060610	តាព្រះ	Ta Preah	050606
05060611	ច្រកត្រាច	Chrak Trach	050606
05060612	តាមេញ	Ta Menh	050606
05060613	ត្រពាំងក្រឡាញ់	Trapeang Kralanh	050606
05060614	ព្រៃស្ដុក	Prey Sdok	050606
05060615	ស្លែង	Slaeng	050606
05060616	កណ្ដាល	Kandal	050606
05060617	សំបួរ	Sambuor	050606
05060618	ទួលសេរី	Tuol Serei	050606
05060619	តាំងរងៀង	Tang Rongieng	050606
05060620	ទួលថ្មី	Tuol Thmei	050606
05060621	ប្រាសាទ	Prasat	050606
05060622	ក្រាំងដូង	Krang Doung	050606
05060623	ទួល	Tuol	050606
05060624	ក្បាលថ្នល់	Kbal Thnal	050606
05060625	សេរីវ័ន្ដ	Sereivoan	050606
05060626	ក្រាំងល្ហុង	Krang Lhong	050606
05060701	ក្រាំងតាតន់	Krang Ta Tan	050607
05060702	អំពៅ	Ampov	050607
05060703	កូនត្រុំ	Koun Trom	050607
05060704	ក្រាំងភ្នៅ	Krang Pnov	050607
05060705	ក្រាំងចោទ	Krang Chaot	050607
05060706	ព្រៃទទឹង	Prey Totueng	050607
05060707	រលួស	Roluos	050607
05060708	រំដួល៨៨	Rumduol Paetprambei	050607
05060709	អូរល្វា	Ou Lvea	050607
05060710	ស្វាយជ្រំ	Svay Chrum	050607
05060711	ព្រៃច្រេស	Prey Chres	050607
05060712	តាឡាត់ចាស់	Ta Lat Chas	050607
05060713	ចេក	Chek	050607
05060714	ផ្សារតាឡាត់	Phsar Ta Lat	050607
05060715	ក្រាំងសំរ៉ែ	Krang Samrae	050607
05060716	តាឡាត់ថ្មី	Ta Lat Thmei	050607
05060717	តាវ៉ា	Ta Va	050607
05060718	ព្រៃស្រោង	Prey Sraong	050607
05060719	ក្រាំងពោធិ៍	Krang Pou	050607
05060720	កុមារពេទ្យ	Komar Pet	050607
05060721	ត្រពាំងស្តុកគ្រូ	Trapaeng Stock Kru	050607
05060722	ក្រាំងរលួស	Krang Roluos	050607
05060801	ជន្លង់ម្លូ	Chonlong Mlu	050608
05060802	គីរីរស្មី	Kiri Reaksmei	050608
05060803	ព្រំតោស	Prum Taos	050608
05060804	រំដួលថ្មី	Rumduol Thmei	050608
05060805	កាប់ទូក	Kab Tuk	050608
05060806	អូរមុខទឹក	Ou Mukh Tuek	050608
05060807	ព្រៃរមៀត	Prey Romiet	050608
05060901	ប្រីយ៍	Prei	050609
05060902	ស្រែត្រពាំង	Sre Trapang	050609
05060903	គ្រៀលបួស	Kriel Buos	050609
05060904	ដីក្រហម	Dei Kraham	050609
05060905	ព្រៃឈើទាល	Prey Chheu Teal	050609
05060906	ព្រៃក្បុង	Prey Kbong	050609
05060907	ជ័យថ្មី	Chey Thmei	050609
05060908	កណ្ដាល	Kandal	050609
05061001	ក្រាំងធំ	Krang Thum	050610
05061002	ក្រាំងបឹង	Krang Boeng	050610
05061003	ស្រែជ្រៅ	Srae Chrov	050610
05061004	តាំងសំរោង	Tang Samraong	050610
05061005	ខ្នងក្រាំង	Khnang Krang	050610
05061006	ថ្មី	Thmei	050610
05061007	ស្ដុកជ្រៃ	Sdok Chrey	050610
05061008	កណ្ដាល	Kandal	050610
05061009	តាយ៉ូវ	Ta Youv	050610
05061010	ជ្រៃសែនជ័យ	Chrey Saenchey	050610
05061101	ឈើនាងខ្ពស់	Chheu Neang Khpos	050611
05061102	ច្រកខ្លា	Chrak Khla	050611
05061103	កណ្ដោលកោង	Kandaol Kaong	050611
05061104	តាំងស្យា	Tang Sya	050611
05061105	គីរីរស្មី	Kiri Reaksmei	050611
05061106	តាំងស្រឡៅ	Tang Sralau	050611
05061107	ជ្រែ	Chreae	050611
05061108	ក្រាំងតាកន	Krang Ta Kan	050611
05061109	ក្រាំងខ្ជាយ	Krang Khcheay	050611
05061110	ព្រំរលក	Prum Rolok	050611
05061111	ពង្រ	Pongro	050611
05061112	សំបួរ	Sambuor	050611
05061113	ដីដុះ	Dei Doh	050611
05061114	មាត់សាយ	Moat Say	050611
05061115	ត្នោតព្រែក	Tnaot Preaek	050611
05061116	ក្អែកពង	K'aek Pong	050611
05061117	ក្រាំងស្លែង	Krang Slaeng	050611
05061301	ទី១	Ti Muoy	050613
05061302	ទី២	Ti Pir	050613
05061303	ទី៣	Ti Bei	050613
05061304	ទី៤	Ti Buon	050613
05061305	ទី៥	Ti Pram	050613
05061306	ទី៦	Ti Prammuoy	050613
05061307	ពាមទុង	Peam Tung	050613
05061308	ប្រសព្វជុំ	Prasob Chum	050613
05061309	ស្បែកព្រាល	Sbaek Preal	050613
05061310	ដំបូកខ្ពស់	Dambouk Kpus	050613
05061311	អូរកូនត្រុំ	Ou Koun Trom	050613
05061312	ដើមផ្តៀក	Derm Pdeak	050613
05061313	ព្រីង	Pring	050613
05061314	ចំការចេក	Chamkar Chek	050613
05061315	ទឹកចេញ	Toek Jenh	050613
05061316	កងមាស	Kang Meas	050613
05061317	ផ្សារត្រែងត្រយឹង	Phsar Traeng Trayueng	050613
05061318	ស្រល់	Srol	050613
05061319	វាលធំ	Veal Thom	050613
05061320	សម្បទានសែនជ័យ	Sambatean Saenchey	050613
05070101	អំពិលផ្អែម	Ampil Ph'aem	050701
05070102	វាល	Veal	050701
05070103	បាក់ធ្មេញ	Bak Thmenh	050701
05070104	ព្រីង	Pring	050701
05070105	លាក់អន្លូង	Leak Anlung	050701
05070106	តាកេរ្ដិ៍	Ta Ker	050701
05070107	ក្រាំងស្ពឺ	Krang Spueu	050701
05070108	ក្រាំងធំ	Krang Thum	050701
05070109	ស្រែចែង	Srae Chaeng	050701
05070110	សៅកែ	Saukae	050701
05070111	ថ្មី	Thmei	050701
05070112	ពោធិ៍	Pou	050701
05070113	មហាលាភ	Mohaleaph	050701
05070114	ព្រៃក្ដី	Prey Kdei	050701
05070115	អណ្ដូងប្រេង	Andoung Preng	050701
05070116	ស្រែកក់	Srae Kak	050701
05070117	ត្រពាំងថ្ម	Trapeang Thma	050701
05070118	បន្លាស្អិត	Banla S'et	050701
05070119	ជ្រលងថ្កូវ	Chrolong Thkov	050701
05070201	ព្រៃកំពោង	Prey Kampoung	050702
05070202	ព្រៃក្ដី	Prey Kdei	050702
05070204	ត្រពាំងអាង	Trapeang Ang	050702
05070205	ព្រះខែ	Preah Khae	050702
05070206	ត្រពាំងជ្រៅ	Trapeang Chrov	050702
05070207	វល្លិប្រេង	Voa Preng	050702
05070208	ពង្រធំ	Pongro Thum	050702
05070209	ទំពូង	Tumpung	050702
05070210	រលាំងជ្រៃ	Roleang Chrey	050702
05070211	គោករំលិច	Kouk Rumlich	050702
05070212	កាហែង	Kahaeng	050702
05070213	បុស្សតានៃ	Bos Ta Ney	050702
05070214	អូរវែង	Ou Veaeng	050702
05070215	ឡ	La	050702
05070301	ស្រីសំពោង	Srei Sampoung	050703
05070302	ក្បាលត្រឡាច	Kbal Tralach	050703
05070303	ពេជ្រសង្វា	Pech Sangva	050703
05070304	សង្កែជ្រុំ	Sangkae Chrum	050703
05070305	ខ្វាន	Khvan	050703
05070306	សប់ង៉	Sab Nga	050703
05070307	សុវណ្ណគីរី	Sovann Kiri	050703
05070308	យស់ជោ	Yos Chour	050703
05070309	ច្រកបានសុខ	Chrak Ban Sokh	050703
05070310	កាហុន	Kahon	050703
05070311	ថ្លុករាំង	Thlok Reang	050703
05070312	ព្រៃនរា	Prey Norea	050703
05070313	ឯកភាព	Ek Pheap	050703
05070314	តាសាល	Ta Sal	050703
05070401	រលួស	Roluos	050704
05070402	ថ្នល់បត់	Thnal Bat	050704
05070403	តានង់	Ta Nong	050704
05070404	ថ្លុកដូនសុខ	Thlok Doun Sokh	050704
05070405	ស្រែផ្សរ	Srae Phsa	050704
05070406	ក្ដុល	Kdol	050704
05070407	ព្រៃឈើទាល	Prey Chheu Teal	050704
05070408	អង្វែរ	Angvae	050704
05070409	ចំការវាល	Chamkar Veal	050704
05070410	អន្លង់ពពាយ	Anlong Popeay	050704
05070411	ត្រពាំងក្រសាំង	Trapeang Krasang	050704
05070412	អូរទំនាប	Ou Tumneab	050704
05070413	អូរសំបួរ	Ou Sambuor	050704
05070414	ត្រពាំងកក់	Trapeang Kak	050704
05070415	តានាង	Ta Neang	050704
05070501	តាំងក្រសាំង	Tang Krasang	050705
05070502	បាទី	Bati	050705
05070503	ត្រពាំងអូល	Trapeang Oul	050705
05070504	ក្រាំងស្នួល	Krang Snuol	050705
05070505	ត្រពាំងតាមាន់	Trapeang Ta Moan	050705
05070506	តាំងតាឡាត់	Tang Ta Lat	050705
05070507	ត្នោតជ្រំ	Tnaot Chrum	050705
05070508	អូរលើ	Ou Leu	050705
05070509	អូរក្រោម	Ou Kraom	050705
05070510	ទ្រា	Trea	050705
05070511	ដំឡូងខ្យា	Damloung Khya	050705
05070512	ព្រៃសំបុក	Prey Sambok	050705
05070513	ពោធិ៍	Pou	050705
05070514	ក្រាំងតារ័ត្ន	Krang Ta Roatn	050705
05070515	គោកមានជ័យ	Kouk Mean Chey	050705
05070516	អង្គរជា	Angkor Chea	050705
05070517	បេង	Beng	050705
05070518	សំពៅង	Sampov Ngo	050705
05070519	ញ្នយ	Pneay	050705
05070601	រលាំងគ្រើល	Roleang Kreul	050706
05070602	កណ្ដោលផើម	Kandaol Phaeum	050706
05070603	កំណប់	Kamnab	050706
05070604	ចំបក់ផ្អែម	Chambak Ph'aem	050706
05070605	ចំការបុស្ស	Chamkar Bos	050706
05070606	សំបួរ	Sambuor	050706
05070607	ត្រពាំងសាប	Trapeang Sab	050706
05070608	ត្រពាំងខ្យង	Trapeang Khyang	050706
05070609	ឈើទាលក្រោម	Chheu Teal Kraom	050706
05070610	ព្រៃសាលា	Prey Sala	050706
05070611	អង្គតានន	Angk Ta Non	050706
05070612	ក្រាំងស្វាយ	Krang Svay	050706
05070613	ដែកភ្លើង	Daek Phleung	050706
05070614	ឈើទាលលើ	Chheu Teal Leu	050706
05070615	ត្រពាំងតាឯក	Trapeang Ta Aek	050706
05070616	ឫស្សីស្រុក	Ruessei Srok	050706
05070617	រលាំងចក	Roleang Chak	050706
05070618	អង្គមេត្រី	Angk Metrei	050706
05070619	ស្រូល	Sroul	050706
05070620	រំលេច	Rumlich	050706
05070621	ស្ពានតោ	Spean Tao	050706
05070622	ត្រពាំងត្រាវ	Trapeang Trav	050706
05070623	ដូនទ្រីទី១	Doun Tri Ti Muoy	050706
05070624	ដូនទ្រីទី២	Doun Tri Ti Pir	050706
05070625	ត្រពាំងកកោះ	Trapeang Kakaoh	050706
05070626	រវាង	Roveang	050706
05070701	ត្រពាំងលែង	Trapeang Léng	050707
05070702	ទន្លេកន្ទិល	Tonle Kantil	050707
05070703	របងច្រុះ	Robang Chroh	050707
05070704	រោងគោ	Rorng Kou	050707
05070705	អង្គរជា	Angkor Chea	050707
05070706	ត្រពាំងត្រស់	Trapeang Tras	050707
05070707	អង្គទន្លាប់	Angk Tonloab	050707
05070708	សំរោងទងកណ្ដាល	Samrong Tong Kandal	050707
05070709	ត្រពាំងជួន	Trapeang Chuon	050707
05070710	សំរោងទងក្រោម	Samrong Tong Kraom	050707
05070711	សំរោងទងលើ	Samrong Tong Leu	050707
05070712	ត្រពាំងតាឡាត់	Trapeang Ta Lat	050707
05070713	ចង្ក្រានដែក	Changkran Daek	050707
05070714	សុភី	Sophy	050707
05070715	ចុងបឹង	Chong Boeng	050707
05070716	ត្រពាំងព្រូស	Trapeang Prous	050707
05070717	កែវមុនី	Keo Mony	050707
05070718	អណ្ដូង	Andoung	050707
05070801	អង្គតាឡឹក	Angk Ta Loek	050708
05070802	ក្រាំងលាវ	Krang Leav	050708
05070803	ស្ដុកព្រីង	Sdok Pring	050708
10040201	អាជេន	A Chen	100402
05070804	ថ្មគោល	Thma Koul	050708
05070805	កប់ចិន	Kab Chen	050708
05070806	ត្រពាំងឫស្សី	Trapeang Ruessei	050708
05070807	តាពរ	Ta Por	050708
05070808	អំពិលទឹក	Ampil Tuek	050708
05070809	អង្គខ្មៅ	Angk Khmau	050708
05070810	ព្រៃតាចាប	Prey Ta Chab	050708
05070811	ត្រពាំងវែង ទី១	Trapeang Veaeng Ti Muoy	050708
05070812	ត្រពាំងវែង ទី២	Trapeang Veaeng Ti Pir	050708
05070813	គរ	Kor	050708
05070814	បង្កើយ	Bangkaeuy	050708
05070815	ត្រពាំងនាន់	Trapeang Noan	050708
05070816	ព្រៃពង្រ	Prey Pongro	050708
05070817	ឡធ្យូង	La Thyung	050708
05070818	ត្រពាំងកន្ទួត	Trapeang Kantuot	050708
05070901	ព្រៃស្យា	Prey Sya	050709
05070902	ស្វាយតាវង	Svay Ta Vong	050709
05070903	សែនដី	Saen Dei	050709
05070904	ស្រះស្រង់	Srah Srang	050709
05070905	ផ្លូវជ្រូក	Phlov Chruk	050709
05070906	ដូនកែវ	Doun Kaev	050709
05070907	ទួលតាសុខ	Tuol Ta Sokh	050709
05070908	ព្រៃរំដួល	Prey Rumduol	050709
05070909	ត្រពាំងប្រីយ៍	Trapeang Prei	050709
05070910	ត្រោកវែង	Traok Veaeng	050709
05070911	ត្រពាំងដំរី	Trapeang Damrei	050709
05070912	អូររំចេក	Ou Rumchek	050709
05070913	មហាលំពាំងទីមួយ	Moha Lumpeang Ti Muoy	050709
05070914	ទំនប់	Tumnob	050709
05070915	ថ្លុកកណ្ដាល	Thlok Kandal	050709
05070916	សំរោងជើងភ្នំ	Samraong Cheung Phnum	050709
05070917	មហាលំពាំងទីពីរ	Moha Lumpeang Ti Pir	050709
05070918	ស្រែត្រោក	Srae Traok	050709
05070919	វាលវង់	Veal Vong	050709
05070920	ត្រពាំងកែស	Trapeang Kaes	050709
05070921	ព្រៃជ្រាវ	Prey Chreav	050709
05071001	បិល	Bel	050710
05071002	ក្រាំង	Krang	050710
05071003	គោករងៀង	Kouk Rongieng	050710
05071004	ក្រាំងមេត្រី	Krang Metrei	050710
05071005	អូរស្នោ	Ou Snao	050710
05071006	ស្វាយដង្គុំ	Svay Dangkum	050710
05071007	ដូនអាត់	Doun At	050710
05071008	ក្រាំងក្រូច	Krang Kruoch	050710
05071009	ក្រាំងត្រឡាច	Krang Tralach	050710
05071010	ព្រៃពង្រ	Prey Pongro	050710
05071011	ត្រពាំងអង្គ	Trapeang Angk	050710
05071012	អន្លង់ស្នោ	Anlong Snao	050710
05071013	រើងពើង	Reung Peung	050710
05071014	ក្រាំងអំពិល	Krang Ampil	050710
05071015	ត្រពាំងស្រង់	Trapeang Srang	050710
05071016	ទឹកលិច	Tuek Lich	050710
05071017	ព្រៃបេង	Prey Beng	050710
05071018	ព្រៃត្រាច	Prey Trach	050710
05071019	ត្រពាំងតាលួង	Trapeang Ta Luong	050710
05071020	ព្រៃរងៀង	Prey Rongieng	050710
05071021	ទន្លាប់	Tonloab	050710
05071101	អណ្ដូងស្លា	Andoung Sla	050711
05071102	អន្លង់ធម្ម	Anlong Thomm	050711
05071103	ក្រាំងស្ពឺ	Krang Spueu	050711
05071104	សំរិត	Samret	050711
05071105	សំប៉ាន	Sampan	050711
05071106	ថ្មី	Thmei	050711
05071107	ក្រាំងម្កាក់	Krang Mkak	050711
05071108	ទំពាម	Tumpeam	050711
05071109	គ្រឹះធំ	Krues Thum	050711
05071110	ទឹកល្អក់	Tuek L'ak	050711
05071111	ពង្រ	Pongro	050711
05071112	ចំការស្លែង	Chamkar Slaeng	050711
05071113	ផ្ដៅពេន	Phdau Pen	050711
05071114	ចំប៉ី	Champei	050711
05071115	អង្គតាម៉ៅ	Angk Ta Mau	050711
05071116	ចុងថ្នល់	Chong Thnal	050711
05071117	អូរគគីរ	O koki	050711
05071201	ព្រៃវាវ	Prey Veav	050712
05071202	ពង្រ	Pongro	050712
05071203	តាំងឫស្សី	Tang Ruessei	050712
05071204	ព្រៃកន្ទ្រង់	Prey Kantrong	050712
05071205	ដីក្រហម	Dei Kraham	050712
05071206	ព្រៃក្ដី	Prey Kdei	050712
05071207	ត្រពាំងសារ	Trapeang Sar	050712
05071208	ត្រពាំងលាភ	Trapeang Leap	050712
05071209	ក្រាំងស្វាយ	Krang Svay	050712
05071210	ជើងក្ដី	Cheung Kdei	050712
05071211	ថ្លុកដង្កោ	Thlok Dangkao	050712
05071212	ម្កាក់	Mkak	050712
05071213	ច្រកឫស្សី	Chrak Ruessei	050712
05071214	ព្រៃកំប៉ុក	Prey Kampok	050712
05071215	ព្រៃប្រដាក់	Prey Pradak	050712
05071216	ជើងភ្នំ	Cheung Phnum	050712
05071217	ក្រាំង	Krang	050712
05071218	មន	Mon	050712
05071219	ដីឡ	Dei La	050712
05071220	ស្រែត្រែង	Srae Traeng	050712
05071221	ស្រីប្រសើរ	Srei Prasaeur	050712
10060305	ខ្សារ	Khsar	100603
05071301	ថ្មបាំង	Thmar Bang	050713
05071302	ត្រគៀត	Trakiet	050713
05071303	បាក់ចិញ្ជៀន	Bak Chenhchien	050713
05071304	លំពែងព្រះរាម	Lumpeaeng Preah Ream	050713
05071305	អូរក្រាំងអំបិល	Ou Krang Ambel	050713
05071306	អន្លង់គង់	Anlong Kong	050713
05071307	ត្រពាំងខ្យង	Trapeang Khyang	050713
05071308	ព្រៃផ្ដៅ	Prey Phdau	050713
05071309	ស្រែអំបិល	Srae Ambel	050713
05071310	បាញ់កង្កែប	Banh Kangkaeb	050713
05071311	ត្រពាំងគង	Trapeang Kong	050713
05071312	ត្រពាំងវែង	Trapeang Vaeng	050713
05071313	សុបិន្ត	Soben	050713
05071314	សង្គ្រោះជាតិ	Sangkruoh Cheat	050713
05071315	ត្រពាំងសាំងជៀក	Trapeang Sang Chiek	050713
05071316	ត្រពាំងរកា	Trapeang Rokar	050713
05071317	ត្រពាំងអំពិល	Trapeang Ampil	050713
05071318	ទួលព្រិច	Tuol Prich	050713
05071319	ព្រៃគុយ	Prey Kuy	050713
05071320	ធ្លក	Thlok	050713
05071321	ថ្មសំលៀង	Thma Samlieng	050713
05071322	ថ្កូវ	Thkov	050713
05071323	ព្នៅ	Pnov	050713
05071324	សំរោង	Samraong	050713
05071325	ឧកញ៉ាទេព	Oknha Tep	050713
05071326	ស្ទឹង	Stueng	050713
05071327	កែវឧត្ដម	Kaev Otdom	050713
05071328	រំដួល	Rumduol	050713
05071329	ព្រៃសុភី	Prey Sophi	050713
05071401	តាំងគម្ពីរ	Tang Kumpir	050714
05071402	ទំព័រមាស	Tumpoar Meas	050714
05071403	ក្រាំងស្ដុក	Krang Sdok	050714
05071404	ទឹកស្អុយ	Tuek S'oy	050714
05071405	ពញាអោង	Phnhea Aong	050714
05071406	បាយស្រា	Bay Sra	050714
05071407	តាំងកន្ទួត	Tang Kantuot	050714
05071408	តាំងស្នោ	Tang Snao	050714
05071409	ហោងខ្វាវ	Haong Khvav	050714
05071410	ជ្រលងញ៉ូស	Chrolong Nhous	050714
05071411	កំពង់ល្វា	Kampong Lvea	050714
05071412	ពាមឃ្លៃ	Peam Khley	050714
05071413	ប្រជៀវបាត	Prachiev Bat	050714
05071501	ចំបក់	Chambak	050715
05071502	វល្លិសរ	Voa Sar	050715
05071503	ព្រៃកោះ	Prey Kaoh	050715
05071504	រំលោង	Rumloung	050715
05071505	ស្លា	Sla	050715
05071506	ត្បែស	Tbaes	050715
05071507	ចំការរដ្ឋ	Chamkar Rodth	050715
05071508	ចាក់កាំបិត	Chak Kambet	050715
05071509	ដក់ពរ	Dak Por	050715
05071510	គោកព្នៅ	Kouk Pnov	050715
05071511	រំលិចត្នោត	Rumlich Tnaot	050715
05071512	ពងទឹក	Pong Tuek	050715
05071513	ត្រពាំងពោធិ៍	Trapeang Pou	050715
05071514	តាគាំ	Ta Koam	050715
05071515	ទួលសំណាង	Tuol Samnang	050715
05071516	ព្រៃទួល	Prey Tuol	050715
05071517	កណ្ដាល	Kandal	050715
05071518	ក្រាំងពង្រ	Krang Pongro	050715
05071519	ចំការបុស្ស	Chamkar Bos	050715
05071520	បឹងទន្លាប់	Boeng Tonloab	050715
05071521	រកាបាញ់	Roka Banh	050715
05071522	ត្រពាំងសង្កែ	Trapeang Sangkae	050715
05071523	ត្រពាំងខ្ទុំ	Trapeang Khtum	050715
05080101	ថ្មគប់	Thma Kob	050801
05080102	ទំនាប	Tumneab	050801
05080103	កុមារមាស	Komar Meas	050801
05080104	ក្រាំងចំបក់	Krang Chambak	050801
05080105	តាកោង	Ta Kaong	050801
05080106	ថ្នល់បំបែក	Thnal Bambaek	050801
05080107	អូរអង្គំ	Ou Angkum	050801
05080108	ក្រាំងដូង	Krang Doung	050801
05080109	ស្នួល	Snuol	050801
05080110	គោក	Kouk	050801
05080111	ពិស	Pis	050801
05080112	ព្រែក	Preaek	050801
05080113	ព្រៃជ្រៅ	Prey Chrouv	050801
05080114	តាំងហោង	Taing Hoang	050801
05080115	ថ្នល់	Thnal	050801
05080116	តាំងសំរោង	Taing Samrong	050801
05080117	ទឹកចេញ	Tuek Chenh	050801
05080201	តាំងស្ដុក	Tang Sdok	050802
05080202	មនោរម្យ	Monourom	050802
05080203	គោល	Koul	050802
05080204	ថ្នល់	Thnal	050802
05080205	ច្រកខ្លុង	Chrak Khlong	050802
05080206	តាំងរលាំង	Tang Roleang	050802
05080207	ចំបក់ផ្អែម	Chambak Ph'aem	050802
05080208	វាលពន់	Veal Pon	050802
05080209	ចំពារ	Champear	050802
05080210	តាមុំ	Ta Mom	050802
05080401	ព្រៃវែង	Prey Veaeng	050804
05080402	ឡ	La	050804
05080403	តាំងពោធិ៍	Tang Pou	050804
05080404	ត្បែងប្រជាប់	Tbaeng Prachoab	050804
05080405	ត្រពាំងត្រោក	Trapeang Traok	050804
05080406	ត្រាញ់វែង	Tranh Veaeng	050804
05080407	ចំបក់ធំ	Chambak Thum	050804
05080408	ដូនទិព្វ	Doun Tip	050804
05080409	ត្រពាំងក្រើញ	Trapeang Kraeunh	050804
05080410	អន្លង់ជ្រៃ	Anlong Chrey	050804
05080411	ថ្នល់កែង	Thnal Kaeng	050804
05080412	ថ្នល់ទទឹង	Thnal Totueng	050804
05080501	គាម្មនី	Keammoni	050805
05080502	ត្រពាំងត្របែក	Trapeang Trabaek	050805
05080503	ទឹកលង ទី ១	Tuek Long Ti Muoy	050805
05080504	ទឹកលង ទី ២	Tuek Long Ti Pir	050805
05080505	ត្បែង	Tbaeng	050805
05080506	អង្គ	Angk	050805
05080507	ថ្មី	Thmei	050805
05080508	រលាំងថ្លើង	Roleang Thlaeung	050805
05080509	ចំបក់សរ	Chambak Sar	050805
05080510	ក្រាំងតាចរ	Krang Ta Char	050805
05080601	ស្វាយព្រៃ	Svay Prey	050806
05080602	ព្រៃសំរោង	Prey Samraong	050806
05080603	ត្រពាំងដងទឹក	Trapeang Dang Tuek	050806
05080604	អញ្ញាសេះ	Anhaseh	050806
05080605	ស្ដៅវស្សា	Sdau Vossa	050806
05080606	ស្រែអណ្ដូង	Srae Andoung	050806
05080607	អូរស្នួល	Ou Snuol	050806
05080701	អូរក្រសារ	Ou Krasar	050807
05080702	ដុំខ្វិត	Dom Khvet	050807
05080703	ទេពភិរម្យ	Tep Phirum	050807
05080704	ទទឹងថ្ងៃ	Totueng Thngai	050807
05080705	បន្ទាយល្វើ	Banteay Lveu	050807
05080706	កន្ធាំ	Kanthoam	050807
05080707	រាមកណ្ដាល	Ream Kandal	050807
05080708	តាំងបន្ទាយ	Tang Banteay	050807
05080709	អំពិលក្ដារ	Ampil Kdar	050807
05080710	ព្រៃមិច	Prey Mich	050807
05080711	ស្យា	Sya	050807
05080712	ព្រៃមិច១	Prey Mich 1	050807
05080713	ទេវាមានជ័យ	Tevea Mean Chey	050807
05080801	ល្វាទេ	Lvea Te	050808
05080802	ថ្មីជង្រុក	Thmei Chongruk	050808
05080803	ស្វាយ	Svay	050808
05080804	ព្រៃធំ	Prey Thum	050808
05080805	ទួលថ្មី	Tuol Thmei	050808
05080806	ត្រោកលាក់	Traok Leak	050808
05080807	រលាំងបែង	Roleang Baeng	050808
05080808	ក្រាំងរំពាក់	Krang Rumpeak	050808
05080809	ព្រៃទីទុយ	Prey Tituy	050808
05080810	ពាណិជ្ជ	Peanich	050808
05080811	រំចេក	Rumchek	050808
05080812	ព្រិចខ្ពស់	Prich Khpos	050808
05080813	ក្រវៀក	Kraviek	050808
05080814	ស្យា	Sya	050808
06010101	បាក់ស្នាក្រោម	Bak Sna Kraom	060101
06010102	បាក់ស្នាលើ	Bak Sna Leu	060101
06010103	អណ្ដោត	Andaot	060101
06010104	ដោម	Daom	060101
06010105	ត្រពាំងទូក	Trapeang Touk	060101
06010106	អូរចំរេះ	Ou Chamres	060101
06010107	កំពង់ពោន	Kampong Pon	060101
06010201	ត្រស់	Tras	060102
06010202	ស្រឡៅតូង	Sralau Toung	060102
06010203	យាយទៀង	Yeay Tieng	060102
06010204	បល្ល័ង្គ	Ballangk	060102
06010205	តាឌុក	Ta Duk	060102
06010206	ព្រៃស្រង៉ែ	Prey Srangae	060102
06010207	ត្រពាំងជ្រៃ	Trapeang Chrey	060102
06010208	តាភោគ	Ta Phouk	060102
06010209	ព្រៃតាត្រាវ	Prey Ta Trav	060102
06010210	ដូង	Doung	060102
06010211	ជ័យមង្គល	Chey Mongkol	060102
06010212	ត្រពាំងស្វាយ	Trapeang Svay	060102
06010213	ដូនដួង	Doun Duong	060102
06010214	បារាយណ៌ជាន់ដែក	Baray Chorn Daek	060102
06010215	បឹងសំរិទ្ធ	Boeung Samrith	060102
06010301	ក្រសាំងជ័យ	Krasang Chey	060103
06010302	បារាយណ៍តូច	Baray Touch	060103
06010303	បារាយណ៍ធំ	Baray Thum	060103
06010304	ថ្នល់ថ្មី	Thnal Thmei	060103
06010305	ថ្នល់ជាតិ	Thnal Cheat	060103
06010306	ស្វាយ	Svay	060103
06010307	ជីអោក	Chi Aok	060103
06010308	សំរោង	Samraong	060103
06010309	អូរសួស្ដី	Ou Suosdei	060103
06010310	ចតុលោក	Chakto Louk	060103
06010311	ពោធិ៍ពីរ	Pou Pir	060103
06010312	បាណក	Banak	060103
06010401	បឹងខាងជើង	Boeng​ Khang Cheung	060104
06010402	បឹងកណ្ដាល	Boeng Kandal	060104
06010403	បឹងខាងត្បូង	Boeng​ Khang Tboung	060104
06010404	ដូនប៉ែន	Doun Paen	060104
06010405	ត្រពាំងឈូក	Trapeang Chhuk	060104
06010501	ពណ្ណរាយ	Ponnoreay	060105
06010502	សំពៅលូន	Sampov Lun	060105
06010503	ត្រដែត	Tradaet	060105
06010504	ពងទឹក	Pong Tuek	060105
06010505	ព្រៃដុំ	Prey Dom	060105
06010506	ចើងដើង	Chaeung Daeung	060105
06010507	តាអោង	Ta Aong	060105
06010508	បឹង	Boeng	060105
06010509	ពន្លៃ	Ponley	060105
06010510	ប្រនាគ	Praneak	060105
06010701	ឈូកខ្សាច់	Chhuk Khsach	060107
06010702	តាប្រុក	Ta Prok	060107
06010703	ជាំត្រាច	Choam Trach	060107
06010704	ដូនតុំ	Doun Tom	060107
06010705	ចាន់ល្ហង	Chan Lhang	060107
06010706	ក្ដាមហា	Kdam Ha	060107
06010707	ឆ្ពេន	Chhpen	060107
06010708	ថ្មី	Thmei	060107
06010709	ប្រាសាទ	Prasat	060107
06010710	ផ្លូវទទឹង	Phlov Totueng	060107
06010711	ផ្លូវទ្រាស	Phlov Treas	060107
06010712	សិរីសុខុម	Serei Sokhom	060107
06010713	សិរីរាជ្យ	Serei Reach	060107
06010714	សង្កែជ្រុំ	Sangkae Chrum	060107
06010801	ទួលដំណាក់	Tuol Damnak	060108
06010802	សំរោង	Samraong	060108
06010803	ខ្សាច់ល្អិត	Khsach L'et	060108
06010804	គូរ	Kur	060108
06010805	ទួលសាលា	Tuol Sala	060108
06010806	កំប៉ើយ	Kampaeuy	060108
06010807	ពពេជ	Popech	060108
06010808	ចុងដូង	Chong Doung	060108
06011001	ល្បើក	Lbaeuk	060110
06011002	ពោន	Poun	060110
06011003	អន្លង់ថ្ម	Anlong Thma	060110
06011004	អន្លង់វែង	Anlong Veaeng	060110
06011005	តាពៅ	Ta Pov	060110
06011006	ទូកពីរ	Tuk Pir	060110
06011007	វាលធំ	Veal Thum	060110
06011008	ត្រពាំងសង្កែ	Trapeang Sangkae	060110
06011009	វាលស្ពរ	Veal Spor	060110
06011101	ក្រវ៉ា	Krava	060111
06011102	កំពង់ស្ដេច	Kampong Sdach	060111
06011103	ព្រៃរលាប	Prey Roleab	060111
06011104	ចារ	Char	060111
06011105	លាវ	Leav	060111
06011106	រូង	Rung	060111
06011107	ស្លាកែត	Sla Kaet	060111
06011108	ពង្រលីង	Pongro Ling	060111
06011701	ត្នោតជុំទី ១	Tnaot Chum Ti Muoy	060117
06011702	ត្នោតជុំទី ២	Tnaot Chum Ti Pir	060117
06011703	ត្នោតជុំទី ៣	Tnaot Chum Ti Bei	060117
06011704	ត្នោតជុំទី ៤	Tnaot Chum Ti Buon	060117
06011705	ព្នៅ	Pnov	060117
06011706	ព្រែកក្រោល	Preaek Kraol	060117
06011707	បន្ទាយចាស់	Banteay Chas	060117
06011708	ថ្មី	Thmei	060117
06011709	កងមាស	Kang Meas	060117
06020101	មហរ៍	Mohar	060201
06020102	តាធាវ	Ta Theav	060201
06020103	ល្វា	Lvea	060201
06020104	ត្រពាំងអារ័ក្ស	Trapeang Areaks	060201
06020105	ព្រៃទប់	Prey Tob	060201
06020106	កូនត្នោត	Koun Tnaot	060201
06020201	សង្គម	Sangkum	060202
06020202	កប់ថ្លុក	Kab Thlok	060202
06020203	មង្គលស្លា	Mongkol Sla	060202
06020204	វល្លិយាវ	Voa Yeav	060202
06020205	ដំរីស្លាប់	Damrei Slab	060202
06020301	កំពង់គោលើ	Kampong Kou Leu	060203
06020302	កំពង់គោក្រោម	Kampong Kou Kraom	060203
06020303	ខ្សាច់ជីរស់	Khsach Chi Ros	060203
06020304	បូពឹង	Bou Pueng	060203
06020305	កោះគ្របបាយ	Kaoh Krob Bay	060203
06020401	កំពង់ស្វាយ	Kampong Svay	060204
06020402	តៀមចាស់	Tiem Chas	060204
06020403	ត្នោត	Tnaot	060204
06020404	ឥន្ទកុមារ	Enteak Komar	060204
06020405	ចុងព្រៃ	Chong Prey	060204
06020406	ព្រៃព្រះ	Prey Preah	060204
06020407	តាប៉ោង	Ta Paong	060204
06020408	តាអាំ	Ta Am	060204
06020409	ច្រាំងក្រហម	Chrang Kraham	060204
06020410	អូរសាលា	Ou Sala	060204
06020411	អន្លង់ក្រសាំង	Anlong Krasang	060204
06020412	សូជៃ	Souchey	060204
06020501	នីពេជ ក	Nipech ka	060205
06020502	នីពេជ ខ	Nipech Kha	060205
06020503	ដូនឈូក	Doun Chhuk	060205
06020601	កំពង់ចំលង	Kampong Chamlang	060206
06020602	ផាត់សណ្ដាយ	Phat Sanday	060206
06020603	នាងសាវ	Neang Sav	060206
06020604	ទួលនាងសាវ	Tuol Neang Sav	060206
06020605	កោះតាពៅ	Kaoh Ta Pov	060206
06020701	ប្រាសាទ	Prasat	060207
06020702	បល្ល័ង្គ	Balang	060207
06020703	តាំងក្រូច	Tang Krouch	060207
06020704	វាល	Veal	060207
06020705	ជ័យ	Chey	060207
06020706	ស្លែងខ្ពស់	Slaeng Khpos	060207
06020707	សារី	Sari	060207
06020708	សំពៅមាស	Sampov Meas	060207
06020709	ក្បិល	Kbel	060207
06020710	អំពិល	Ampil	060207
06020711	សាន់គ ក	San Kor Ka	060207
06020712	សាន់គ ខ	San Kor Kha	060207
06020713	ក្រសាំង ក	Krasang Ka	060207
06020714	ក្រសាំង ខ	Krasang Kha	060207
06020801	ត្រាច	Trach	060208
06020802	តារាម	Ta Ream	060208
06020803	ឫស្សីជះ	Ruessei Cheah	060208
06020804	ពោធិ៍	Pou	060208
06020805	ព្រៃប្រស់	Prey Pras	060208
06020806	បឹងអណ្ដែង	Boeng Andaeng	060208
06020807	តាអាំ	Ta Am	060208
06020808	ត្បែង ក	Tbaeng Ka	060208
06020809	ត្បែង ខ	Tbaeng Kha	060208
06020810	បាគង់	Bakong	060208
06020811	ត្រាំខ្លា	Tram Khla	060208
06020812	ស្រង៉ែ	Srangae	060208
06020813	អូរអំបែង	Ou Ambaeng	060208
06020814	ភ្លង	Phlong	060208
06020815	ឈើទាល	Chheu Teal	060208
06020901	ព្រៃព្រាល ក	Prey Preal Ka	060209
06020902	ព្រៃព្រាល ខ	Prey Preal Kha	060209
06020903	ប្រាសាទ	Prasat	060209
06020904	រូង	Rung	060209
06020905	រមាំងងាប់	Romeang Ngoab	060209
06020906	ស្នោ	Snao	060209
06020907	ត្រពាំងថ្ម	Trapeang Thma	060209
06020908	វល្លិយាវ	Voa Yeav	060209
06020909	ថ្មល់បែក	Thnal Baek	060209
06020910	ត្រពាំងព្រលិត	Trapeang Prolit	060209
06020911	គោកងួន	Kouk Nguon	060209
06020912	ក្រសាំង	Krasang	060209
06020913	ល្វាជោម	Lvea Choum	060209
06020914	សំរោង	Samraong	060209
06020915	ត្រពាំងឫស្សី	Trapeang Ruessei	060209
06020916	សេរីវង្ស	Serei Vongs	060209
06020917	ល្វៃ	Lvey	060209
06020918	ត្រពាំងចំបក់	Trapeang Chambak	060209
06020919	អូររំដេង	Ou Rumdeng	060209
06020920	ថ្មល់បែក ក	Thnal Baek Ka	060209
06021001	ក្ដីដូង	Kdei Doung	060210
06021002	ពាមក្រែង	Peam Kraeng	060210
06021003	អូរសំបួរ	Ou Sambuor	060210
06021004	ស្លែង	Slaeng	060210
06021101	ព្រៃគុយ	Prey Kuy	060211
06021102	អន្លង់លោក	Anlong Louk	060211
06021103	សំបួរ	Sambuor	060211
06021104	បិណ្ដី	Bendei	060211
06021105	ព្រេន	Pren	060211
06021106	កំពង់ក្របី	Kampong Krabei	060211
06021107	ស្វាយឃ្លោក	Svay Khlouk	060211
06021108	ព្រៃគុយ ក	Prey Kuy Ka	060211
06030101	បល្ល័ង្កកើត	Ballangk  Kaeut	060301
06030102	បល្ល័ង្កលិច	Ballangk Lech	060301
06030103	ពោធិបាក់ក	Pou Bak Ka	060301
06030104	ដំរីជាន់ខ្លា	Damrei Choan Khla	060301
06030201	ភូមិទី ១	Phum Ti Muoy	060302
06030202	ភូមិទី ២	Phum Ti Pir	060302
06030203	ភូមិទី ៣	Phum Ti Bei	060302
06030204	ភូមិទី ៤	Phum Ti Buon	060302
06030205	ភូមិទី ៥	Phum Ti Pram	060302
06030206	ភូមិទី ៦	Phum Ti Prammuoy	060302
06030207	ភូមិទី ៧	Phum Ti Prampir	060302
06030301	កំពង់ធំ	Kampong Thum	060303
06030302	កំពង់រទេះ	Kampong Roteh	060303
06030401	ព្រែកស្បូវ	Preaek Sbov	060304
06030402	អូរកន្ធរត្បូង	Ou Kanthor Tboung	060304
06030403	អូរកន្ធរខាងជើង	Ou Kanthor Cheung	060304
06030404	បឹងលៀស	Boeng Leas	060304
06030601	ស្នែងក្របី	Snaeng Krabei	060306
06030602	ស្ទឹងសែន	Stueng Saen	060306
06030603	កំពង់ក្របៅ	Kampong Krabau	060306
06030801	ស្លាកែត	Sla Kaet	060308
06030802	ក្ដី	Kdei	060308
06030803	ព្រៃតាហ៊ូ	Prey Ta Hu	060308
06030901	ក្រចាប់	Krachab	060309
06030902	អាចារ្យលាក់	Achar Leak	060309
06030903	ព្រៃបន្លិច	Prey Banlech	060309
06031001	រលួស	Roluos	060310
06031002	ប្រម៉ាត់ដី	Pramat Dei	060310
06031003	កំពង់សំរោង	Kampong Samraong	060310
06031004	ពោធិសែនស្នាយ	Pou Saen Snay	060310
06031005	ពោធិតាអ៊ុន	Pou Ta Un	060310
06031006	ត្រពាំងវែង	Trapeang Veaeng	060310
06031007	ស្រយ៉ូវជើង	Srayov Cheung	060310
06031008	ស្រយ៉ូវត្បូង	Srayov Tboung	060310
06031009	ពុកយុក	Puk Yuk	060310
06031010	ម្នាវ	Mneav	060310
06031011	ចំបក់	Chambak	060310
06031012	កំរ៉ែង	Kamraeng	060310
06031013	រកា	Roka	060310
06040101	ដូង	Doung	060401
06040102	គគរ	Kokor	060401
06040103	គ្រួរ	Kruor	060401
06040104	តាមុំ	Ta Mom	060401
06040105	ក្របៅ	Krabau	060401
06040106	គ្រួស	Kruos	060401
06040107	ដងផ្ដៀក	Dang Phdiek	060401
06040108	ដងតាឯក	Dang Ta Aek	060401
06040201	សង្វាត	Sangvat	060402
06040202	ក្រយាជើង	Kraya Cheung	060402
06040203	ក្រយាត្បូង	Kraya Tboung	060402
06040204	បារាយណ៍	Baray	060402
06040205	អន្លង់ជួរ	Anlong Chuor	060402
06040206	បុស្សធំ	Bos Thum	060402
06040301	ត្រពាំងក្នុង	Trapeang Knong	060403
06040304	ព្រៃម្រ៉ី	Prey Mari	060403
06040305	ក្រញូង	Kranhung	060403
06040306	ព្រហ៊ូត	Prohut	060403
06040307	ស្មោញ	Smaonh	060403
06040308	សុជុល	Sochol	060403
06040401	សាគ្រាមជើង	Sakream Cheung	060404
06040402	វាលថ្មល់	Veal Thnal	060404
06040403	អូរខ្សង់	Ou Khsang	060404
06040404	ព្រិច	Prich	060404
06040405	ស្រែវាល	Srae Veal	060404
06040406	អូរអង្គរ	Ou Angkor	060404
06040407	ត្រពាំងព្រីង	Trapeang Pring	060404
06040408	កន្ទាក	Kanteak	060404
06040409	វាលចាស់	Veal Chas	060404
06040410	ពាមអាទិត្យ	Peam Atit	060404
06040411	សាគ្រាមត្បូង	Sakream Tboung	060404
06040501	ត្រពាំងក្រោល	Trapeang Kraol	060405
06040502	បុស្សវែង	Bos Veaeng	060405
06040503	ឫស្សីដូច	Ruessei Douch	060405
06040504	ស្រែ	Srae	060405
06040505	ចំណារ	Chamnar	060405
06040506	អូរក្រូច	Ou Krouch	060405
06040507	សាលាវិស័យ	Sala Visai	060405
06040508	អណ្ដាស	Andas	060405
06040509	ត្រពាំងផ្ដៀក	Trapeang Phdiek	060405
06040510	ត្រពាំងថ្ម	Trapeang Thma	060405
06040511	បុស្សស្រមោច	Bos Sramaoch	060405
06040512	វាលល្ពាក់	Veal Lpeak	060405
06040513	ខ្មាក់	Khmak	060405
06040514	តាឡែក	Talaek	060405
06040515	ដងអន្ទាក់	Dang Anteak	060405
06040516	ជ័យ	Chey	060405
06040517	គគីរ	Kokir	060405
06040518	ក្វាន់ទៀង	Kvan Tieng	060405
06040519	សាលាពពេល	Sala Popel	060405
06040601	ថ្មី	Thmei	060406
06040602	ត្រាច	Trach	060406
06040603	កំពឺត	Kampeut	060406
06040604	ចាន់សេរី	Chan Serei	060406
06040605	សំរោង	Samraong	060406
06040701	ជន្លូស	Chonlus	060407
06040702	ម្រាក  ក	Mreak Ka	060407
06040703	ម្រាក  ខ	Mreak Kha	060407
06040704	ក្រពើ	Krapeu	060407
06040705	ទួលគ្រើល	Tuol Kreul	060407
06040706	ធំ	Thum	060407
06040707	ថ្នល់	Thnal	060407
06050101	អន្សរក្រហាយ	Aksar Krahay	060501
06050102	សេរីសុខា	Serei Sokha	060501
06050103	ឈូកបឹង	Chhuk Boeng	060501
06050104	ឈូកស្ទឹង	Chhuk Stueng	060501
06050105	ស្អៀរ	S'ier	060501
06050106	ឈូកគ្រួស	Chhuk Kruos	060501
06050107	អន្លង់ស្លែង	Anlong Slaeng	060501
06050108	បឹងខ្វែក	Boeng Khvaek	060501
06050109	ក្របៅ	Krabau	060501
06050110	កំពីងតាគង់	Kamping Ta Kong	060501
06050111	តាអោក	Ta Aok	060501
06050112	ប្រាសាទ	Prasat	060501
06050113	វាលវែង	Veal Veaeng	060501
06050114	អន្លង់ខ្ទុំ	Anlong Khtum	060501
06050115	ទឹកអណ្ដូង	Tuek Andoung	060501
06050116	ត្រពាំងសាលា	Trapeang Sala	060501
07061303	ធ្នង់	Thnong	070613
06050201	កំពង់ជ្វា	Kampong Chvea	060502
06050202	អូរតាសៀវ	Ou Ta Siev	060502
06050203	ចំរេះ	Chamreh	060502
06050204	បាក់ស្រី	Bak Srei	060502
06050205	ទួលចារ	Tuol Char	060502
06050206	ទួលធ្នង់	Tuol Thnong	060502
06050207	បញ្ចឡា	Panhchak La	060502
06050208	ក្យូវ	Kyov	060502
06050209	ឈើទាលជ្រុំ	Chheu Teal Chrum	060502
06050210	កំពង់លុក	Kampong Luk	060502
06050211	ទួលពង្រ	Tuol Pongro	060502
06050301	កំពង់ឈើទាល	Kampong Chheu Teal	060503
06050302	សំបូរ	Sambour	060503
06050303	សំរិត	Samret	060503
06050304	ច្រម៉ាស់	Chramas	060503
06050305	កូនក្អែក	Koun K'aek	060503
06050306	ជាយសំពៅ	Cheay Sampov	060503
06050307	ពោធិ៍ទ្រេត	Pou Tret	060503
06050308	ច្រនៀង	Chranieng	060503
06050309	ព្រែក	Preaek	060503
06050310	ចារជ្រុំ	Char Chrum	060503
06050311	ត្រពាំងជ្រូក	Trapeang Chrok	060503
06050312	ប្រឡាយ	Pralay	060503
06050313	ចារ្យ	Char	060503
06050314	អូរគ្រូកែ	Ou Kru Kae	060503
06050315	អាត់ស៊ូ	At Su	060503
06050401	ត្នោតជួរ	Tnaot Chuor	060504
06050402	អន្លង់ស្លែង	Anlong Slaeng	060504
06050403	បឹងខ្វែក	Boeng Khvaek	060504
06050404	បេង	Beng	060504
06050405	ស្វាយ	Svay	060504
06050406	ជាំបឹង	Choam Boeng	060504
06050407	ទំនប់	Tumnob	060504
06050408	ថ្មី	Thmei	060504
06050409	ស្រើង	Sraeung	060504
06050501	តាំងក្រសៅ	Tang Krasau	060505
06050502	ព្រៃក្ដី	Prey Kdei	060505
06050503	តាំងស្ទោង	Tang Stoung	060505
06050505	សូរិយា	Souriya	060505
06050506	តាំងក្រង	Tang Krang	060505
06050507	ទឹកអណ្ដូង	Tuek Andoung	060505
06050508	កំពង់ឈើទាល	Kampong Chheu Teal	060505
06050509	គោកស្រុក	Kouk Srok	060505
06050510	ជាំ	Choam	060505
06050511	កំពង់ក្រសាំង	Kampong Krasang	060505
06050512	តាប៉ោង	Ta Paong	060505
06050513	ប្រឡាយ	Pralay	060505
06050514	ជីនាង	Chi Neang	060505
06050515	ក្របៅស្រោង	Krabau Sraong	060505
06060101	ឈើទាល	Chheu Teal	060601
06060102	បឹងរលំ	Boeng Rolum	060601
06060103	កំពង់តាបែន	Kampong Ta Baen	060601
06060104	សំរិត	Samret	060601
06060105	វាលព្រីងក្រោម	Veal Pring Kraom	060601
06060106	កែរ៉ង	Kae Rang	060601
06060107	បឹងប្រា	Boeng Pra	060601
06060108	អណ្ដូងព្រីង	Andoung Pring	060601
06060109	ព្រៃកន្លែង	Prey Kanlaeng	060601
06060110	ជាំផ្កា	Choam Phka	060601
06060111	គន្លងខ្ទីង	Konlong Khting	060601
06060201	ស្រែខ្សាច់	Srae Khsach	060602
06060202	ស្រែវាលខាងលិច	Srae Veal Khang Lech	060602
06060203	ស្រែវាលខាងកើត	Srae Veal Khang Kaeut	060602
06060204	សំព័រតូច	Sampoar Touch	060602
06060205	សំព័រធំ	Sampoar Thum	060602
06060301	ពាមក្លែង	Peam Klaeng	060603
06060302	រកាជួរ	Roka Chuor	060603
06060303	ទឹកវិល	Tuek Vil	060603
06060304	ព្រៃជ័រ	Prey Choar	060603
06060305	ក្លែង	Klaeng	060603
06060306	គុម្ពោតឈូក	Kampout Chhuk	060603
06060307	ត្រកួន	Trakuon	060603
06060308	អង្គរសែនជ័យ	Angkor Sen Chey	060603
06060401	កន្ទីរ	Kantir	060604
06060402	បឹង	Boeng	060604
06060403	សំអោង	Sam Aong	060604
06060404	ជាំស្វាយ	Choam Svay	060604
06060405	ត្បូងទឹក	Tboung Tuek	060604
06060406	ត្រពាំងត្រឡាច	Trapeang Tralach	060604
06060407	រ៉ងក្នាយ	Rang Khnay	060604
06060408	អូរពកសាមគ្គី	Ou Pok Sameakki	060604
06060501	ចេកមួយស្ទង	Chek Muoy Stong	060605
06060502	វាលស្នាយ	Veal Snay	060605
06060503	រនាម	Roneam	060605
06060504	ត្របែក	Trabaek	060605
06060505	រំពុះ	Rumpuh	060605
06060506	ជាន់លែង	Choan Leaeng	060605
06060507	ជាំផល	Choam Phal	060605
06060508	សមរម្យ	Samrom	060605
06060509	ពពឹង	Popueng	060605
06060510	ផ្ទោល	Phtoul	060605
06060511	ថ្មី	Thmei	060605
06060601	ដងទទឹង	Dang Totueng	060606
06060602	ខ្មែរ	Khmer	060606
06060603	ក្រាំងដើម	Krang Daeum	060606
06060604	រវៀង	Rovieng	060606
06060605	ស្រឡៅ	Sralau	060606
06060606	ងន	Ngan	060606
06060607	សំភី	Samphi	060606
06060608	ត្រឹប	Troeb	060606
06060609	វាលព្រីងលើ	Veal Pring Leu	060606
06060610	តាំងក្រសៅ	Tang Krasau	060606
06060611	ក្របីព្រៃ	Krabei Prey	060606
06060612	អូរត្នោត	Ou Tnaot	060606
06060613	ស្វាយ	Svay	060606
06060701	ដង្ហិត	Danghet	060607
06060702	ឈូក	Chhuk	060607
06060703	ក្រសាំង	Krasang	060607
06060704	ស្រែចង់	Srae Chang	060607
06060705	ប្រាសាទអណ្ដែត	Prasat Andaet	060607
06060706	ក្បាលខ្លា	Kbal Khla	060607
06060707	ស្វាយ	Svay	060607
06060709	ទឹកម្លាង	Tuek Mleang	060607
06060710	សណ្ដាន់	Sandan	060607
06060711	កំពង់ត្របែក	Kampong Trabaek	060607
06060712	បាជ័យ	Ba Chey	060607
06060713	ព្រៃគគីរ	Prey Kokir	060607
06060801	រំចេក	Rumchek	060608
06060802	ក្រាំង	Krang	060608
06060803	ពោធិ៍រោង	Pou Roung	060608
06060804	តាយ៉ង	Tayang	060608
06060805	អន្សា	Ansa	060608
06060806	ព្រេន	Pren	060608
06060807	ស្រែព្រីង	Srae Pring	060608
06060901	លែង	Leaeng	060609
06060902	រនាម	Roneam	060609
06060903	រន្ទះ	Ronteah	060609
06060904	ទំអរ	Tum Ar	060609
06060905	ក្បាលដំរី	Kbal Damrei	060609
06060906	សំរោង	Samraong	060609
06060907	ស្រឡៅស្រោង	Sralau Sraong	060609
06060908	ខោស	Khaos	060609
06070101	បឹងល្វា	Boeng Lvea	060701
06070102	កោះបង្គៅ	Kaoh Bangkov	060701
06070103	ត្បែង	Tbaeng	060701
06070104	សង្គ្រោះ	Sangkruoh	060701
06070105	ត្រពាំងទឹម	Trapeang Tuem	060701
06070106	ត្រពាំងប្រី	Trapeang Prei	060701
06070107	អូរអំពិល	Ou Ampil	060701
12011103	ភូមិ ៣	Phum 3	120111
06070108	អូរអង្គុញ	Ou Angkonh	060701
06070109	អូរធំ	Ou Thom	060701
06070110	រំដួលថ្មី	Romdul Thmey	060701
06070111	អូរគ្រញូង	Ou KroNhoung	060701
06070112	អូរគគីរ	Ou Korki	060701
06070113	ត្រពាំងកកោះ	Trapeang Korkos	060701
06070201	ទួលវិហារ	Tuol Vihear	060702
06070202	ជ័យមង្គល	Chey Mongkol	060702
06070203	ស្ដុកស្ដម្ភ	Sdok Sdam	060702
06070204	អូរកោះគគីរ	Ou Kaoh Kokir	060702
06070301	ព្រៃភ្លូ	Prey Phlu	060703
06070302	ធន់មោង	Thon Moung	060703
06070303	ទួលសង្កែ	Tuol Sangkae	060703
06070304	កំពង់ថ្ម	Kampong Thma	060703
06070305	កងសៅ	Kang Sau	060703
06070306	ឈើទាល	Chheu Teal	060703
06070307	ឃ្លៃ	Khley	060703
06070308	ស្នោ	Snao	060703
06070309	ខ្វែក	Khvaek	060703
06070310	ល្អក់	L'ak	060703
06070311	ស្អាង	S'ang	060703
06070401	ជ័យជំនះ	Chey Chumneah	060704
06070402	គីរីវន្ដ	Kiri Von	060704
06070403	ត្បូងក្រពើ	Tboung Krapeu	060704
06070404	ជាយស្បៃ	Cheay Sbai	060704
06070405	ស្វាយកាល់	Svay Kal	060704
06070406	សន្ទុកក្នុង	Santuk Knong	060704
06070407	សន្ទុកក្រៅ	Santuk Krau	060704
06070408	ជីមាឃ	Chi Meakh	060704
06070409	សាលាសន្ទុក	Sala Santuk	060704
06070410	សំណាក	Samnak	060704
06070501	ក្រយា	Kraya	060705
06070502	ទក់	Tok	060705
06070503	ត្រពាំងព្រីង	Trapeang Pring	060705
06070504	ដងក្ដារ	Dang Kdar	060705
06070505	តាម៉ិញ	Ta Menh	060705
06070506	សុភមង្គល	Sopheak Mongkol	060705
06070507	ថ្មសំលៀង	Thma Samlieng	060705
06070508	ឈើទាលជ្រុំ	Chheu Teal Chrum	060705
06070509	ត្រពាំងឫស្សី	Trapeang Ruessei	060705
06070510	អូរទឹកថ្លា	Ou Tuek Thla	060705
06070511	សែនសិរីមង្គល	Saen Serei Mongkul	060705
06070601	ត្រើយអូរ	Traeuy Ou	060706
06070602	ព្នៅ	Pnov	060706
06070603	កងមាស	Kang Meas	060706
06070701	សំពង់	Sampong	060707
06070702	ស៊ីវត្ថា	Sivottha	060707
06070703	ចំបក់ជ្រុំ	Chambak Chrum	060707
06070704	ប្រាសាទ	Prasat	060707
06070705	តាញ៉ោក	Ta Nhaok	060707
06070706	ស្រែតាកោ	Srae Ta Kao	060707
06070707	ត្រើយម្យ៉ាប	Traeuy Myab	060707
06070708	លាវ	Leav	060707
06070709	បន្ទាយយោមរាជ	Banteay Yumreach	060707
06070710	ត្នោតជុំ	Tnaot Chum	060707
06070801	៧មករា	Prampir Meakkakra	060708
06070802	តាំងក្រសាំង	Tang Krasang	060708
06070803	ឈើល្វីង	Chheu Lving	060708
06070804	គគីរជួរ	Kokir Chuor	060708
06070805	ទួលចាន់	Tuol Chan	060708
06070806	ចំបក់ខាងជើង	Chambak Khang Cheung	060708
06070807	សង់ឃ្លាំង	Sang Khleang	060708
06070808	ធម្មនាថ	Thormmeak Neath	060708
06070809	សង្គមថ្មី	Sangkom Thmei	060708
06070810	វាំងខាងជើង	Veang Khang Cheung	060708
06070811	វាំងខាងត្បូង	Veang Khang Tboung	060708
06070901	ទីពោ	Ti Pou	060709
06070902	និម្មិត	Nimit	060709
06070903	ថ្មី	Thmei	060709
06070904	តាព្រាច	Ta Preach	060709
06070905	សំរោង	Samraong	060709
06070906	ឈូករំដួល	Chhuk Rumduol	060709
06070907	ជាំថ្នាញ	Choam Thnanh	060709
06070908	ផ្លុង	Phlong	060709
06070909	ក្បាលបី	Kbal Bei	060709
06070910	ស្រែស្រម៉	Srae Srama	060709
06070911	ត្រពាំងត្រុំ	Trapeang Trom	060709
06070912	សែនអភិវឌ្ឍន៍ ១	Sen Akpiwat 1	060709
06070913	សែនអភិវឌ្ឍន៍ ២	Sen Akpiwat 2	060709
06070914	អូរធំ	Ou Thom	060709
06071001	ពោធិ៍ខាវ	Pou Khav	060710
06071002	បញ្ញាជី	Panhnha Chi	060710
06071003	អំពុះ	Ampuh	060710
06071004	ចុងដា	Chong Da	060710
06071005	កាលមេឃ	Kal Mekh	060710
06080101	ពន្លាជ័យ	Ponlea Chey	060801
06080102	ចន្លុះ	Chanloh	060801
06080103	បេង	Beng	060801
06080104	បន្ទាយស្ទោង	Banteay Stoung	060801
06080105	កុកគ្រួស	Kok Kruos	060801
06080106	គោកសណ្ដែក	Kouk Sandaek	060801
06080107	ឈើទាល	Chheu Teal	060801
06080108	ពោធិ៍	Pou	060801
06080109	ស្លាករ	Sla Kar	060801
06080110	ចំបក់បញ្ញា	Chambak Panhnha	060801
06080111	បរវែង	Bar Veaeng	060801
06080112	រលួស	Roluos	060801
06080113	តាម៉ើ	Ta Maeu	060801
06080114	ស្រោមដែក	Sraom Daek	060801
06080115	ដូនប៉ុក	Doun Pok	060801
06080201	ព្រះនង្គ័ល	Preah Neangkoal	060802
06080202	សំព័រ	Sampoar	060802
06080203	ស្រីរងិត	Srei Rongit	060802
06080204	ស្វាយអៀ	Svay Ie	060802
06080205	នាងនយ	Neang Noy	060802
06080206	សណ្ដាន់	Sandan	060802
06080207	ស្ពានគ្រង	Spean Krong	060802
06080208	ជីអាប់	Chi Ab	060802
06080209	ចំណាក់	Chamnak	060802
06080210	លៀប	Lieb	060802
06080301	ស្រង់	Srang	060803
06080302	ប្រាសាទ	Prasat	060803
06080303	ត្រពាំងជ័រ	Trapeang Choar	060803
06080304	ខ្មាក់	Khmak	060803
06080305	គរ	Kor	060803
06080306	ល្ហុង	Lhong	060803
06080307	អណ្ដូងត្រុំ	Andoung Trom	060803
06080308	ធ្លក	Thlok	060803
06080309	ក្អិន	K'en	060803
06080310	ផ្លោច	Phlaoch	060803
06080401	ត្នោត	Tnaot	060804
06080402	ចេក	Chek	060804
06080403	ចក	Chak	060804
06080404	រកា	Roka	060804
06080405	នាងសល្ងាច	Neang Sa Lngeach	060804
06080406	ត្រាច	Trach	060804
06080501	ឈើទាល	Chheu Teal	060805
06080502	លាបទង	Leab Tong	060805
06080503	កំពង់ក្ដី	Kampong Kdei	060805
06080504	កំពង់ចិន	Kampong Chen	060805
06080505	ជីយោគ	Chi Youk	060805
06080506	ស្វាយស	Svay Sa	060805
06080507	ងួនសៀម	Nguon Siem	060805
06080601	អូរដូង	Ou Doung	060806
06080602	សំបួរត្បូង	Sambuor Tboung	060806
06080603	សំបួរជើង	Sambuor Cheung	060806
06080604	គោកទ្រា	Kouk Trea	060806
06080605	ម្សាក្រងត្បូង	Msa Krang Tboung	060806
06080606	ម្សាក្រងជើង	Msa Krang Cheung	060806
06080607	កំពង់ប្រដំ	Kampong Pradam	060806
06080608	បត់ត្រង់	Bat Trang	060806
06080609	ប្រគាប	Prakeab	060806
06080610	ជីមាស	Chi Meas	060806
06080611	សំប៉ាន	Sampan	060806
06080701	ពៅវើយ	Pov Veuy	060807
06080703	ពាមបាង	Peam Bang	060807
06080705	ដូនស្តើង	Doun Sderng	060807
06080801	សំបួរ	Sambuor	060808
06080802	អន្លង់ក្រាញ់	Anlong Kranh	060808
06080803	កោះសំរោង	Kaoh Samraong	060808
06080804	ក្រសាំង	Krasang	060808
06080805	ខ្ទមមន	Khtom Mon	060808
06080806	ពពក	Popok	060808
06080807	ផ្ទះដើម	Phteah Daeum	060808
06080808	ត្រពាំងឫស្សី	Trapeang Ruessei	060808
06080901	អង់ឃ្លាំ	Ang Khloam	060809
06080902	កំពង់វាំង	Kampong Veang	060809
06080903	ព្រៃខ្លា	Prey Khla	060809
06080904	ប្រឡាយ	Pralay	060809
06080905	គោករវៀង	Kouk Rovieng	060809
06080906	អន្លង់ព្រីង	Anlong Pring	060809
06080907	កំព្រាល	Kampreal	060809
06080908	កន្ធាន	Kanthean	060809
06080909	នាងសល្ងាច	Neang Sa Lngeach	060809
06080910	ថ្មី	Thmei	060809
06080911	ក្រែក	Kraek	060809
06080912	ឈូក	Chhuk	060809
06080913	តាទ្រៀល	Ta Treal	060809
06080914	ស្រែតាម៉ែន	Srae Ta Maen	060809
06081001	សៀមពាយ	Siem Peay	060810
06081002	ជះ	Cheah	060810
06081003	សូភី	Souphi	060810
06081004	លឹក	Luek	060810
06081005	កណ្ដោលចាស់	Kandaol Chas	060810
06081006	កណ្ដោលថ្មី	Kandaol Thmei	060810
06081007	ប្រាសាទ	Prasat	060810
06081008	សំរ៉ង	Samrang	060810
06081009	រលួស	Roluos	060810
06081101	បុសតាសោម	Bos Ta Saom	060811
06081102	កន្ដុងរ៉ុង	Kantong Rong	060811
06081103	ព្រំស្រី	Prum Srei	060811
06081104	ស្វាយរៀង	Svay Rieng	060811
06081105	បទុមលិច	Botum Lech	060811
06081106	បទុមកើត	Botum Kaeut	060811
06081107	កន្ដើប	Kantaeub	060811
06081108	ពោធិ៍	Pou	060811
06081109	ក្ដីចារ្យ	Kdei Char	060811
06081201	ក្រសាំងជ្រុំត្បូង	Krasang Chrum Tboung	060812
06081202	ក្រសាំងជ្រុំជើង	Krasang Chrum Cheung	060812
06081203	ត្នោតគម	Tnaot Kom	060812
06081204	សំព្រោជ	Samprouch	060812
06081205	គោកស្នាយ	Kouk Snay	060812
06081206	ពៃ	Pey	060812
06081207	ចំបក់ខ្ពស់	Chambak Khpos	060812
06081208	ត្រាចជ្រុំ	Trach Chrum	060812
06081209	ពភ្លូក	Pophluk	060812
06081210	អំពិល	Ampil	060812
06081211	មឈាយ	Mochheay	060812
06081212	ដូនល្អ	Doun L'a	060812
06081213	ប្រដិត	Pradet	060812
06081214	ល្វា	Lvea	060812
06081215	អូររំចេក	Ou Rumchek	060812
06081216	អំពៅព្រៃ	Ampov Prey	060812
06081217	ស្លាក់ក្រាញ់	Slak Kranh	060812
06081301	ទទា	Totea	060813
06081302	កោះ	Kaoh	060813
06081303	ហប់	Hab	060813
06081304	វាល	Veal	060813
06081305	សាមក្អោក	Sam K'aok	060813
06081306	ច្រាំងស	Chrang Sa	060813
06081307	ទ្រា	Trea	060813
06081308	បុសតាឯក	Bos Ta Aek	060813
06081309	តាចរ	Ta Char	060813
06081310	លាបទង	Leab Tong	060813
06081311	ផ្ទះវាល	Phteah Veal	060813
06081312	ស្លា	Sla	060813
06081313	ក្រសាំង	Krasang	060813
06081314	កុចទីទុយ	Koch Tituy	060813
06081315	ពពាយ	Popeay	060813
06081316	ទំពេជ	Tumpech	060813
07010101	ត្រពាំងកំភ្លាញ	Trapeang Kamphleanh	070101
07010102	ត្រពាំងខ្យង	Trapeang Khyang	070101
07010103	ត្រពាំងវែង	Trapeang Veaeng	070101
07010104	ពែងធំ	Peaeng Thum	070101
07010105	ព្រៃធំ	Prey Thum	070101
07010201	សាមគ្គី	Sameakki	070102
07010202	ត្រពាំងស្រែ	Trapeang Srae	070102
07010203	អង្គរជ័យលើ	Angkor Chey Leu	070102
07010204	អង្គរជ័យក្រោម	Angkor Chey Kraom	070102
07010205	ព្រៃឈើទាល	Prey Chheu Teal	070102
07010206	អង្គរំដួល	Angk Rumduol	070102
07010301	ខ្វាវ	Khvav	070103
07010302	ក្រសាំង	Krasang	070103
07010303	ទន្លេនាម	Tonle Neam	070103
07010304	ណងសាហេតុ	Nang Sa Het	070103
07010305	ចំប៉ី	Champei	070103
07010306	ស្រែជា	Srae Chea	070103
07010307	អង្គជោតិ	Ang Chorti	070103
07010308	ដើមពោធិ៍	Daeum Pou	070103
07010401	ត្រពាំងត្រកៀត	Trapeang Trakiet	070104
07010402	ស្បូវអណ្ដែត	Sbov Andaet	070104
07010403	ចាក់ជ្រុំ	Chak Chrum	070104
07010404	តាកោ	Ta Kao	070104
07010405	ដងទង់	Dang Tong	070104
07010406	ត្រពាំងត្នោត	Trapeang Tnaot	070104
07010407	របោះខ្ទុម	Robaoh Khtum	070104
07010408	ដំបូកខ្ពស់	Dambouk Khpos	070104
07010409	ត្រពាំងកំណប់	Trapeang Kamnab	070104
07010410	ត្រពាំងរុន	Trapeang Run	070104
07010411	អូរម្កាក់	Ou Mkak	070104
07010501	ពន្លៃ	Ponley	070105
07010502	ដានគោមខាងជើង	Dan Koum Khang Cheung	070105
07010503	ដានគោមខាងត្ប្មូង	Dan Koum Khang Tboung	070105
07010504	អង្គខ្ជាយខាងជើង	Angk Khcheay Khang Cheung	070105
07010505	អង្គខ្ជាយខាងត្បូង	Angk Khcheay Khang Tboung	070105
07010506	ព្រៃខ្ជាយ	Prey Khcheay	070105
07010601	ដើមដូង	Daeum Doung	070106
07010602	ច្រាប	Chrab	070106
07010603	អូររំចេក	Ou Rumchek	070106
07010604	សាដំបង	Sa Dambang	070106
07010701	ព្រះឱង្ការ	Preah Aongkar	070107
07010702	ម្រោម	Mroum	070107
07010703	ត្រពាំងផ្នែល	Trapeang Phnael	070107
07010704	ឈើទាល	Chheu Teal	070107
07010705	គក	Kok	070107
07010706	ភ្នំឆ្មារ	Phnum Chhmar	070107
07010801	ស្រែរោង	Srae Roung	070108
07010802	ស្គរទូង	Skor Tung	070108
07010803	ត្រពាំងចក	Trapeang Chak	070108
07010804	ព្រៃផ្គាំ	Prey Phkoam	070108
07010805	ពោធិ៍	Pou	070108
07010806	ពេជចង្វា	Pech Changva	070108
07010807	ព្រៃផ្ដៅ	Prey Phdau	070108
07010808	ភ្នំត្រែល	Phnum Trael	070108
07010809	ត្រពាំងខ្វា	Trapeang Khva	070108
07010810	សង្កែបង្វែ	Sangkae Bangvaer	070108
07010901	ប្រភ្នំ	Pra Phnum	070109
07010902	ត្រពាំងថ្ងាន់	Trapeang Thngan	070109
07010903	ព្រៃឈើទាល	Prey Chheu Teal	070109
07010904	ព្រៃស្គរ	Prey Skor	070109
07010905	ពងទឹក	Pong Tuek	070109
07010906	ក្រាំងថ្កូវ	Krang Thkov	070109
07010907	ដំណាក់ក្រសាំង	Damnak Krasang	070109
07010908	ឫស្សីដុំ	Ruessei Dom	070109
07010909	ទួលខ្ពស់	Tuol Khpos	070109
07011001	កសិករ	Kaksekar	070110
07011002	ស្ដុក	Sdok	070110
07011003	កម្មករ	Kammeakkar	070110
07011004	ត្រពាំងស្លា	Trapeang Sla	070110
07011005	ប្រស្រែ	Prasrae	070110
07011006	ស្មោង	Smaong	070110
07011007	ត្របៀត	Trabiet	070110
07011101	ត្រពាំងរាំង	Trapeang Reang	070111
07011102	តាព្រាម	Ta Pream	070111
07011103	កាន់ទ្រង់	Kan Trong	070111
07011104	តាកុក	Ta Kok	070111
07011105	ឫស្សី	Ruessei	070111
07011106	ត្រពាំងរុន	Trapeang Run	070111
07011107	ប្រាល	Pral	070111
07020102	ក្រសាំងក្រោម	Krasang Kraom	070201
07020103	ក្រសាំងលើ	Krasang Leu	070201
07020104	ត្រពាំងពោន	Trapeang Poun	070201
07020105	ព្រៃបន្ទាំ	Prey Bantoam	070201
07020106	ស្រែថ្លុក	Srae Thlok	070201
07020107	ពោធិ៍	Pou	070201
07020108	ធ្នង់	Thnong	070201
07020201	លំទំពូង	Lum Tumpung	070202
07020202	កណ្ដាញ់	Kandanh	070202
07020203	កន្សោមអក	Kansaom Ak	070202
07020204	ទង់លាង	Tong Leang	070202
07020205	ត្បាល់កិន	Tbal Ken	070202
07020206	ព្រៃលើ	Prey Leu	070202
07020207	ហុងស៊ុយ	Hong Suy	070202
07020208	បន្ទាយមាស	Banteay Meas	070202
07020209	ក្រាំងបន្ទាយ	Krang Banteay	070202
07020301	ព្រៃទន្លេ	Prey Tonle	070203
07020302	ទួលក្រសាំង	Tuol Krasang	070203
07020303	ព្រែកឫស្សី	Preaek Ruessei	070203
07020304	សំរោងចិន	Samraong Chen	070203
07020305	ម៉ឺនដាំ	Meun Dam	070203
07020401	ត្រពាំងមន្ដ្រី	Trapeang Montrei	070204
07020402	តាអៀក	Ta Iek	070204
07020403	សែនពន្លួង	Saen Ponlung	070204
07020404	សំរោង	Samraong	070204
07020405	តាទេន	Ta Ten	070204
07020406	ក្រាំងដូង	Krang Doung	070204
07020501	បរិវាស	Bariveas	070205
07020502	ដំណាក់ចំបក់	Damnak Chambak	070205
07020503	ដំណាក់ត្រយឹង	Damnak Trayueng	070205
07020504	ត្រាំសសរ	Tram Sasar	070205
07020505	ប្រផុង	Praphong	070205
07020601	ជ្រុងស្រឡៅ	Chrung Sralau	070206
07020602	កន្លង់	Kanlang	070206
07020603	ត្រែង	Traeng	070206
07020604	ពងទឹក	Pong Tuek	070206
07020701	ព្រៃពព្រិច	Prey Po Prich	070207
07020702	រំពើន	Rumpeun	070207
07020703	ចម្លងជ្រៃ	Chamlang Chrey	070207
07020704	ឈើទាល	Chheu Teal	070207
07020705	ដើមចំរៀក	Daeum Chamriek	070207
07020801	សង្កែដួច	Sangkae Duoch	070208
07020802	ឫស្សីជួរ	Ruessei Chuor	070208
07020803	ភ្នំតូច	Phnum Touch	070208
07020804	ស្ដេចគង់	Sdach Kong	070208
07020901	តាឡង់	Ta Lang	070209
07020902	គោកវែង	Kouk Veaeng	070209
07020903	ត្នោត	Tnaot	070209
07020904	ដូនទាវ	Doun Teav	070209
07020905	ឫស្សីជុំ	Ruessei Chum	070209
07020906	ខ្នាយ	Khnay	070209
07020907	សូរិយា	Souriya	070209
07020908	អង្គញ់	Angkunh	070209
07021001	ទ័ពស្ដេច	Toap Sdach	070210
07021002	តាងើត	Ta Ngeut	070210
07021003	ពោន	Poun	070210
07021004	លៀប	Lieb	070210
07021005	ខ្យើម	Khyaeum	070210
07021101	ត្រពាំងក្ដុល	Trapeang Kdol	070211
07021102	គាថាវង្សក្រោម	Keatha Vong Kraom	070211
07021103	គាថាវង្សលើ	Keatha Vong Leu	070211
07021104	សំព័រ	Sampoar	070211
07021105	ព្រៃស្រឡៅ	Prey Sralau	070211
07021201	ត្រពាំងព្រីង	Trapeang Pring	070212
07021202	ស្រែកាន់ចិន	Srae Kan Chen	070212
07021203	ច្រកស្ដៅ	Chrak Sdau	070212
07021204	ស្រែកាន់ខាងកើត	Srae Kan Khang Kaeut	070212
07021205	ស្រែកាន់ខាងលិច	Srae Kan Khang Lech	070212
07021206	អង្គម្លី	Angk Mli	070212
07021301	ទូកមាស	Tuk Meas	070213
07021302	កោះទន្សែ	Kaoh Tonsae	070213
07021303	ច្រកឃ្លៃ	Chrak Khley	070213
07021304	ចំលងជ្រៃ	Chamlang Chrey	070213
07021305	ព្រៃធំ	Prey Thum	070213
07021306	ព្រៃចេក	Prey Chek	070213
07021307	ព្រៃក្រឡាខាងកើត	Prey Krala Khang Kaeut	070213
07021308	ព្រៃក្រឡាខាងលិច	Prey Krala Khang Lech	070213
07021401	ស្រែត្រែង	Srae Traeng	070214
07021402	ត្នោតរលើង	Tnaot Roleung	070214
07021403	ពញាអង្គរ	Ponhea Angkor	070214
07021404	ស្វាយផ្អែម	Svay Ph'aem	070214
07021405	សូប៉េង	Sou Peng	070214
07021501	កណ្ដាល	Kandal	070215
07021502	ខ្នាច	Khnach	070215
07021503	ធាយ	Theay	070215
07021504	ទទឹម	Totuem	070215
07021505	ស្រែព្រៃ	Srae Prey	070215
07030101	តាឡង់	Ta Lang	070301
07030102	ព្រៃឈើនៀង	Prey Chheu Nieng	070301
07030103	តាមុំ	Ta Mom	070301
07030104	ព្រៃភ្ជុំ	Prey Phchum	070301
07030105	ត្រពាំងតាសេក	Trapeang Ta Sek	070301
07030201	ចំការមន	Chamkar Morn	070302
07030203	វាលក្រសាំង	Veal Krasang	070302
07030204	ជ័យតាស្វាយ	Chey Ta Svay	070302
07030205	ដំណាក់ត្រយឹង	Damnak Trayueng	070302
07030206	ត្រពាំងបី	Trapeang Bei	070302
07030207	ស្រកានាគ	Sraka Neak	070302
07030208	ខ្ពប	Khpob	070302
07030209	ជ័យសេនា	Chey Sena	070302
07030210	ត្រពាំងក្ដី	Trapeang Kdei	070302
07030211	ត្រពាំងរុន	Trapeang Run	070302
07030212	ភ្នំព្រាល	Phnum Preal	070302
07030213	មនោសុខ	Monou Sokh	070302
07030301	ស្រង៉ែ	Srangae	070303
07030302	ព្រេច	Prech	070303
07030303	ពោធិ៍ដុះ	Pou Doh	070303
07030304	បឹង	Boeng	070303
07030401	ក្រសាំង	Krasang	070304
07030402	ឈើទាល	Chheu Teal	070304
07030403	ត្រពាំងជ្រៃ	Trapeang Chrey	070304
07030404	ក្រហូង	Krahung	070304
07030501	ព្រៃឃ្មុំ	Prey Khmum	070305
07030502	ក្រសាំងមានជ័យ	Krasang Mean Chey	070305
07030503	ត្រពាំងកកោះ	Trapeang Kakaoh	070305
07030504	កណ្ដាល	Kandal	070305
07030505	ដូនយ៉យ	Doun Yay	070305
07030601	ជ័រដុំ	Choar Dom	070306
07030602	ត្រពាំងលើក	Trapeang Leuk	070306
07030603	ក្រាំងម្ដេង	Krang Mdeng	070306
07030604	ក្រាំងស្បូវ	Krang Sbov	070306
07030605	មន	Mon	070306
07030701	តូច	Touch	070307
07030702	តានាន់	Ta Noan	070307
07030703	ដំណាក់ទ្រព្យខាងជើង	Damnak Toap Khang Cheung	070307
07030704	ដំណាក់ទ្រព្យខាងត្បូង	Damnak Toap Khang Tboung	070307
07030705	ល្វេ	Lve	070307
07030706	ក្រាំងរលួស	Krang Roluos	070307
07030801	ស្រែជ្រៅ	Srae Chrov	070308
07030802	ទួល	Tuol	070308
07030803	ត្រពាំងគុយ	Trapeang Kuy	070308
07030804	ត្រពាំងថ្ម	Trapeang Thma	070308
07030805	ត្រពាំងគគីរ	Trapeang Kokir	070308
07030901	កោះស្លា	Kaoh Sla	070309
07030902	ដុំផ្ដៅ	Dom Phdau	070309
07030903	ព្រៃពាយ	Prey Peay	070309
07030904	ទួលដូនតី	Tuol Doun Tei	070309
07030905	ស្រែលាវ	Srae Leav	070309
07030906	ត្រពាំងស្ដៅ	Trapeang Sdau	070309
07031001	អង្គស្វាយ	Angk Svay	070310
07031002	តាព្រុំ	Ta Prum	070310
07031003	ទុល	Tul	070310
07031004	ព្រៃត្រាង	Prey Trang	070310
07031005	វាលត្បាល់	Veal Tbal	070310
07031101	នារាយណ៍	Neareay	070311
07031102	ពស់ពង	Pos Pong	070311
07031103	ព្រៃស្បូវ	Prey Sbov	070311
07031104	ខ្នាចរមាស	Khnach Romeas	070311
07031201	សត្វពង	Satv Pong	070312
07031202	ព្រៃបែន	Prey Baen	070312
07031203	ត្រពាំងអណ្ដូង	Trapeang Andoung	070312
07031204	ជ្រៃ	Chrey	070312
07031301	ដំណាក់ឈ្នួល	Damnak Chhnuol	070313
07031302	ត្រពាំងល្បើក	Trapeang Lbaeuk	070313
07031303	ត្រពាំងបី	Trapeang Bei	070313
07031304	កោះឫស្សី	Kaoh Ruessei	070313
07031401	ឈើទាលជ្រុំ	Chheu Teal Chrum	070314
07031402	ត្រមែង	Tramaeng	070314
07031403	ប្រមូល	Pramoul	070314
07031404	អង្គឃ្លៃ	Ang Khley	070314
07031405	ត្រពាំងបឹង	Trapeang Boeng	070314
07031501	តេជោអភិវឌ្ឍន៌	Te Chour Apiwat	070315
07031502	តេជោក្បាលដំរី	Te Chour Kbal Damrey	070315
07031503	តេជោអង្កាញ់	Te Chour Angkanh	070315
07031504	តេជោពង្រក	Te Chour Pongrok	070315
07031505	តេជោជ្រៃបាក់	Te Chour Chreybak	070315
07031506	តេជោអន្លងក្មេងលេង	Te Chour Anlong Kmeng Leng	070315
07040101	តាទែន	Ta Teaen	070401
07040102	ត្រពាំងឈើទាល	Trapeang Chheu Teal	070401
07040103	ធ្មា	Thmea	070401
07040104	ច្រេស	Chres	070401
07040201	ឃ្លៃ	Khley	070402
07040202	មនោណុប	Monou Nob	070402
07040203	កណ្ដាល	Kandal	070402
07040204	ឈើទាល	Chheu Teal	070402
07040205	ចេក	Chek	070402
07040206	ដំរីកូន	Damrei Koun	070402
07040207	ថ្មី	Thmei	070402
07040301	ស្នាយអញ្ជិត	Snay Anhchit	070403
07040302	ដូនឪ	Doun Ov	070403
07040303	តាភុល	Ta Phol	070403
07040304	ព្រៃឃ្ជាយ	Prey Khcheay	070403
07040305	ដំណាក់ឈើក្រំ	Damnak Chheu Kram	070403
07040401	កំណប់	Kamnab	070404
07040402	ខ្ពបរុន	Khpob Run	070404
07040403	ព្រៃឃ្លៃ	Prey Khley	070404
07040404	ពងទឹក	Pong Tuek	070404
07040405	ស្រែចែង	Srae Chaeng	070404
07040501	ដូង	Doung	070405
07040502	ព្រៃវែង	Prey Veaeng	070405
07040503	ព្រៃខ្មៅ	Prey Khmau	070405
07040504	ព្រៃយ៉ាវ	Prey Yav	070405
07040505	ដំណាក់ឈ្នួល	Damnak Chhnuol	070405
07040506	ត្បែងពក	Tbaeng Pok	070405
07040601	ធ្លកយុល	Thlok Yul	070406
07040602	ស្រែសំរោង	Srae Samraong	070406
07040603	ត្រពាំងប្រី	Trapeang Prei	070406
07040604	រកាថ្មី	Roka Thmei	070406
07040605	ពោធិ៍	Pou	070406
07040701	ត្រពាំងវែង	Trapeang Veaeng	070407
07040702	រវៀង	Rovieng	070407
07040703	តារាជ	Ta Reach	070407
07040704	ត្រពាំងស្គន់	Trapeang Skon	070407
07040705	អូរ	Ou	070407
07050101	ត្រពាំងតាមាស	Trapeang Ta Meas	070501
07050102	អង្គ រពាក់	Angk Ropeak	070501
07050103	ឃ្ជាយខាងលិច	Khcheay Khang Lech	070501
07050104	ត្រពាំងឫស្សី	Trapeang Ruessei	070501
07050105	ក្រាំងអំពៅ	Krang Ampov	070501
07050201	ធំថ្មី	Thum Thmei	070502
07050202	ច្រកកែស	Chrak Kaes	070502
07050203	ត្រពាំងម្នាស់	Trapeang Mnoas	070502
07050204	ឃ្ជាយខាងជើង	Khcheay Khang Cheung	070502
07050205	ត្រពាំងវែងខាងកើត	Trapeang Veaeng Khang Kaeut	070502
07050206	ត្រពាំងវែងខាងលិច	Trapeang Veaeng Khang Lech	070502
07050207	ស្រូវលើ	Srov Leu	070502
07050208	ឃ្ជាយខាងត្បូង	Khcheay Khang Tboung	070502
07050209	ព្រៃពក	Prey Pok	070502
07050210	ព្រៃគគីរ	Prey Kokir	070502
07050211	ស្រូវក្រោម	Srov Kraom	070502
07050301	ព្រៃឃ្មុំ	Prey Khmum	070503
07050302	ព្រៃសំណាងលើ	Prey Samnang Leu	070503
07050303	ព្រៃសំណាងក្រោម	Prey Samnang Kraom	070503
07050304	កំរ៉ែងក្រសាំង	Kamraeng Krasang	070503
07050305	ដំណាក់	Damnak	070503
07050401	ដំណាក់ត្រយឹង	Damnak Trayueng	070504
07050402	ឈ្លីតក្រោម	Chhlit Kraom	070504
07050403	ឈ្លីតលើ	Chhlit Leu	070504
07050404	ត្រពាំងអណ្ដូង	Trapeang Andoung	070504
07050501	ព្រៃក្រាំងខាងជើង	Prey Krang Khang Cheung	070505
07050502	ព្រៃក្រាំងខាងត្បូង	Prey Krang Khang Tboung	070505
07050503	ក្រាំងលាវ	Krang Leav	070505
07050504	ត្រពាំងឈូក	Trapeang Chhuk	070505
07050601	សុភី	Sophi	070506
07050602	ប្រីពីរ	Prei Pir	070506
07050603	ព្រានទុំ	Prean Tum	070506
07050604	ត្រពាំងច្រនៀង	Trapeang Chranieng	070506
07050701	ត្រពាំងក្ដារ	Trapeang Kdar	070507
07050702	ខ្ពស់	Khpos	070507
07050703	អូរឫស្សី	Ou Ruessei	070507
07050801	ភ្នំតូច	Phnum Touch	070508
07050802	ទួលខ្ពស់	Tuol Khpos	070508
07050803	ចង្កៀងខាងកើត	Changkieng Khang Kaeut	070508
07050804	ចង្កៀងខាងលិច	Changkieng Khang Lech	070508
07050805	ស្ដុកធ្លក	Sdok Thlok	070508
07050806	ដំរីលេង	Damrei Leng	070508
07050807	ត្រពាំងនៀល	Trapeang Niel	070508
07050808	អូរកណ្តោល	Ou Kandal	070508
07050809	ឃ្ជាយខាងកើត	Khcheay Khang Kaeut	070508
07050901	ត្រពាំងរាំង	Trapeang Reang	070509
07050902	អន្ទងបែក	Antong Baek	070509
07050903	ស្នោតូច	Snaor Touch	070509
07050904	ពន្លៃ	Ponley	070509
07050905	បរក្នុង	Bar Knong	070509
07051001	ត្រពាំងសេះ	Trapeang Seh	070510
07051002	បើន	Baeun	070510
07051003	ដំណាក់អំពិល	Damnak Ampil	070510
07051004	ល្អាង	L'ang	070510
07060101	កោះទ្រមូង	Kaoh Tromung	070601
07060102	ដាសស្គរ	Das Skor	070601
07060103	កោះម៉ាក់ប្រាំង	Kaoh Makprang	070601
07060104	ព្រៃទប់	Prey Tob	070601
07060201	កោះចំការ	Kaoh Chamkar	070602
07060202	ជ្រេស	Chres	070602
07060203	ស្វាយផ្អែម	Svay Ph'aem	070602
07060301	អូរស្លែង	Ou Slaeng	070603
07060302	ព្រៃកែស	Prey Kes	070603
07060303	អូរពពូល	Ou Popul	070603
07060304	ភ្នំដំរី	Phnum Damrei	070603
07060401	ដំណាក់កន្ទួត	Damnak Kantuot	070604
07060402	អូររលួស	Ou Roluos	070604
07060403	អង្គរជ័យទី ១	Angkor Chey Ti  Muoy	070604
07060404	អង្គរជ័យទី ២	Angkor Chey  Ti  Pir	070604
07060405	ត្រពាំងជ្រៃ	Trapeang Chrey	070604
07060501	កំពង់ត្រាចទី ១	Kampong Trach Ti  Muoy	070605
07060502	កោះខ្លូត	Kaoh Khlout	070605
07060503	កោះតាចាន់	Kaoh Ta Chan	070605
07060504	របងក្រាស	Robang Kras	070605
07060601	កណ្តាលទួល	Kandal Tuol	070606
07060602	អង្រ្គង	Angkrong	070606
07060603	ភ្នំសាឡី	Phnum Salei	070606
07060604	ដើមចារ	Daeum Char	070606
07060605	កោះផ្ដៅ	Kaoh Phdau	070606
07060606	អូរច្រនៀង	Ou Chranieng	070606
07060607	កំពង់ត្រាចទី ២	Kampong Trach Ti  Pir	070606
07060701	ព្រៃកឹក	Prey Koek	070607
07060702	ភ្នំខ្យង	Phnum Khyang	070607
07060703	ជ្រោះតាសោម	Chruoh Ta Saom	070607
07060801	ច្រនៀងទេ	Chranieng Te	070608
07060802	បង់បក់	Bang Bat	070608
07060803	ភ្នំប្រសាទ	Phnom Prasat	070608
07060804	ឃ្លាំង	Khleang	070608
07060805	ដំណាក់ក្រឡាញ់	Damnak Kralanh	070608
07060806	ស្ពានធំ	Spean Thom	070608
07060807	ចុងសួង	Chong Suong	070608
07060901	ដើមពោធិ៍	Daeum Pou	070609
07060902	អង្គសុរភី	Ang Sophy	070609
07060903	ព្រៃទទឹង	Prey Totueng	070609
07060904	ស្នាមគូរ	Snam Kur	070609
07060905	បឹងធំខាងលិច	Boeng Thum Khang Lech	070609
07060906	បឹងធំខាងកើត	Boeng Thum Khang Kaeut	070609
07061201	ព្រែកក្រឹស	Preaek Kroes	070612
07061202	ព្រៃព្រូស	Prey Pruos	070612
07061203	លក្ខជា	Leak Chea	070612
07061204	ដើមស្នាយ	Daeum Snay	070612
07061205	កោះតាកូវ	Kaoh Ta Kov	070612
07061206	ព្រះទ្រហ៊ឹង	Preah Trohueng	070612
07061207	កោះត្នោត	Kaoh Tnaot	070612
07061301	ឫស្សីស្រុក	Ruessei Srok	070613
07061302	កោះស្នូក	Kaoh Snouk	070613
07061304	អន្លង់ថ្ងាន់	Anlong Thngan	070613
07061401	ថ្កូវ	Thkov	070614
07061402	លក	Lok	070614
07061403	កោះក្រឹស្នា	Kaoh Kruesna	070614
07061404	ត្រពាំងនៀល	Trapeang Niel	070614
07061405	ដំណាក់ត្របែក	Damnak Trabaek	070614
07061406	កំពូលមាស	Kampul Meas	070614
07061501	ដូង	Doung	070615
07061502	ឈើទាលរាំ	Chheu Teal Roam	070615
07061503	បាយទា	Bay Tea	070615
07061504	ភ្នំក្ងាប	Phnum Kngab	070615
07061601	កោះត្រាច	Kaoh Trach	070616
07061602	កោះឈ្វាំង	Kaoh Chhveang	070616
07061603	តាខ្វាយ	Ta Khvay	070616
07061604	ស្លាបតាអោន	Slab Ta Aon	070616
07061605	ស្វាយទង	Svay Tong	070616
07070201	ត្រពាំងធំ	Trapeang Thum	070702
07070202	ជុំគ្រៀល	Chum Kriel	070702
07070203	សំរ៉ោង	Samraong	070702
07070204	កំពង់កណ្ដាល	Kampong Kandal	070702
07070302	អណ្ដូងជីម៉ឺន	Andoung Chi Meun	070703
07070303	ព្រៃត្នោត	Prey Tnaot	070703
07070304	កំពង់គ្រែង	Kampong Kraeng	070703
07070305	កំពង់ក្រុង	Kampong Krong	070703
07070306	ម៉ាក់ប្រាង្គ	Makprang	070703
07070401	ត្រពាំងកញ្ឆែត	Trapeang Kanhchhaet	070704
07070402	កំពង់សំរោងខាងជើង	Kampong Samraong Khang Cheung	070704
07070403	កំពង់សំរោងខាងត្បូង	Kampong Samraong Khang Tboung	070704
07070501	ភ្នំតូច	Phnum Touch	070705
07070502	អន្លង់គគី	Anlong Kokir	070705
07070503	ទឹកក្រហម	Tuek Kraham	070705
07070504	មានរិទ្ធ	Mean Ritth	070705
07070505	ដំណាក់ត្រាច	Damnak Trach	070705
07070801	បុស្សញិញ	Bos Nhinh	070708
07070802	កូនសត្វ	Koun Satv	070708
07070803	កំពង់នង់	Kampong Nong	070708
07070804	កំពង់ត្នោត	Kampong Tnaot	070708
07070901	ស្នំប្រាំពីរ	Snam Prampir	070709
07070902	បត់ក្បាលដំរី	Bat Kbal Damrei	070709
07070903	មាត់ពាម	Moat Peam	070709
07071201	ព្រៃតុម្ព	Prey Tomh	070712
07071202	បឹងតារោង	Boeng Ta Raung	070712
07071203	ព្រៃឃ្មុំ	Prey Khmum	070712
07071204	វត្ដអង្គ	Voat Angk	070712
07071301	ចក្រីទីង	Chakkrei Ting	070713
07071302	ដំណាក់ហ្លួង	Damnak Luong	070713
07071303	ព្រៃថ្នង	Prey Thnang	070713
07071304	ទ្វារថ្មី	Tvear Thmei	070713
07071305	ច្បារអំពៅ	Chbar Ampov	070713
07071501	កំពង់ចិន	Kampong Chen	070715
07071502	ត្រពាំងកក់	Trapeang Kak	070715
07071503	ដូង	Doung	070715
07071504	ម្លិចគល់	Mlich Kol	070715
07071505	អន្លង់ម៉ាក់ប្រាង្គ	Anlong Makprang	070715
07071601	ត្រសេកកោង	Trasek Kaong	070716
07071602	ត្រពាំងច្រាប	Trapeang Chrab	070716
07071603	ថ្មី	Thmei	070716
07071604	វត្ដពោធិ៍	Voat Pou	070716
07071605	ដូនស៊យ	Doun Soy	070716
07071606	គោចិនលែង	Kou Chen Laeng	070716
07071701	ត្រពាំងព្រីងខាងជើង	Trapeang Pring Khang Cheung	070717
07071702	ត្រពាំងព្រីងខាងត្បូង	Trapeang Pring Khang Tboung	070717
07071703	បុះត្របែក	Bos Trabaek	070717
07071704	អង្គ	Angk	070717
07071801	ត្រពាំងសង្កែ	Trapeang Sangkae	070718
07071802	កំពង់កែស	Kampong Kaes	070718
07071803	ត្រពាំងធំ	Trapeang Thum	070718
07071901	ត្រពាំងជ្រៃ	Trapeang Chrey	070719
07071902	ក្រាំង	Krang	070719
07071903	ត្រពាំងធំ	Trapeang Thum	070719
07071904	ស្វាយធំ	Svay Thum	070719
07080101	សុវណ្ណសាគរ	Sovann Sakor	070801
07080102	ភូមិ១ឧសភា	Phum  Muoy Ousaphea	070801
07080201	ក្រាំង	Krang	070802
07080202	ស្វាយធំ	Svay Thum	070802
07080301	កំពង់បាយខាងជើង	Kampong Bay Khang Cheung	070803
07080302	កំពង់បាយខាងត្បូង	Kampong Bay Khang Tboung	070803
07080401	ទ្វីខាងជើង	Tvi Khang Cheung	070804
07080402	ទ្វីខាងត្បូង	Tvi Khang Tboung	070804
07080403	អូតូច	Ou Touch	070804
07080404	អណ្ដូងខ្មែរ	Andoung Khmer	070804
07080405	តាដិប	Ta Doeb	070804
07080501	ដូនតោក	Doun Kaot	070805
07080502	តាអង្គ	Ta Angk	070805
07080503	បឹងតាព្រាម	Boeng Ta Pream	070805
07080504	ស្រែ	Srae	070805
08010101	អំពៅព្រៃទី១	Ampov Prey Ti Muoy	080101
08010102	អំពៅព្រៃទី២	Ampov Prey Ti Pir	080101
08010103	អំពៅព្រៃទី៣	Ampov Prey Ti Bei	080101
08010104	តាដោលទី១	Ta Daol Ti Muoy	080101
08010105	តាដោលទី២	Ta Daol Ti Pir	080101
08010106	តាដោលទី៣	Ta Daol Ti Bei	080101
08010107	ជើងព្រៃទី១	Cheung Prey Ti Muoy	080101
08010108	ជើងព្រៃទី២	Cheung Prey Ti Pir	080101
08010109	ជើងព្រៃទី៣	Cheung Prey Ti Bei	080101
08010201	អន្លង់រមៀតខាងជើង	Anlong Romiet Khang Cheung	080102
08010202	អន្លង់រមៀតខាងត្បូង	Anlong Romiet Khang Tboung	080102
08010203	អន្លង់រមៀតខាងលិច	Anlong Roniet Khang Lech	080102
08010204	ស្រែគោក	Srae Kouk	080102
08010205	ដើមត្រាំង	Daeum Trang	080102
08010206	កំពង់ទួល	Kampong Tuol	080102
08010301	បារគូ	Barku	080103
08010302	ឃ្មុត	Khmut	080103
08010303	វាលកណ្ដាល	Veal Kandal	080103
08010304	ពោធិ៍ដុះ	Pou Doh	080103
08010305	ត្បូងក្ដី	Tboung Kdei	080103
08010306	ស្វាយមីង	Svay Ming	080103
08010307	អូរអណ្ដូង	Ou Andoung	080103
08010401	បឹងខ្យាង	Boeng Khyang	080104
08010402	ព្រៃតាតូច	Prey Ta Touch	080104
08010403	ស្រុកចេក	Srok Chek	080104
08010404	កំពង់តាឡុង	Kampong Ta Long	080104
08010405	ប្រឡាយ	Pralay	080104
08010406	តាព្រហ្ម	Ta Prum	080104
08010501	ក្រសាំង	Krasang	080105
08010502	ស្រុកធំ	Srok Thum	080105
08010503	អំបឺស	Amboes	080105
08010504	ពោធិ៍ស្មាត	Pou Smat	080105
08010505	ឆ្មាពួន	Chhma Puon	080105
08010506	ប្រជុំអង្គ	Prachum Angk	080105
08010601	តាកុច	Ta Koch	080106
08010602	ស្លែងគង់	Slaeng Kong	080106
08010603	ដើមឫស	Daeum Rues	080106
08010604	ទន្សាយកៀច	Tonsay Kiech	080106
08010605	ក្រាំងចេក	Krang Chek	080106
08010606	រលួស	Roluos	080106
08010607	សាម៉រ	Samar	080106
08010608	អន្លង់ព្រីង	Anlong Pring	080106
08010609	ទែន	Teaen	080106
08010610	ក្រូចសើច	Krouch Saeuch	080106
08010611	បទល្វា	Bat Lvea	080106
08010612	បាង	Bang	080106
08010613	ព្រៃប្រាសាទ	Prey Prasat	080106
08010614	ម្កាក់	Mkak	080106
08010701	កណ្ដោក	Kandaok	080107
08010702	ទឹកនឹម	Tuek Nuem	080107
08010703	ស្វាយព្រៃ	Svay Prey	080107
08010704	ជ្រៃរយោង	Chrey Ro Young	080107
08010705	គោករមៀត	Kouk Romiet	080107
08010706	តោតម៉ា	Taot Ma	080107
08010707	អំពៅព្រៃ	Ampov Prey	080107
08010801	ថ្មី	Thmei	080108
08010802	ត្រពាំងចក	Trapeang Chak	080108
08010803	ទួលកំរៀង	Tuol Kamrieng	080108
08010804	ក្រាំងតី	Krang Tei	080108
08010805	ទន្លា	Tonlea	080108
08010901	ក្បាលសេះ	Kbal Seh	080109
08010902	ក្រាំងធ្មៃ	Krang Thmey	080109
08010903	ចារ	Char	080109
08010904	គោកព្រីង	Kouk Pring	080109
08010905	គោកត្រប់	Kouk Trab	080109
08010906	លៀក	Liek	080109
08010907	ឈើនាង	Chheu Neang	080109
08010908	ស្វាយកើត	Svay Kaeut	080109
08010909	ស្វាយលិច	Svay Lech	080109
08011301	ក្រាំងទ្រា	Krang Trea	080113
08011302	បិនបោរ	Ben Baor	080113
08011303	ព្រះពុទ្ធ	Preah Putth	080113
08011304	ក្រាំងស្បូវ	Krang Sbov	080113
08011305	បុណ្ណា	Bonna	080113
08011501	ចំបក់ត្រប់	Chambak Trab	080115
08011502	បឹងក្អែក	Boeng K'aek	080115
08011503	កោះខ្នុរ	Kaoh Knor	080115
08011504	ព្រែករកា	Preaek Roka	080115
08011601	ព្រែកស្លែង	Preaek Slaeng	080116
08011602	ពន់ចាន	Pong Chan	080116
08011603	ព្រៃតាថុក	Prey Ta Thok	080116
08011604	ប្រាសាទ	Prasat	080116
08011701	បឹង	Boeng	080117
08011702	រកា	Roka	080117
08011703	ស្វាយ	Svay	080117
08011704	ចេក	Chek	080117
08011705	រុន	Run	080117
08011706	ក្រូច	Krouch	080117
08011707	ត្រាញ់	Tranh	080117
08011801	ភីរី	Phiri	080118
08011802	ចំការតាង៉ែត	Chamkar Ta Ngaet	080118
08011803	តាប៉េង	Ta Peng	080118
08011804	ថ្មី	Thmei	080118
08011805	ក្រាំងរលួស	Krang Roluos	080118
08011806	ច្រឡាំង	Chralang	080118
08011807	អន្លង់បារាំង	Anlong Barang	080118
08011808	អង្គ្រង	Angkrong	080118
08011809	ស្ទឹង	Stueng	080118
08011810	ព្រៃកន្ទ្រា	Prey Kantrea	080118
08011811	រលាំងកែន	Roleang Kaen	080118
08012201	សៀមរាប	Siem Reab	080122
08012202	ចំបក់	Chambak	080122
08012203	ព្រែកអង្គុញ	Preaek Angkunh	080122
08012204	ជ័យជំនះ	Chey Chumneah	080122
08012205	រានថ្ម	Rean Thma	080122
08012206	រាយដប	Reay Dab	080122
08012501	អង្គក្លើ	Angk Klaeu	080125
08012502	កុកទិល	Kok Til	080125
08012503	ជ្រលង	Chrolong	080125
08012504	ជីមៅ	Chi Mau	080125
08012505	ក្រាំងគាំ	Krang Koam	080125
08012506	ក្រាំងឈើនាង	Krang Chheu Neang	080125
08012507	កំណប់	Kamnab	080125
08012701	ព្រៃទទឹង	Prey Totueng	080127
08012702	តំណាក់ត្របែក	Damnak Trabaek	080127
08012703	ត្រពាំងបារគូ	Trapeang Barku	080127
08012704	ស្លែង	Slaeng	080127
08012705	តាឡឹក	Ta Loek	080127
08012801	ត្រស់	Tras	080128
08012802	ទ្រា	Trea	080128
08012803	រោងគោ	Roung Kou	080128
08012804	មាត់បឹង	Moat Boeng	080128
08012805	កាប់លាវ	Kab Leav	080128
08012806	ដូនវង្ស	Doun Vongs	080128
08012807	ត្រពាំងកក់	Trapeang Kak	080128
08012808	ត្រពាំងស្វា	Trapeang Sva	080128
08012809	ដំរីស្លាប់	Damrei Slab	080128
08020101	ខ្សុំ	Khsom	080201
08020102	កណ្ដាលលើ	Kandal Leu	080201
08020103	កណ្ដាលក្រោម	Kandal Kraom	080201
08020104	អង្គរជ័យ	Angkor Chey	080201
08020105	កណ្តាល	Kandal	080201
08020106	ព្រែកប៉ុល	Preaek Pol	080201
08020201	ឫស្សីស្រុក	Ruessei Srok	080202
08020202	ឈើទាល	Chheu Teal	080202
08020203	ព្រែកស្វាយ	Preaek Svay	080202
08020204	ស្រែអំពិល	Srae Ampil	080202
08020205	ឫស្សីស្រុក ២	Ruessei Srok 2	080202
08020206	ឈើទាល ២	Chheu Teal 2	080202
08020207	ព្រែកស្វាយ ២	Preaek Svay 2	080202
08020208	ស្រែអំពិល ២	Srae Ampil 2	080202
08020301	ពពាលខែ	Popeal Khae	080203
08020302	ដីឥដ្ឋកោះផុស	Dei Edth Kaoh Phos	080203
08020303	ស្ដៅកន្លែង	Sdau Kanlaeng	080203
08020304	ពពាលខែ ២	Popeal Khae 2	080203
08020305	ដីឥដ្ឋកោះផុស ២	Dei Edth Kaoh Phos 2	080203
08020306	ដីឥដ្ឋកោះផុស ៣	Dei Edth Kaoh Phos 3	080203
08020307	ស្តៅកន្លែង ២	Sdau Kanlaeng 2	080203
08020308	ស្តៅកន្លែង ៣	Sdau Kanlaeng 3	080203
08020309	ស្តៅកន្លែង ៤	Sdau Kanlaeng 4	080203
08020310	ស្តៅកន្លែង ៥	Sdau Kanlaeng 5	080203
08020401	ព្រែកដូង	Preaek Doung	080204
08020402	កំពង់ស្វាយ	Kampong Svay	080204
08020403	ព្រែកតានប់	Preaek Ta Nob	080204
08020404	កំពង់ស្វាយ ២	Kampong Svay 2	080204
08020405	ព្រែកដូង ២	Preaek Doung 2	080204
08020406	ព្រែកតានប់ ២	Preaek Ta Nob 2	080204
08020601	ទួលត្នោត	Tuol Tnaot	080206
08020602	តារាបដូនស	Ta Reab Doun Sa	080206
08020603	ស្លាបតាអោន	Slab Ta Aon	080206
08020604	ចន្លក់	Chanlak	080206
08020605	ទួលក្របៅ	Tuol Krabau	080206
08020606	គគីរ	Kokir	080206
08020607	ដូនស	Doun Sa	080206
08020608	ទួលដូង	Tuol Daung	080206
08020609	កោះបៀ	Kaoh Bie	080206
08020610	ចិនកោះ	Chen Kaoh	080206
08020611	ជ្រោយតាប៉ា	Chrouy Ta Pa	080206
08020612	ចន្លក់ក្រៅ	Chanlak Kraw	080206
08020701	ពោធិ៍មៀវ	Pou Miev	080207
08020702	គគីរធំ	Kokir Thum	080207
08020703	រាំងដេក	Reang Dek	080207
08020704	កោះតេជោ	Kaoh Dechou	080207
08020705	គគីរធំ ២	Kokir Thum 2	080207
08020706	រាំងដេក ២	Reang Dek 2	080207
08020707	កោះតេជោ ២	Kaoh Dechou 2	080207
08020801	កោះប្រាក់	Kaoh Prak	080208
08020802	ភូមិធំ	Phum Thum	080208
08020803	រទាំង	Roteang	080208
08020804	កោះប្រាក់ចាស់	Kaoh Prak Chas	080208
08020805	រទាំងត្បូង	Roteang Tbaung	080208
08021101	ជ័យឧត្ដម	Chey Otdam	080211
08021102	ព្រែកតាកែវ	Preaek Ta Kaev	080211
08021103	ជ្រោយដង	Chrouy Dang	080211
08021104	ស្ទឹង	Stueng	080211
08021105	ព្រែកត្រែង	Preaek Traeng	080211
08021106	សំរោងក្អែរ	Samraong K'aer	080211
08021107	ជ័យឧត្ដម ២	Chey Otdam 2	080211
08021108	ព្រែកតាកែវ ២	Preaek Ta Kaev 2	080211
08021109	ជ្រោយដង ២	Chrouy Dang 2	080211
08021110	ស្ទឹង ២	Stueng 2	080211
08021111	ព្រែកត្រែង ២	Preaek Traeng 2	080211
08021112	សំរោងក្អែរ ២	Samraong K'aer 2	080211
08021113	សំរោងក្អែរ ៣	Samraong K'aer 3	080211
08030201	ជ័យធំ	Chey Thum	080302
08030202	ជ័យតូច	Chey Touch	080302
08030203	ព្រែកថ្មី	Preaek Thmei	080302
08030204	ជ្រៃលាស់	Chrey Loas	080302
08030205	តាគាត់លិច	Ta Koat Lech	080302
08030206	តាគាត់កើត	Ta Koat Kaeut	080302
08030301	កំពង់ចំលង	Kampong Chamlang	080303
08030302	ត្បូងដំរី	Tboung Damrei	080303
08030303	ព្រែកដំបង	Preaek Dambang	080303
08030401	ត្បូង	Tboung	080304
08030402	ក្រោម	Kraom	080304
08030403	កណ្ដាល	Kandal	080304
08030601	ព្រះប្រសប់	Preah Prasab	080306
08030602	ព្រែកតាបែន	Preaek Ta Baen	080306
08030603	ព្រែកតាទន់	Preaek Ta Ton	080306
08030604	ទេពមន្ដ្រី	Tep Montrei	080306
08031001	ព្រែកតាគង់	Preaek Ta Kong	080310
08031002	កំពង់ដំរី	Kampong Damrei	080310
08031003	ក្នុង	Knong	080310
08031004	ព្រែកតាមាក់	Preaek Ta Meak	080310
08031005	ស្វាយអាត់លើ	Svay At Leu	080310
08031006	ស្វាយអាត់កណ្ដាល	Svay At Kandal	080310
08031007	ស្វាយអាត់ក្រោម	Svay At Kraom	080310
08031008	បឹងក្រចាប់ជើង	Boeng Krachab Cheung	080310
08031009	បឹងក្រចាប់ត្បូង	Boeng Krachab Tboung	080310
08031010	អន្លង់	Anlong	080310
08031101	ក្រូចសើច	Krouch Saeuch	080311
08031102	អញ្ជែងលើ	Anhcheaeng Leu	080311
08031103	អញ្ជែងក្រោម	Anhcheaeng Kraom	080311
08031104	ពុកឫស្សីលើ	Puk Ruessei Leu	080311
08031105	ពុកឫស្សីកណ្ដាល	Puk Ruessei Kandal	080311
08031106	ពុកឫស្សីក្រោម	Puk Ruessei Kraom	080311
08031201	ជន្លឹង	Chonlueng	080312
08031202	រកា ទី២	Roka Ti Pir	080312
08031203	តាំងឫស្សី	Tang Ruessei	080312
08031204	ទ្រា	Trea	080312
08031205	រកា ទី១	Roka Ti Muoy	080312
08031301	សន្លុង	Sanlung	080313
08031302	ឈូក	Chhuk	080313
08031303	ថ្មី	Thmei	080313
08031304	កណ្ដាល	Kandal	080313
08031305	ព្រៃធំ	Prey Thum	080313
08031306	ដុល	Dol	080313
08031401	ព្រៃបាំង	Prey Bang	080314
08031402	ស៊ីធរលិច	Sithor Lech	080314
08031403	ស៊ីធរកើត	Sithor Kaeut	080314
08031404	ទួលពង្រ	Tuol Pongro	080314
08031405	ម៉ែបាន	Mae Ban	080314
08031406	កំពង់ល្វា	Kampong Lvea	080314
08031601	ព្រែកតាបែន	Preaek Ta Baen	080316
08031602	ស្លា	Sla	080316
08031603	ស្វាយរមៀត	Svay Romiet	080316
08031604	ឈើទាល	Chheu Teal	080316
08031605	កណ្ដាល	Kandal	080316
08031606	ស្វាយដំណាក់	Svay Damnak	080316
08031701	តាឯក	Ta Aek	080317
08031702	ទ្រាំងក្រោម	Treang Kraom	080317
08031703	ទ្រាំងលើ	Treang Leu	080317
08031801	ព្រែកចាស់	Preaek Chas	080318
08031802	សេដា	Seda	080318
08031803	វិហារសួគ៌ជើង	Vihear Suork Cheung	080318
08031804	វិហារសួគ៌ត្បូង	Vihear Suork Tboung	080318
08031805	ព្រៃធំ	Prey Thum	080318
08031806	តាកែវទី២	Ta Kaev Ti Pir	080318
08031807	តាកែវទី១	Ta Kaev Ti Muoy	080318
08031808	ស្វាយមាស	Svay Meas	080318
08040301	ក្បាលដំរីលើ	Kbal Damrei Leu	080403
08040302	ក្បាលដំរីក្រោម	Kbal Damrei Kraom	080403
08040303	ព្រែកផ្អាវ	Preaek Ph'av	080403
08040304	កំពង់កុង	Kampong Kong	080403
08040305	ជ្រុងរមាស	Chrung Meas	080403
08040306	ព្រែកហង់	Preaek Hang	080403
08040307	ទួលសង្កែ	Tuol Sangkae	080403
08040308	ត្របែកពក	Trabaek Pok	080403
08040309	ព្រែកឫស្សី	Preaek Ruessei	080403
08040310	ល្វាទោង	Lvea Toung	080403
08091411	ថ្នល់	Thnal	080914
08040311	ទួលដូនគាំ	Tuol Doun Koam	080403
08040312	ទួលស្វាយ	Tuol Svay	080403
08040401	ក្បាលកោះធំ	Kbal Kaoh Thum	080404
08040402	កណ្ដាលកោះធំ	Kandal Kaoh Thum	080404
08040403	ចុងកោះធំ	Chong Kaoh Thum	080404
08040404	ពោធិ៍ទន្លេ	Pou Tonle	080404
08040405	ក្បាលកោះថ្មី	Kbal Kaoh Thmei	080404
08040406	ចុងកោះថ្មី	Chong Kaoh Thmei	080404
08040407	ទួលកន្ទួត	Tuol Kantuot	080404
08040501	សំប៉ាន	Sampan	080405
08040502	ព្រែកតាកេរ	Preaek Ta Ker	080405
08040503	ព្រែកសំរោង	Preaek Samraong	080405
08040504	ព្រែកបិ	Preaek Be	080405
08040505	ស្វាយតាមេឃ	Svay Ta Mekh	080405
08040701	ចំការដូង	Chamkar Doung	080407
08040702	លើកដែក	Leuk Daek	080407
08040703	ព្រែកអណ្ដូង	Preaek Andoung	080407
08040704	ពោធិមិត្ដ	Pouthi Mitt	080407
08040705	អន្លង់ស្លាត	Anlong Slat	080407
08040706	សំរោង	Samraong	080407
08040707	ទួលស្លែង	Tuol Slaeng	080407
08040708	ពាមផ្ទោលកើត	Peam Phtoul Kaeut	080407
08040709	ពាមផ្ទោលលិច	Peam Phtoul Lech	080407
08040710	ឃ្លាំងកើត	Khleang Kaeut	080407
08040711	ឃ្លាំងលិច	Khleang Lech	080407
08040712	ថ្មី	Thmei	080407
08040713	ទួលចាន់	Tuol Chan	080407
08040714	ត្រឡោកបែក	Tra Laok Baek	080407
08040715	ព្រែកខ្នាច	Preaek Khnach	080407
08040801	ព្រែកអញ្ចាញ	Preaek Anhchanh	080408
08040802	ខ្វែងអណ្ដូង	Khvaeng Andoung	080408
08040803	ក្បាលជ្រោយ	Kbal Chrouy	080408
08040804	ថ្មី	Thmei	080408
08040805	ព្រែកតាអ៊ិន	Preaek Ta In	080408
08040806	កំពង់គរ	Kampong Kor	080408
08040807	ព្រែកតាដុល	Preaek Ta Dol	080408
08040808	ព្រែកតារ័ត្ន	Preaek Ta Roatn	080408
08040809	ពោធិបាន	Pouthi Ban	080408
08041101	ព្រែកតាដួង	Preaek Ta Duong	080411
08041102	ព្រែកយាយហាយ	Preaek Yeay Hay	080411
08041103	កំពង់សំបួរលើ	Kampong Sambuor Leu	080411
08041104	កំពង់សំបួរក្រោម	Kampong Sambuor Kraom	080411
08041105	កំពង់ស្វាយលើ	Kampong Svay Leu	080411
08041106	កំពង់ស្វាយកណ្ដាល	Kampong Svay Kandal	080411
08041107	កំពង់ស្វាយក្រោម	Kampong Svay Kraom	080411
08041108	ព្រែកថ្មី	Preaek Thmei	080411
08041109	ចាមលើ	Cham Leu	080411
08041110	ព្រែកតាហ៊ីង	Preaek Ta Hing	080411
08041111	ព្រេកធន់	Preaek Thon	080411
08041112	ចាមក្រោម	Cham Kraom	080411
08050101	ក្បាលជ្រោយ	Kbal Chrouy	080501
08050102	កំពង់ពោធិ៍	Kampong Pou	080501
08050103	អំពិលទឹក	Ampil Tuek	080501
08050104	កោះចំរើន	Kaoh Chamraeun	080501
08050201	ក្អមសំណក្រោម	K'am Samnar Kraom	080502
08050202	ក្អមសំណលើ	K'am Samnar Leu	080502
08050203	រាំងជួរ	Reang Chuor	080502
08050301	បឹងកណ្ដាល	Boeng Kandal	080503
08050302	បឹងក្រោម	Boeng Kraom	080503
08050303	បឹងលើ	Boeng Leu	080503
08050401	ពាមរាំងក្រោម	Peam Reang Kraom	080504
08050402	ពាមរាំងលើ	Peam Reang Leu	080504
08050403	ថ្មី	Thmei	080504
08050404	ព្រែកតាទួន	Preak Ta Tuon	080504
08050501	កោះកន្ធាយ	Kaoh Kantheay	080505
08050502	ព្រែកដាច់	Preaek Dach	080505
08050503	ព្រែកតូច	Preaek Touch	080505
08050504	តាហ៊ីង	Ta Hing	080505
08050601	កំពង់ចំលង	Kampong Chamlang	080506
08050602	ព្រែកបាក់	Preaek Bak	080506
08050603	ព្រែកតូច	Preaek Touch	080506
08050604	ស្ពានដែក	Spean Daek	080506
08050701	ចុងកោះ	Chong Kaoh	080507
08050702	ដងក្ដោង	Dang Kdaong	080507
08050703	កណ្ដាល	Kandal	080507
08060301	បឹងគ្រំលើ	Boeng Krum Leu	080603
08060302	បឹងគ្រំក្រោម	Boeng Krum Kraom	080603
08060401	កោះកែវលើ	Kaoh Kaev Leu	080604
08060402	កោះកែវក្រោម	Kaoh Kaev Kraom	080604
08060501	កោះរះលើ	Kaoh Reah Leu	080605
08060502	កោះរះក្រោម	Kaoh Reah Kraom	080605
08060601	ល្វាសរលើ	Lvea Sar Leu	080606
08060602	ល្វាសរកណ្ដាល	Lvea Sar Kandal	080606
08060603	ល្វាសរក្រោម	Lvea Sar Kraom	080606
08060801	ព្រែកតាប្រាំង	Preaek Ta Prang	080608
08060802	ព្រែកក្រូច	Preaek Krouch	080608
08061001	ព្រែករៃ	Preaek Rey	080610
08061002	ព្រែកឈ្មោះ	Preaek Chhmuoh	080610
08061003	ព្រែកគង់រាជ	Preaek Kong Reach	080610
08061101	ព្រែកប្រា	Preaek Pra	080611
08061102	ព្រែកជ្រៃ	Preaek Chrey	080611
08061103	ព្រែកឫស្សី	Preaek Ruessei	080611
08061104	អន្លង់ទ្រា	Anlong Trea	080611
08061105	ពាមស្ដី	Peam Sdei	080611
08061201	សំបួរ	Sambuor	080612
08061202	ព្រែកចារ	Preaek Char	080612
08061203	ជ្រោយជ្រែ	Chrouy Chreae	080612
08061301	តាជោ	Ta Chou	080613
08061302	ក្ដីកណ្ដាល	Kdei Kandal	080613
08061303	តាស្គរ	Ta Skor	080613
08061401	ថ្មគរ	Thma Kor	080614
08061402	ផ្លូវត្រី	Phlov Trei	080614
08061501	ទឹកឃ្លាំង	Tuek Khleang	080615
08061502	សំរោង	Samraong	080615
08061503	ជ្រោយពិសី	Chrouy Pisei	080615
08070301	ព្រែកតាបែន	Preaek Ta Baen	080703
08070302	ព្រែកថ្មី	Preaek Thmei	080703
08070303	ក្រោម	Kraom	080703
08070304	កណ្ដាល	Kandal	080703
08070306	កោះរកា	Kaoh Roka	080703
08070307	ឈើទាល	Chheu Teal	080703
08070401	ស្វាយជ្រុំ	Svay Chrum	080704
08070402	ឡឥដ្ឋ	La Edth	080704
08070403	វត្ដចាស់	Voat Chas	080704
08070404	វត្ដថ្មី	Voat Thmei	080704
08070405	សាមគ្គី	Sameakki	080704
08070701	រកាកោង	Roka Kaong	080707
08070702	ពាម	Peam	080707
08070703	ព្រែកផ្ដៅ	Preaek Phdau	080707
08070704	គោហ៊េ	Kouhe	080707
08070801	ដើមជ្រៃ	Daeum Chrey	080708
08070802	ពោធិ៍រលំ	Pou Rolum	080708
08070803	ស្ពានថ្មី	Speam Thmei	080708
08070804	ព្រែកជ្រៅ	Preaek Chrov	080708
08070901	ព្រែកយាយហ៊ិន១	Preaek Yeay Hin  Muoy	080709
08070902	ព្រែកយាយហ៊ិន២	Preaek Yeay Hin  Pir	080709
08070903	ព្រែកតាសោម	Preaek Ta Saom	080709
08070904	ឫស្សីជ្រោយ	Ruessei Chrouy	080709
08070905	បឹងជន្លេន	Boeng Chonlen	080709
08070906	ជ្រោយមេត្រីក្រោម	Chrouy Metrei Kraom	080709
08070907	ជ្រោយមេត្រីលើ	Chrouy Metrei Leu	080709
08071001	អន្លុងស្លែង	Anlong Slaeng	080710
08071002	ជ្រៃមួយរយ	Chrey Muoy Roy	080710
08071003	អំពិលទឹក	Ampil Tuek	080710
08071004	ពោង	Poung	080710
08071005	ព្រែកឫស្សី	Preaek Ruessei	080710
08071006	ក្រោលគោ	Kraol Kou	080710
08071007	ពាម	Peam	080710
08071101	ថ្មី	Thmei	080711
08071102	ស្វាយអំពារ	Svay Ampear	080711
08071103	ឈើទាលភ្លោះ	Chheu Teal Phluoh	080711
08071104	កំពង់ប្រាសាទ	Kampong Prasat	080711
08071105	ក្រងស្វាយ	Krang Svay	080711
08080101	បែកចាន	Baek Chan	080801
08080102	មនោរម្យ	Monourom	080801
08080103	ចុងបង្គោល	Chong Bangkoul	080801
08080104	ថ្មី	Thmei	080801
08080105	ត្រពាំងទ្រា	Trapeang Trea	080801
08080106	ព្រៃសំរោង	Prey Samraong	080801
08080107	ព្រៃទន្លាប់	Prey Tonloab	080801
08080108	ត្រាចទោល	Trach Toul	080801
08080109	បូរីកម្មករ	Borei Kammeakkar	080801
08080110	កៅ	Kau	080801
08080111	ត្រពាំងសុក្រំ	Trapeang Sokram	080801
08080112	ត្រពាំងក្រសាំង	Trapeang Krasang	080801
08080113	ត្រពាំងប្រុយ	Trapeang Proy	080801
08080114	រកាធំ	Roka Thum	080801
08080115	កម្ពោតស្បូវ	Kampout Sbov	080801
08080116	ព្រៃបឹង	Prey Boeng	080801
08080117	ត្នោតម្ដើម	Tnaot Mdaeum	080801
08080118	ពងទឹក	Pong Tuek	080801
08080119	អណ្ដូង	Andoung	080801
08080120	ចក	Chak	080801
08080121	ស្វាយជ្រុំ	Svay Chrum	080801
08080301	ព្រៃរការ	Prey Rokar	080803
08080302	ត្រពាំងវែង	Trapeang Veaeng	080803
08080303	ត្រពាំងជូន	Trapeang Choun	080803
08080304	សាំងដំរី	Sang Damrei	080803
08080305	ឆក់ឈើនាង	Chhak Chheu Neang	080803
08080306	ត្រពាំងខ្នារ	Trapeang Khnar	080803
08080307	ឈូកធំ	Chhuk Thum	080803
08080308	កណ្ដាល	Kandal	080803
08080309	ត្រពាំងសុព័រ	Trapeang Sopoar	080803
08080310	ក្រឡឹងដុំ	Kraloeng Dom	080803
08080401	ថ្នល់ទទឹង	Thnal Totueng	080804
08080402	ទន្លាប់ខ្ពស់ត្បូង	Tonloab Khpos Tboung	080804
08080403	ទន្លាប់ខ្ពស់ជើង	Tonloab Khpos Cheung	080804
08080404	ពងទឹក	Pong Tuek	080804
08080405	ព្រៃសំរោង	Prey Samraong	080804
08080406	ដំណាក់អំពិល	Damnak Ampil	080804
08080407	ក្ដាន់រយ	Kdan Roy	080804
08080408	ត្រពាំងត្រាច	Trapeang Trach	080804
08080409	សេរីសុខា	Serei Sokha	080804
08080410	ជ្រៃមង្គ្គល	Chrey Mongkol	080804
08080701	ត្រពាំងក្រពើ	Trapeang Krapeu	080807
08080702	ត្រពាំងខ្ទឹម	Trapeang Khtuem	080807
08080703	ក្រាំងម្កាក់	Krang Mkak	080807
08080704	ត្រពាំងស្វាយ	Trapeang Svay	080807
08080705	ព្រៃទទឹង	Prey Totueng	080807
08080706	ត្រពាំងនប់	Trapeang Nob	080807
08080707	ព្រៃពពេល	Prey Popel	080807
08080708	ព្រៃខ្លា	Prey Khla	080807
08080709	ត្រពាំងផ្លុង	Trapeang Phlong	080807
08080710	អង្គពពាយ	Angk Popeay	080807
08080711	ស រមាំង	Sa Romeang	080807
08080712	ប្រាំបីមុម	Prambei Mum	080807
08080713	ត្រពាំងជ្រៅ	Trapeang Chrov	080807
08080714	ត្រពាំងរការ	Trapeang Rokar	080807
08080715	ស្រែខ្សាច់	Srae Khsach	080807
08080801	គោកពពេល	Kouk Popel	080808
08080802	កន្ដោលតុ	Kantaol Tok	080808
08080803	យសមេត្រី	Yos Metrei	080808
08080804	កណ្ដាល	Kandal	080808
08080805	លំហាច	Lumhach	080808
08080806	កណ្ដោស	Kandaos	080808
08080807	ត្រពាំងនំ	Trapeang Num	080808
08080808	ព្រៃទទឹង	Prey Totueng	080808
08080809	ព្រៃក្រឡាញ់	Prey Kralanh	080808
08080810	លាក់កូប	Leak Koub	080808
08080811	អណ្ដូងទឹក	Andoung Tuek	080808
08080812	ទំនប់សាប	Tumnob Sab	080808
08080813	ព្រៃចំការ	Prey Chamkar	080808
08080814	ព្រៃគោ	Prey Kou	080808
08080815	ជើងអក	Cheung Ak	080808
08080816	សេកពង	Sek Pong	080808
08080817	ពន្លឺ	Ponlueu	080808
08080818	តារ័ត្ន	Ta Roatn	080808
08080819	សុខាភិរម្យ	Sokha Phirom	080808
08080820	ទូករទេះ	Tuk Roteh	080808
08080901	ប្រសិទ្ធិ	Braseth	080809
08080902	ជោទ្រាច	Chou Treach	080809
08080903	ត្រពាំងធ្នង់	Trapeang Thnong	080809
08080904	ត្រពាំងក្រសាំង	Trapeang Krasang	080809
08080905	ត្រពាំងទៃ	Trapeang Tey	080809
08080906	ត្រពាំងរាំង	Trapeang Reang	080809
08080907	តាប្រាប	Ta Prab	080809
08080908	ត្រពាំងស្មាច់	Trapeang Smach	080809
08080909	ស្រែកណ្ដោល	Srae Kandaol	080809
08080910	ត្រពាំងស្នោរ	Trapeang Snaor	080809
08080911	អូរ	Ou	080809
08080912	ត្រើង	Traeung	080809
08080913	ជង្រុក	Chongruk	080809
08080914	ត្រពាំងអណ្ដែង	Trapeang Andaeng	080809
08080915	ត្រពាំងត្នោត	Trapeang Tnaot	080809
08080916	អង្គ រមាស	Angk Romeas	080809
08080917	រំដេញ	Rumdenh	080809
08080918	ស្ដុកវែង	Sdok Veaeng	080809
08080919	អន្ទុងក្រវៀន	Antong Kravien	080809
08080920	បេង	Beng	080809
08080921	លំហាច	Lumhach	080809
08080922	បឹងថ្នល់	Boeng Thnal	080809
08080923	វែង	Veaeng	080809
08080924	ពោធិ៍បួន	Pou Buon	080809
08080925	ចុងបឹង	Chong Boeng	080809
08080926	ចំការចិន	Chamkar Chen	080809
08080927	ត្រពាំងកក់	Trapeang Kak	080809
08080928	ឈើបួន	Chheu Buon	080809
08080929	ពង្រ	Pongro	080809
08081101	ព្រៃពពេល	Prey Popel	080811
08081102	ចំការជោ	Chamkar Chou	080811
08081103	ត្រពាំងពើក	Trapeang Peuk	080811
08081104	ទឹកជា	Tuek Chea	080811
08081105	ត្រពាំងឈើនាង	Trapeang Chheu Neang	080811
08081106	ថ្លើក	Thlaeuk	080811
08081107	ត្រពាំងឈូក	Trapeang Chhuk	080811
08081108	ត្រយឹង	Trayueng	080811
08081109	ត្រពាំងភូមិ	Trapeang Phum	080811
08081110	ស្រះសង្គម	Srah Sangkom	080811
08081111	ទួលស្រម៉	Tuol Srama	080811
08081112	ទួលត្នោត	Tuol Tnaot	080811
08081113	អង្គសំណាង	Angk Samnang	080811
08081114	ចំការត្រាច	Chamkar Trach	080811
08081115	ខ្លាកូន	Khla Koun	080811
08081116	ព្រៃទំពូង	Prey Tumpung	080811
08081117	អង្គស្នួលទី១	Angk Snuol Ti Muoy	080811
08081118	អង្គស្នួលទី២	Angk Snuol Ti Pir	080811
08081119	អង្គស្នួលទី៣	Angk Snuol Ti Bei	080811
08081301	ពាម	Peam	080813
08081302	ស្វាយ	Svay	080813
08081303	ឈើទាល	Chheu Teal	080813
08081304	អូរកំបុត្រ	Ou Kambot	080813
08081305	អង្គរស្មី	Angk Reaksmei	080813
08081306	ទ្រា	Trea	080813
08081307	ព្រៃពួច	Prey Puoch	080813
08081308	ប្របវត្ដ	Prab Voat	080813
08081309	ត្រើយបឹង	Traeuy Boeng	080813
08081310	ទួលលាប	Tuol Leab	080813
08081311	សល់ដី	Sal Dei	080813
08081312	ទន្លាប់	Tonloab	080813
08081313	ព្រៃភក្ដី	Prey Pheakdei	080813
08081314	ព្រៃក្រាយ	Prey Kray	080813
08081315	ចំការគួយ	Chamkar Kuoy	080813
08081316	ចំការស្លែង	Chamkar Slaeng	080813
08081317	ចំបក់ទន្សាយ	Chambak Tonsay	080813
08081318	ក្រាំងលាវ	Krang Leav	080813
08081319	ប្រមរ	Pramor	080813
08081320	ព្រៃមាន	Prey Mean	080813
08081321	កប់ចន្លុះ	Kab Chanloh	080813
08081322	ត្រពាំងរាំង	Trapeang Reang	080813
08081323	ទួលសាលា	Tuol Sala	080813
08081401	គីរីថ្មី	Kiri Thmei	080814
08081402	បឹង	Boeng	080814
08081403	តាប៉ាង	Ta Pang	080814
08081404	ត្រពាំងកក់	Trapeang Kak	080814
08081405	ត្រពាំងត្បែង	Trapeang Tbaeng	080814
08081406	ល្វី	Lvi	080814
08081407	ទីទុយពង	Tituy Pong	080814
08081408	អង្គឃ្វាន	Angk Khvean	080814
08081409	ត្រពាំងថ្ម	Trapeang Thma	080814
08081410	ស្រែអំព្រុំ	Srae Amprum	080814
08081411	មង្គលបូរី	Mongkol Borei	080814
08081412	កោះគ្របបាយ	Kaoh Krob Bay	080814
08081413	ដំណាក់កកោះ	Damnak Kakaoh	080814
08081414	ត្រពាំងក្រឡាញ់	Trapeang Kralanh	080814
08081415	ពណ្ណរាយ	Ponnoreay	080814
08081416	ថ្មី	Thmei	080814
08081417	ព្រៃផ្ចឹកទី១	Prey Phchoek Ti Muoy	080814
08081418	ព្រៃផ្ចឹកទី២	Prey Phchoek Ti Pir	080814
08081419	ភ្នំដី	Phnum Dei	080814
08081420	ត្រពាំងអណ្ដូង	Trapeang Andoung	080814
08081421	ព្រៃឈើទាល	Prey Chheu Teal	080814
08081422	ព្រៃលួង	Prey Luong	080814
08081423	ត្រពាំងទួល	Trapeang Tuol	080814
08081424	ត្រពាំងទន្លាប់	Trapeang Tonloab	080814
08081425	ដូនម៉ាន់	Doun Man	080814
08081426	ចំការដូង	Chamkar Doung	080814
08081427	ស្វាយឧត្ដម	Svay Otdam	080814
08081428	ត្រពាំងជ្រៅ	Trapeang Chrov	080814
08081601	ចំបក់កោង	Chambak Kaong	080816
08081602	បឹងអញ្ចាញ	Boeng Anhchanh	080816
08081603	ខ្លុង	Khlong	080816
08081604	អង្គស្រែពោធិ៍	Angk Srae Pou	080816
08081605	រំលេច	Rumlech	080816
08081606	ទួលខ្លុង	Tuol Khlong	080816
08081607	ពពេលរលំ	Popel Rolum	080816
08081608	គោល	Koul	080816
08081609	ទួលសេរី	Tuol Serei	080816
08081610	ក្រាំងក្រូច	Krang Krouch	080816
08081611	ច្រកក្រសាំង	Chrak Krasang	080816
08081612	ត្រពាំងកំភ្លាញ	Trapeang Kamphleanh	080816
08081613	បឹងរមាស់	Boeng Romoas	080816
08081614	ម៉ឺនរៀម	Meun Riem	080816
08081615	ព្រៃទទឹង	Prey Totueng	080816
08081616	ចន្ទ្រាថ្មី	Chantrea Thmei	080816
08081617	ព្រៃរំដួល	Prey Rumduol	080816
08081618	អង្គតាសិត	Angk Ta Set	080816
08081619	បឹងទ្រា	Boeng Trea	080816
08081620	ស្រែកាច់	Srae Kach	080816
08081621	បឹងខ្នារ	Boeng Khnar	080816
08081622	ខ្នារ	Khnar	080816
08081623	ថ្មី	Thmei	080816
08081624	ព្រៃសំរោង	Prey Samraong	080816
08081625	ទន្លាប់	Tonloab	080816
08090101	តាំងស្ដុក	Tang Sdok	080901
08090102	ស្ដុកតាចាន់	Sdok Ta Chan	080901
08090103	ស្ដុកប្រនួត	Sdok Pranuot	080901
08090104	ប្រាសាទ	Prasat	080901
08090105	ឈ្វាំង	Chhveang	080901
08090106	ស្លែងមានជ័យ	Slaeng Meanchey	080901
08090107	តាគោក	Ta Kouk	080901
08090108	ស្វាយ	Svay	080901
08090109	ព្រៃគោល	Prey Koul	080901
08090110	ទស្សាស្វិត	Tosa Svet	080901
08090111	កាកាប	Kakab	080901
08090112	តាពេជ	Ta Pech	080901
08090113	ស្រែអំពិល	Srae Ampil	080901
08090114	ព្រៃផ្ចឹក	Prey Phchoek	080901
08090115	តាអោក	Ta Aok	080901
08090116	ពង្រ	Pongro	080901
08090201	ស្លែង	Slaeng	080902
08090202	តាពេទ្យ	Ta Pet	080902
08090203	ត្រពាំងរបង	Trapeang Robang	080902
08090204	ថ្មី	Thmei	080902
08090205	ត្រពាំងវាល	Trapeang Veal	080902
08090206	ព្រៃសុពណ៌	Prey Sopoar	080902
08090207	តាគោ	Ta Kou	080902
08090208	ពពែ	Popeae	080902
08090209	ត្រពាំងសង្កែ	Trapeang Sangkae	080902
08090210	ត្បូងវត្ដ	Tboung Voat	080902
08090211	ត្រពាំងព្រលិត	Trapeang Prolit	080902
08090212	តាតូច	Ta Touch	080902
08090213	ជ្រៃលាស់	Chrey Loas	080902
08090214	តាជៃ	Ta Chey	080902
08090215	ទួលព្រិច	Tuol Prich	080902
08090301	ឃ្លាំងស្បែក	Khleang Sbaek	080903
08090302	ទួលងោក	Tuol Ngouk	080903
12011104	ភូមិ ៤	Phum 4	120111
08090303	ពោធិ៍តូច	Pou Touch	080903
08090304	សង្វរ	Sangvar	080903
08090305	ពាមជំនីក	Peam Chumnik	080903
08090306	ពាមល្វែក	Peam Lveaek	080903
08090307	ជ្រោយឫស្សី	Chrouy Ruessei	080903
08090308	ខ្លាត្រាំ	Khla Tram	080903
08090401	ដងគោម	Dang Koum	080904
08090402	ព្រែកតាមែ	Preaek Ta Meae	080904
08090403	កំពុងអុស	Kampung Os	080904
08090404	បឹងក្ដុល	Boeng Kdol	080904
08090405	ព្រែកតាព្រហ្ម	Preaek Ta Prum	080904
08090501	ដងគោម	Dang Koum	080905
08090502	ព្រែកជីក	Preaek Chik	080905
08090503	ព្រែកក្ដាម២	Preaek Kdam Pir	080905
08090504	ព្រែកក្ដាម១	Preaek Kdam Muoy	080905
08090505	កោះចិន	Kaoh Chen	080905
08090506	សសី	Sasei	080905
08090507	ថ្នល់បត់	Thnal Bat	080905
08090508	ចុងកោះ	Chong Kaoh	080905
08090509	កំពង់រទេះ	Kampong Roteh	080905
08090510	ជ្រោយសំបួរ	Chrouy Sambuor	080905
08090511	តាពៅ	Ta Pov	080905
08090601	ពោធិ៍រ៉ាល	Pou Ral	080906
08090602	ស្រះពោធិ៍	Srah Pou	080906
08090603	ត្រពាំងស្លែង	Trapeang Slaeng	080906
08090604	វាលថ្មី	Veal Thmei	080906
08090605	ដើមពោធិ៍	Daeum Pou	080906
08090606	ភ្នំបាត	Phnum Bat	080906
08090607	ធម្មស្រះ	Thommeak Srah	080906
08090608	ក្បាលស្ពាន	Kbal Spean	080906
08090609	អូរស្លាត	Ou Slat	080906
08090610	ថ្មស	Thma Sa	080906
08090611	ថ្មី	Thmei	080906
08090612	កំចាត់ព្រាយ	Kamchat Preay	080906
08090613	កំពង់ក្រសាំង	Kampong Krasang	080906
08090614	អង្គសេរី	Angk Serei	080906
08090615	ស្ដុក	Sdok	080906
08090616	ឆ្កែលុង	Chhkae Lung	080906
08090617	ក្រោលខៀវ	Kraol Khiev	080906
08090618	ត្រពាំងរកា	Trapeang Roka	080906
08090619	ចំបក់ភ្លោះ	Chambak Phluoh	080906
08090620	ថ្លុកអង្ក្រង	Thlok Angkrong	080906
08090621	ថ្លុកត្របែក	Thlok Trabaek	080906
08090622	បន្ទាយតូច	Banteay Touch	080906
08090701	ទួលអំពិល	Tuol Ampil	080907
08090702	ពញាឮ	Ponhea Lueu	080907
08090703	ព្រែកល្វា	Preaek Lvea	080907
08091001	ពោធិ៍មង្គល	Pou Mongkol	080910
08091002	ស្លែងដីដុះ	Slaeng Dei Doh	080910
08091003	ព្រែកក្ដី	Preaek Kdei	080910
08091101	ធម្មត្រ័យ	Thommeak Trai	080911
08091102	ម្លូម៉ឺន	Mlu Meun	080911
08091103	ផ្សារដែកលើ	Phsar Daek Leu	080911
08091104	ផ្សារដែកក្រោម	Phsar Daek Kraom	080911
08091105	បដិមាករ	Pakdemakar	080911
08091106	ចំបក់មាស	Chambak Meas	080911
08091107	ទួលអង្គុញ	Tuol Angkunh	080911
08091108	ភ្នំ	Phnum	080911
08091109	ជ័យឧត្ដម	Chey Otdam	080911
08091110	ស្រះពោធិ៍	Srah Pou	080911
08091301	ល្វា	Lvea	080913
08091302	ស្រែតាមែង	Srae Ta Meaeng	080913
08091303	ស្ពានទំលាប់	Spean Tumloab	080913
08091304	ស្ដុកឈូក	Sdok Chhuk	080913
08091305	ស្រែតាសេក	Srae Ta Sek	080913
08091306	ស្វាយលាប	Svay Leab	080913
08091307	ត្រពាំងជ្រៅ	Trapeang Chrov	080913
08091308	អញ្ចាញ	Anhchanh	080913
08091309	ត្រពាំងឫស្សី	Trapeang Ruessei	080913
08091310	កំណប់	Kamnab	080913
08091311	បែកថ្លាង	Baek Thlang	080913
08091312	ដំបូកមានល័ក្ខណ៍	Dambouk Mean Leak	080913
08091313	ត្រពាំងអណ្ដូង	Trapeang Andoung	080913
08091314	ត្រពាំងធ្នង់	Trapeang Thnong	080913
08091315	ដំណាក់ព្រីង	Damnak Pring	080913
08091316	ត្រពាំងព្រៃភូមិ	Trapeang Prey Phum	080913
08091317	ស្រែរាំង	Srae Reang	080913
08091318	អំពិលរូង	Ampil Rung	080913
08091319	ត្រពាំងពុទ្រា	Trapeang Putrea	080913
08091401	ប្រក់ក្ដារ	Prak Kdar	080914
08091402	ទេពប្រណម្យ	Tep Pranam	080914
08091403	កំពង់ចុះវារ	Kampong Choh Vear	080914
08091404	ចេតីយ៍ទ្រេត	Chedei Tret	080914
08091405	អំពិលដាំទឹក	Ampil Dam Tuek	080914
08091406	សាលាកាត់សក់	Sala Kat Sak	080914
08091407	ធ្យូង	Thyung	080914
08091408	ចេតីយ៍ថ្មី	Chedei Thmei	080914
08091409	ពោធិ៍កំបោរ	Pou Kambaor	080914
08091410	អំពិលផ្អែម	Ampil Ph'aem	080914
08091412	ចតុទិស	Chakto Tis	080914
08100101	ឫស្សីស្រុក	Ruessei Srok	081001
08100102	ខ្ពបលើ	Khpob Leu	081001
08100103	ខ្ពបក្រោម	Khpob Kraom	081001
08100104	រកាលើ	Roka Leu	081001
08100105	រកាក្រោម	Roka Kraom	081001
08100106	កោះថ្មី	Kaoh Thmei	081001
08100107	បឹងខ្ពប	Boeng Khpob	081001
08100108	ដំរីឆ្លង	Damrei Chhlang	081001
08100109	ព្រៃទទឹង	Prey Totueng	081001
08100110	ត្នោតញី	Tnaot Nhi	081001
08100301	ស្វាយជួរ	Svay Chuor	081003
08100302	ទេពអរជូន	Tep Archun	081003
08100303	ព្រែកកែវ	Preaek Kaev	081003
08100304	កោះខែល	Kaoh Khael	081003
08100305	ព្រែកប៉ាង	Preaek Pang	081003
08100306	ដើមព្រីង	Daeum Pring	081003
08100401	ក្បាលកោះកើត	Kbal Kaoh Khang Kaeut	081004
08100402	ក្បាលកោះលិច	Kbal Kaoh Khang Lech	081004
08100403	កណ្ដាលកោះ	Kandal Kaoh	081004
08100404	ចុងកោះកើត	Chong Kaoh Kaeut	081004
08100405	ចុងកោះលិច	Chong Kaoh Lech	081004
08100406	ក្បាលកោះខាងត្បូង	Kbal Kaoh Khang Tboung	081004
08100407	បទុមសាគរ	Botum Sakor	081004
08100408	ព្រែកយាយម៉ី	Preak Yeay Mey	081004
08100501	កំពង់ពោធិ៍	Kampong Pou	081005
08100502	ទួលក្រាំង	Tuol Krang	081005
08100503	សំរោង	Samraong	081005
08100504	អណ្ដូង	Andoung	081005
08100505	រកា	Roka	081005
08100506	វិហារ	Vihear	081005
08100507	ពីងពង់	Ping Pong	081005
08100508	អំពិល	Ampil	081005
08100509	តាគល់	Ta Kol	081005
08100510	ធំ	Thum	081005
08100511	គរ	Kor	081005
08100512	កណ្ដាល	Kandal	081005
08100513	តាពេជ	Ta Pech	081005
08100514	ចេក	Chek	081005
08100515	អង្គ	Angk	081005
08100516	កំពង់ពោធិ៍ត្បូង	Kampong Pou Tboung	081005
08100517	ទួលក្រួច	Tuol Kruoch	081005
08100518	អម្ពិលលាស់	Ampil Las	081005
08100519	ស្វាយដំណាក់	Svay Damnak	081005
08100601	លេខ១	Lekh Muoy	081006
08100602	លេខ២	Lekh Pir	081006
08100603	លេខ៣	Lekh Bei	081006
08100604	លេខ៤	Lekh Buon	081006
08100605	លេខ៥	Lekh Pram	081006
08100701	ត្រើយត្រឹង្ស	Traeuy Troeng	081007
08100702	ព្រែកតាឡៃ	Preaek Ta Lai	081007
08100703	សំប៉ានលើ	Sampan Leu	081007
08100704	សំប៉ានក្រោម	Sampan Kraom	081007
08100705	អន្លង់តាសេកលើ	Anlong Ta Sek Leu	081007
08100706	អន្លង់តាសេកក្រោម	Anlong Ta Sek Kraom	081007
08100707	កូនជ្រែ	Koun Chreae	081007
08100708	ព្រែកក្រាញ់	Preaek Kranh	081007
08100709	ពាមប្រជុំ	Peam Prachum	081007
08100710	ព្រែកគ្រួស	Preaek Khruos	081007
08100711	ព្រែកអំបិល	Preaek Ambil	081007
08100712	ព្រែកថ្មី	Preaek Thmei	081007
08100713	ឫស្សីដាច់	Russey Dach	081007
08100714	ព្រែកតាទាវ	Preaek Ta Teav	081007
08100715	អន្លង់ធំ	Anlong Thom	081007
08100716	អន្លង់ឈើខ្លាង	Anlong Chheu Khlang	081007
08100801	ក្នុងព្រែក	Knong Preaek	081008
08100802	ព្រែករុន	Preaek Run	081008
08100803	ព្រែកស្នង	Preaek Snang	081008
08100804	ព្រែកស្នាយ	Preaek Snay	081008
08100805	ស្វាយតានី	Svay Ta Ni	081008
08100806	ព្រែកតាជ្រូក	Preaek Ta Chruk	081008
08100807	ទួលសូភី	Tuol Souphi	081008
08100808	ត្រពាំងឈូក	Trapeang Chhuk	081008
08100809	ក្បាលជ្រោយ	Kbal Chrouy	081008
08100810	ព្រែករុនក្រោម	Preak Run Krom	081008
08101001	ព្រែកស្លែង	Preaek Slaeng	081010
08101002	ទួលសាលា	Tuol Sala	081010
08101003	ព្រែកខ្មែរ	Preaek Khmer	081010
08101004	កំពង់ទ្រា	Kampong Trea	081010
08101005	គោកអណ្ដែត	Kouk Andaet	081010
08101006	ដំរីឆ្លង	Damrei Chhlang	081010
08101007	ពាមសាលា	Peam Sala	081010
08101008	វាល	Veal	081010
08101009	តានូ	Ta Nu	081010
08101201	ព្រែកតាតិន	Preaek Ta Ten	081012
08101202	ឫស្សីជ្រោយ	Ruessei Chrouy	081012
08101203	ព្រែកតាជ័រ	Preaek Ta Choar	081012
08101204	ព្រែកតាសៅ	Preaek Ta Sau	081012
08101205	ចុងកោះគរ	Chong Kaoh Kor	081012
08101206	ប៉ារែនក្រោម	Paraen Kraom	081012
08101207	ប៉ារែនលើ	Paraen Leu	081012
08101208	អូររំចេក	Ou Rumchek	081012
08101209	ពោធិ៍តាប៉ាង	Pou Ta Pang	081012
08101401	ព្រែកតាប្រាក់	Preaek Ta Prak	081014
08101402	តាលន់	Ta Lon	081014
08101403	ចុងកោះតូច	Chong Kaoh Touch	081014
08101404	កណ្ដាលកោះតូច	Kandal Kaoh Touch	081014
08101405	ក្បាលកោះតូច	Kbal Kaoh Touch	081014
08101406	ទួលស្ពឺ	Tuol Spueu	081014
08101407	ព្រែកស្លែង	Preaek Slaeng	081014
08101408	ព្រែកតាឯក	Preaek Ta Aek	081014
08101409	វាលត្រែង	Veal Traeng	081014
08101501	ពោធិ៍លើ	Pou Leu	081015
08101502	ពោធិ៍កណ្ដាល	Pou Kandal	081015
08101503	ពោធិ៍ក្រោម	Pou Kraom	081015
08101504	ព្រែកតាឯក	Preaek Ta Aek	081015
08101505	ព្រែក	Preaek	081015
08101506	ព្រែកប៉ាន	Preaek Pan	081015
08101507	ព្រែកបាឡាត់ឆឹង	Preaek Balat Chhoeng	081015
08101508	ថ្កុល	Thkol	081015
08101509	ទួលក្ដី	Tuol Kdei	081015
08101601	ព្រែកថ្មី	Preaek Thmei	081016
08101602	ព្រែកតាប៉ឹម	Preaek Ta Poem	081016
08101603	ព្រែកតាវ៉ា	Preaek Ta Va	081016
08101604	ព្រែកអុងប៉ាង	Preaek Ong Pang	081016
08101605	វត្ដកណ្ដាល	Voat Kandal	081016
08101606	ផ្លូវបំបែក	Phlov Bambaek	081016
08101607	ព្រែកពោធិ៍	Preaek Pou	081016
08101608	ព្រែករាំង	Preaek Reang	081016
08101609	ព្រែករាំង ក	Preaek Reang Ka	081016
08101610	ទួលខ្មួញ	Tuol Kmuoj	081016
08110101	តាក្ដុល	Ta Kdol	081101
08110102	ព្រែកកាត់	Preaek Kat	081101
08110103	ព្រែកឡុង	Preaek Long	081101
08110104	តាក្ដុលត្បូង	Ta Kdol Tboung	081101
08110201	ក្រពើហា	Krapeu Ha	081102
08110202	ព្រែកឫស្សី	Prek Ruessey	081102
08110203	ព្រែកអញ្ចាញ	Prek Anhchanh	081102
08110204	ព្រែកឫស្សីលិច	Prek Ruessey Lix	081102
08110205	ក្រពើហាកើត	Krapeu Ha Kout	081102
08110301	ដើមមៀន	Deum Mien	081103
08110302	ដើមគរ	Doeum Kor	081103
08110303	ព្រែកតាពៅ	Prek Ta Pov	081103
08110304	ស្ទឹងជ្រៅ	Stoeng Chrov	081103
08110305	ដើមមៀន ១	Deum Mien 1	081103
08110306	ព្រែកតាពៅ ១	Prek Ta Pov 1	081103
08110401	តាខ្មៅ	Ta Khmao	081104
08110402	ព្រែកសំរោង	Prek Samraong	081104
08110403	ថ្មី	Thmei	081104
08110404	តាខ្មៅ ១	Ta Khmao 1	081104
08110405	តាខ្មៅ ២	Ta Khmao 2	081104
08110406	តាខ្មៅ ៣	Ta Khmao 3	081104
08110407	ថ្មី ១	Thmei 1	081104
08110408	ថ្មី ២	Thmei 2	081104
08110409	ព្រែកសំរោង ១	Prek Samraong 1	081104
08110410	ព្រែកសំរោង ២	Prek Samraong 2	081104
08110411	ព្រែកសំរោង ៣	Prek Samraong 3	081104
08110501	ព្រែកហូរកើត	Prek Ho Kout	081105
08110502	ព្រែកហូរលិច	Prek Ho Lix	081105
08110503	បត្ដាជី	Battachi	081105
08110504	ព្រែកហូរលិច ១	Prek Ho Lix 1	081105
08110505	ព្រែកហូរកើត ១	Prek Ho Kout 1	081105
08110506	បត្ដាជី ១	Battachi 1	081105
08110601	កំពង់សំណាញ់	Kampong Samnanh	081106
08110602	ខ្ពបវែង	Khpob Veng	081106
08110603	ព្រែករាំង	Prek Riang	081106
08110604	អាចម៍កុក	Ach Kok	081106
08110605	កំពង់សំណាញ់ ១	Kampong Samnanh 1	081106
08110606	ព្រែករាំង ១	Prek Riang 1	081106
09010101	អណ្ដូងទឹក	Andoung Tuek	090101
09010102	ជីមាល	Chi Meal	090101
09010103	ប្រៃ	Prai	090101
09010104	ជីត្រេះ	Chi Treh	090101
09010105	ប្រទាល	Prateal	090101
09010106	តាមាឃ	Ta Meakh	090101
09010107	តាអុក	Ta Ok	090101
09010201	កណ្ដោល	Kandaol	090102
09010202	ព្រលាន	Prolean	090102
09010203	សុវណ្ណាបៃតង	Sovanna Bai Tong	090102
09010204	តាំកន់	Tam Kan	090102
09010205	ធ្នង់	Thnong	090102
09010301	បាក់រនាស់	Bak Ronoas	090103
09010302	ព្រែកខ្យង	Preaek Khyang	090103
09010303	តានូន	Ta Noun	090103
09010304	ទួលពោធិ៍	Tuol Pou	090103
09010401	ចម្លងគោ	Chamlang Kou	090104
09010402	ចំការលើ	Chamkar Leu	090104
09010403	ស្រែថ្មី	Srae Thmei	090104
09010404	ស្រែត្រាវ	Srae Trav	090104
09010405	ថ្មស	Thma Sa	090104
09020101	កោះស្ដេច	Kaoh Sdach	090201
09020102	ពាមកាយ	Peam Kay	090201
09020103	ព្រែកស្មាច់	Preaek Smach	090201
09020201	ភ្ញីមាស	Phnhi Meas	090202
09020202	កៀនក្រឡាញ់	Kien Kralanh	090202
09020203	តានី	Ta Ni	090202
09020301	ព្រែកខ្សាច់	Preaek Khsach	090203
10060702	កាកុត	Kakot	100607
09020302	សំរុងតាកែវ	Samrong Ta Kaev	090203
09020303	យាយសែន	Yeay Saen	090203
09030101	ជ្រោយប្រស់	Chrouy Pras	090301
09030102	ថ្មី	Thmei	090301
09030201	ភូមិទី១	Phum Ti Muoy	090302
09030202	ភូមិទី២	Phum Ti Pir	090302
09030203	កោះស្រឡៅ	Kaoh Sralau	090302
12011105	ភូមិ ៥	Phum 5	120111
09030301	កោះអណ្ដែត	Kaoh Andaet	090303
09030302	អន្លង់វ៉ាក់	Anlong Vak	090303
09030401	ដីទំនាប	Dei Tumneab	090304
09030402	កោះកុងក្នុង	Kaoh Kong Knong	090304
09030403	ព្រែកអង្គុញ	Preaek Angkunh	090304
09030404	ត្រពាំងរូង	Trapeang Rung	090304
09040101	ភូមិទី១	Phum Ti Muoy	090401
09040102	ភូមិទី២	Phum Ti Pir	090401
09040103	ភូមិទី៣	Phum Ti Bei	090401
09040104	បឹងឃុនឆាង	Boeng Khun Chhang	090401
09040105	ស្មាច់មានជ័យ	Smach Mean Chey	090401
09040201	ភូមិទី១	Phum Ti Muoy	090402
09040202	ភូមិទី២	Phum Ti Pir	090402
09040203	ភូមិទី៣	Phum Ti Bei	090402
09040204	ភូមិទី៤	Phum Ti Buon	090402
09040301	ស្ទឹងវែង	Stueng Veaeng	090403
09040302	ព្រែកស្វាយ	Preaek Svay	090403
09050101	ប៉ាក់ខ្លង១	Pak Khlang Muoy	090501
09050102	ប៉ាក់ខ្លង២	Pak Khlang Pir	090501
09050103	ប៉ាក់ខ្លង៣	Pak Khlang Bei	090501
09050104	បឹងកាឆាង	Boeng Kachhang	090501
09050105	កោះប៉ោ	Kaoh Pao	090501
09050106	នាងកុក	Neang Kok	090501
09050107	ចាំយាម	Cham Yeam	090501
09050201	ភូមិ១	Phum Muoy	090502
09050202	ភូមិ២	Phum Pir	090502
09050301	កោះចាក	Kaoh Chak	090503
09050302	តាចាត	Ta Chat	090503
09050303	ទួលគគីរលើ	Tuol Kokir Leu	090503
09050304	ទួលគគីរក្រោម	Tuol Kokir Kraom	090503
09060101	អូជ្រៅ	Ou Chrov	090601
09060102	បឹងព្រាវ	Boeng Preav	090601
09060103	ជ្រោយ	Chrouy	090601
09060104	ផ្លោង	Phlaong	090601
09060105	សាលាម្នាង	Sala Mneang	090601
09060107	ទឹកប៉ោង	Tuek Paong	090601
09060201	អន់ឆ្អើត	An Chh'aeut	090602
09060202	ចំបក់	Chambak	090602
09060203	ខ្សាច់ក្រហម	Khsach Kraham	090602
09060204	នាពិសី	Nea Pisei	090602
09060205	តាបែន	Ta Baen	090602
09060206	ព្រែកជីក	Preaek Chik	090602
09060301	ឈូក	Chhuk	090603
09060302	ជី ខ	Chi Kha	090603
09060303	តានី	Ta Ni	090603
09060304	ត្រពាំងកណ្ដោល	Trapeang Kandaol	090603
09060401	ឈើនាង	Chheu Neang	090604
09060402	ជ្រោយស្វាយខាងលិច	Chrouy Svay Khang Lech	090604
09060403	ជ្រោយស្វាយខាងកើត	Chrouy Svay Khang Kaeut	090604
09060404	កំពង់ស្ដាំ	Kampong Sdam	090604
09060405	នេសាទ	Nesat	090604
09060406	ភ្នំស្រឡៅ	Phnum Sralau	090604
09060407	សារ៉ាយ	Saray	090604
09060501	បានទៀត	Ban Tiet	090605
09060502	ដងពែង	Dang Peaeng	090605
09060503	ព្រាំង	Prang	090605
09060504	ព្រះអង្គកែវ	Preah Angk Kaev	090605
09060505	តាធង	Ta Thaong	090605
09060506	បាក់អង្រុត	Bak Angrot	090605
09060507	ពោធិបឹង	Por Boeung	090605
09060601	ចំការក្រោម	Chamkar Kraom	090606
09060602	ខ្លុង	Khlong	090606
09060603	ស្រែអំបិល	Srae Ambel	090606
09060604	ត្រពាំង	Trapeang	090606
09060605	ត្រៀក	Triek	090606
09060606	វាលជើង	Veal Cheung	090606
09060607	វាលត្បូង	Veal Tboung	090606
09070101	សា្ពនក្ដារ	Spean Kdar	090701
09070102	កណ្ដោល	Kandaol	090701
09070103	ត្រពាំងខា្នរ	Trapeang Khnar	090701
09070201	ចំណារ	Chamnar	090702
09070202	ប្រឡាយ	Pralay	090702
09070203	សំរោង	Samraong	090702
09070204	ទ័ពឃ្លៃ	Toap Khley	090702
09070301	ជំនាប់	Chumnoab	090703
09070302	ច្រកឫស្សី	Chrak Ruessei	090703
09070403	ត្រពាំងឈើត្រាវ	Trapeang Chheu Trav	090704
09070404	គគីរជ្រុំ	Kokir Chrum	090704
09070501	ជីផាត	Chi Phat	090705
09070502	កំលត	Kamlot	090705
09070503	ទឹកល្អក់	Tuek L'ak	090705
09070504	ជាំស្លា	Choam Sla	090705
09070601	កោះ	Kaoh	090706
09070602	ព្រែកស្វាយ	Preaek Svay	090706
10010101	ឈ្នៃ	Chhney	100101
10010102	ជ្រោយថ្មក្រោម	Chrouy Thma Kraom	100101
10010103	ជ្រោយថ្មលើ	Chrouy Thma Leu	100101
10010104	កំពង់ស្រែ	Kampong Srae	100101
10010105	កណ្ដាល	Kandal	100101
10010106	កោះកណ្ដុរ	Kaoh Kandaor	100101
10010201	បឹងកៀប	Boeng Kieb	100102
10010202	បុស្ស	Bos	100102
10010203	ក្រូច	Krouch	100102
10010204	ព្រៃគោ	Prey Kou	100102
10010205	ប្រហួត	Prahuot	100102
10010206	ប្រឡាយទ្រៀក	Pralay Triek	100102
10010207	ស្រែស្ដេច	Srae Sdach	100102
10010208	ស្រែទ្រៀក	Srae Triek	100102
10010209	២៧សែនជ័យ	27 Sen Chey	100102
10010301	ហាន់ជ័យទី១	Hanchey Ti Muoy	100103
10010302	ហាន់ជ័យទី២	Hanchey Ti Pi	100103
10010303	ហាន់ជ័យទី៣	Hanchey Ti Bei	100103
10010304	ហាន់ជ័យទី៤	Hanchey Ti Buon	100103
10010401	ប្រម៉ា	Prama	100104
10010402	រលៀក	Roliek	100104
10010403	វាលកន្សែង	Veal Kansaeng	100104
10010501	ឈើទាលភ្លោះលើ	Chheu Teal Phluoh Leu	100105
10010502	ឈើទាលភ្លោះក្រោម	Chheu Teal Phluoh Kraom	100105
10010503	កញ្ជរ	Kanhchor	100105
10010504	ព្រែកចំឡាក់	Preaek Chamlak	100105
10010601	ព្រែកសំរោងទី១	Preaek Samrong Ti Muoy	100106
10010602	ព្រែកសំរោងទី២	Preaek Samraong Ti Pi	100106
10010603	ព្រែកតាហុប	Prek Ta Hob	100106
10010604	ថ្មីទី១	Thmei Ti Muoy	100106
10010605	ថ្មីទី២	Thmei Ti Pi	100106
10010701	ដងក្ដោង	Dang Kdaong	100107
10010702	ពង្រ ១	Pongro Muoy	100107
10010703	ពង្រ ២	Pongro Pir	100107
10010704	ពង្រ ៣	Pongro Bei	100107
10010705	ត្នោត	Tnaot	100107
10010801	ឈើទាលភ្លោះ	Chheu Teal Phluoh	100108
10010802	ឆក់កន្ទោង	Chhak Kantoung	100108
10010803	ដីថ្មី	Dei Thmei	100108
10010804	ល្វាធំ	Lvea Thum	100108
10010805	ព្រែកសាម៉ាន់	Preaek Saman	100108
10020701	ក្បាលកោះ	Kbal Kaoh	100207
10020702	ចុងកោះ	Chong Kaoh	100207
10020801	ក្រគរ	Krakor	100208
10020802	ទួលមនោរម្យ	Tuol Monourom	100208
10020901	ដូនជ្រាំ	Doun Chroam	100209
10020902	ក្រចេះ	Kracheh	100209
10020903	ផ្សារវែង	Phsar Veaeng	100209
10020904	ត្រពាំងព្រីង	Trapeang Pring	100209
10020905	វត្ដ	Voat	100209
10021001	កន្ទ្រ្ទីង	Kantring	100210
10021002	កាប៉ូ	Kapou	100210
10021003	អូរឫស្សី ទី ១	Ou Ruessei Ti Muoy	100210
10021004	អូរឫស្សី ទី ២	Ou Ruessei Ti Pir	100210
10021005	ស្រែស្ដៅ	Srae Sdau	100210
10021101	ទី១	Ti Muoy	100211
10021102	ទី២	Ti Pir	100211
10030101	ចំបក់ ១	Chambâk 1	100301
10030102	ចំបក់ ២	Chambâk 2	100301
10030103	ជ្រោយអំពិល ១	Chroy Ampil 1	100301
10030104	ជ្រោយអំពិល ២	Chroy Ampil 2	100301
10030105	ជ្រោយថ្ម	Chroy Thmor	100301
10030106	ស្ទឹងធំ	Stoeung Thum	100301
10030201	ជ្រោយបន្ទាយ	Chrouy Banteay	100302
10030202	កំពង់ដ	Kampong Dar	100302
10030203	កែង	Kaeng	100302
10030204	ខ្សាច់ទប់	Khsach Tob	100302
10030205	ល្អៀត	L'iet	100302
10030206	រកាធំ	Roka Thum	100302
10030207	ទួលព្រិច	Tuol Prich	100302
10030301	ជ្រោយស្នែងក្របីក្រោម	Chrouy Snaeng Krabei Kraom	100303
10030302	ជ្រោយស្នែងក្របីលើ	Chrouy Snaeng Krabei Leu	100303
10030303	កំពង់គរ	Kampong Kor	100303
10030304	តាម៉ៅលើ	Ta Mau Leu	100303
10030401	ចុងកោះ	Chong Koh	100304
10030402	កណ្ដាលកោះ	Kandal Koh	100304
10030403	ក្បាលកោះ	Kbal Koh	100304
10030501	បឹងលាច	Boeng Leach	100305
10030502	ដីដុះក្រោម	Dei Doh Kraom	100305
10030503	ដីដុះលើ	Dei Doh Leu	100305
10030504	អូរលុង	Ou Lung	100305
10030505	ព្រែកប្រាំង	Preaek Prang	100305
10030506	ព្រែកប្រសព្វកណ្ដាល	Preaek Prasab Kandal	100305
10030507	ព្រែកប្រសព្វក្រោម	Preaek Prasab Kraom	100305
10030508	ព្រែកប្រសព្វលើ	Preaek Prasab Leu	100305
10030509	ព្រែកគូរ	Prey Kur	100305
10030510	ថ្មរាប	Thma Reab	100305
10030601	បឹងរៃ	Boeng Rey	100306
10030602	ឫស្សីកែវ	Russey Keo	100306
10030603	ស្រឡៅដំណាក់	Sralav Damnak	100306
10030604	ស្វាយជុំ	Svay Chum	100306
10030701	បឹងច្រែង	Boeng Chraeng	100307
10030702	ក្ល	Kla	100307
10030703	ព្រែកជីក	Preaek Chik	100307
10030704	ព្រែកព្រលូង	Preaek Prolung	100307
10030705	ព្រែករកា	Preaek Roka	100307
10030706	សោបក្រោម	Saob Kraom	100307
10030707	សោបលើ	Saob Leu	100307
10030801	ក្រហមកលើ	Kraham Ka Leu	100308
10030802	ក្រហមកក្រោម	Kraham Ka Kraom	100308
10030803	ខ្សាត់	Khsat	100308
10030804	ព្រែកស្វាយ	Prek Svay	100308
10030805	ស្ទឹងទ្រ	Stueng Tro	100308
10030806	តាម៉ៅកណ្ដាល	Ta Mau Kandal	100308
10030807	តាម៉ៅក្រោម	Ta Mau Kraom	100308
10040101	ដំរែ	Damrae	100401
10040102	កំពង់រទេះ	Kampong Roteh	100401
10040103	កោះដំបង	Kaoh Dambang	100401
10040202	អំពិលទឹក	Ampil Tuek	100402
10040203	កំពង់ក្របី	Kampong Krabei	100402
10040204	កោះផ្ដៅ	Kaoh Phdau	100402
10040206	សំភិន	Samphin	100402
10040207	ទន្សោងធ្លាក់	Tonsaong Thleak	100402
10040208	យាវ	Yeav	100402
10040301	ចង្ហប	Changhab	100403
10040302	អូរពោធិ៍	Ou Pur	100403
10040303	អូរតាណឹង	Ou Ta Noeng	100403
10040304	ស្រែស្បូវ	Srae Sbov	100403
10040305	ស្រែត្រែង	Srae Traeng	100403
10040401	បាយសំណុំ	Bay Samnom	100404
10040402	ជើងពាត	Cheung Peat	100404
10040403	កំពង់ព្នៅ	Kampong Pnov	100404
10040404	កោះច្បារ	Kaoh Chbar	100404
10040405	ស្វាយចេក	Svay Chek	100404
10040501	កោះខ្ញែរ	Kaoh Khnhaer	100405
10040502	ខ្សាច់លាវ	Khsach Leav	100405
10040503	អូរកក់	Ou Kak	100405
10040504	អូរគ្រៀង	Ou Krieng	100405
10040505	អូរព្រះ	Ou Preah	100405
10040506	ពន្ធជា	Pon Chea	100405
10040601	ប៉ាក្លែ	Paklae	100406
10040602	រលួស	Roluos	100406
10040603	ស្រែឈូក	Srae Chhuk	100406
10040604	ទោង	Toung	100406
10040701	ចារថ្នោល	Char Thnaol	100407
10040702	ដូនមាស	Doun Meas	100407
10040703	កែងប្រាសាទ	Kaeng Prasat	100407
10040704	កោះរាល	Kaoh Real	100407
10040705	កោះសំ	Kaoh Sam	100407
10040706	សំបូរ	Sambour	100407
10040707	សំរោង	Samraong	100407
10040708	ស្រែខឿន	Srae Khoean	100407
10040801	ថ្មី	Thmei	100408
10040802	ធំ	Thum	100408
10040803	សណ្ដាន់	Sandan	100408
10040804	សង្គម	Sangkum	100408
10040901	អំពក	Ampok	100409
10040902	កូនវ៉ា	Koun Va	100409
10040903	ភ្នំពីរ	Phnum Pir	100409
10040904	រវៀង	Rovieng	100409
10040905	ស្រែជិះ	Srae Chis	100409
10040906	ត្នោត	Tnaot	100409
10041001	អន្លង់ព្រះគោ	Anlong Preah Kou	100410
10041002	ព្រែកគ្រៀង	Preaek Krieng	100410
10041003	វឌ្ឍនៈ	Voadthonak	100410
10041004	តាងួន	Ta Nguon	100410
10050101	មិល	Mil	100501
10050102	ចឹង	Choeng	100501
10050103	ដូង	Doung	100501
10050104	ឃ្សឹមក្នុង	Khsuem Knong	100501
10050105	ឃ្សឹមក្រៅ	Khsuem Krau	100501
10050106	សំរ៉ង	Samrang	100501
10050107	ស្រែរនាម	Srae Roneam	100501
10050108	ស្រែថ្មី	Srae Thmei	100501
10050201	ជើងឃ្លេ	Cheung Khle	100502
10050202	ជើងឃ្លូ	Cheung Khlu	100502
10050203	ថ្មហាលដីក្រហម	Thma Hal Dei Kraham	100502
10050204	ប្រវាញ	Pravanh	100502
10050205	ថ្មហាលវាល	Thma Hal Veal	100502
10050206	ត្រពាំងស្រែ	Trapeang Srae	100502
10050207	ច្រាប	Chrab	100502
10050301	កាត់ដៃ	Kat Dai	100503
10050302	ក្បាលស្នួល	Kbal Snuol	100503
10050303	គ្រង	Krong	100503
10050304	ព្រែកក្ដី	Preaek Kdei	100503
10050305	ស្នួលកើត	Snuol Kaeut	100503
10050306	ថ្ពង	Thpong	100503
10050307	ស្នួលលិច	Snuol Lech	100503
10050401	រហារិ៍	Roha	100504
10050402	ក្បាលត្រាច	Kbal Trach	100504
10050403	មាក់កណ្ដាល	Mak Kandal	100504
10050404	មានជ័យ	Mean Chey	100504
10050405	ទ្រៀក	Treak	100504
10050406	ស្អាត	S'at	100504
10050501	ថ្នល់	Thnal	100505
10050502	វត្ដ	Voat	100505
10050503	សំបួរ	Sambuor	100505
10050504	តាសោម	Ta Saom	100505
10050505	ស្រែចារ	Srae Char	100505
10050506	តាពុំ	Ta Pum	100505
10050507	ដូនមា	Doun Mea	100505
10050508	រំពុក	Rumpuk	100505
10050601	គ្រញូងសែនជ័យ	KroNhoung Sen Chey	100506
10050602	វាលបីចក្រីហេង	VealBei Chakrey Heng	100506
10050603	ជ្រោះជ្រៅពោធិ៍សាល	Chros Chrov Pousal	100506
10050604	គ្រញូងសែនជ័យខាងជើង	KroNhoung Sen Chey Khang Cheoung	100506
10060101	បុសលាវក្រោម	Bos Leav Kraom	100601
10060102	បុសលាវលើ	Bos Leav Leu	100601
10060103	ល្វាទង	Lvea Tong	100601
10060104	ព្រះគន្លង	Preah Konlong	100601
10060105	ព្រែកកូវ	Preaek Kov	100601
10060106	ព្រែកតាអាំ	Preaek Ta Am	100601
10060107	ព្រែកតាថឹង	Preaek Ta Thoeng	100601
10060108	តាលុស	Ta Lus	100601
10060201	ចង្ក្រង់	Changkrang	100602
10060202	កសាង	Kasang	100602
10060301	អញ្ចាញ	Anhchanh	100603
10060302	ជួរជ្រៃ	Chuor Chrey	100603
10060303	ដារ	Dar	100603
10060304	ខ្នងពស់	Khnang Pos	100603
10060306	ម្រ៉ើម	Mreum	100603
10060307	សេរីភាព	Sereipheap	100603
10060308	ស្ទឹងស្វាយ	Stueng Svay	100603
10060309	តាងួន	Ta Nguon	100603
10060401	អាលច	A Loch	100604
10060402	អន្ទង់វៀន	Antong Vien	100604
10060403	ច្រវ៉ា	Chrava	100604
10060404	កន្ទួត	Kantuot	100604
10060405	ស្រែនន	Srae Non	100604
10060501	បន្ទាយ	Banteay	100605
10060502	ច្រវ៉ា	Chrava	100605
10060503	កំបោរ	Kambaor	100605
10060504	គោលាប់	Kou Loab	100605
10060505	សំរិទ្ធ	Samret	100605
10060601	កណ្ដាល	Kandal	100606
10060602	ក្បាលកោះ	Kbal Kaoh	100606
10060603	ព្រែក	Preaek	100606
10060604	រកាខ្នុរ	Roka Khnor	100606
10060605	វត្ដ	Voat	100606
10060701	បឹងរុន	Boeng Run	100607
10060703	ក្បាលជួរ	Kbal Chuor	100607
10060704	សំបុក	Sambok	100607
10060705	ស្រែតាហែន	SraeTa Haen	100607
10060706	សម្បទានកាកុត	Sambaktean Kakot	100607
10060707	សម្បទានកាំពី	Sambaktean Kampi	100607
10060708	កាំពី	Kampi	100607
10060801	ជូរក្រូច	Chour Krouch	100608
10060802	ដំណាក់សសរ	Damnak Sasar	100608
10060803	ល្អក់	L'ak	100608
10060804	សំពុង	Sampung	100608
10060805	សិរីសុខា	Serei Sokha	100608
10060806	ស្រែដូង	Srae Doung	100608
10060901	ឫស្សីចារ	Ruessei Char	100609
10060902	ថ្មគ្រែកណ្ដាល	Thma Krae Kandal	100609
10060903	ថ្មគ្រែលើ	Thma Krae Leu	100609
10061001	ច្រណោល	Chranaol	100610
10061002	ខ្នាច	Khnach	100610
10061003	ក្រសាំង	Krasang	100610
10061004	មានជ័យ	Mean Chey	100610
10061005	ប្អៀរ	B'ier	100610
10061006	ស្វាយជ្រុំ	Svay Chrum	100610
10061007	ថ្មី	Thmei	100610
10061008	ត្នោត	Tnaot	100610
10061009	ទ្រាប	Treab	100610
10061010	វាលសំបូរ	Veal Sambour	100610
11010101	ពូទុង	Pu Tong	110101
11010102	ពូហ៊ួង	Pu Huong	110101
11010103	ខ្ញែង	Khnhaeng	110101
11010201	ពូរង៉ោល	Pu Ngoal	110102
11010202	ពូចា	Pu Cha	110102
11010203	ពូញ៉ាវ	Pu Nhav	110102
11010204	ពូកេះ	Pu Keh	110102
11010205	ទួល	Tuol	110102
11010301	ក្មូម	Kmoum	110103
11010302	ចក់ចារ	Chak Char	110103
11010303	រណែង	Ronaeng	110103
11010305	ព្រះ	Preah	110103
11010306	ខ្ទង់	Khtong	110103
11010307	ស្រែអណ្ដោល	Srae Andoal	110103
11010401	អូរអាម	Ou Am	110104
11010402	អូររណា	Ou Rona	110104
11010403	ស្រែអំពិល	Srae Ampil	110104
11010405	ស្រែល្វី	Srae Lvi	110104
11010406	ឆ្នែង	Chhnaeng	110104
11010407	ស្រែខ្ទុម	Srae Khtum	110104
11010408	ត្រពាំងផ្អេរ	Trapeang Pha er	110104
11010409	ឡាប៉ាខេ	La Pa Khe	110104
11010501	ហ្គាទី	Hkati	110105
11010502	ពូចា	Pu Cha	110105
11010503	ពូគង់	Pu Kong	110105
11010504	អូរច្រា	Ou Chra	110105
11010505	ស្រែព្រះ	Srae Preah	110105
11020101	ជីមាត	Chimat	110201
11020102	ណងប៊ួ	Nang Buo	110201
11020103	កោះម្យើលលើ	Kaoh Moeal Leu	110201
11020104	កោះម្យើលក្រោម	Kaoh Moeal Kraom	110201
11020201	ទួល	Tuol	110202
11020202	អ បួន	A Buon	110202
11020203	អន្ដ្រេះ	Antreh	110202
11020301	រយ៉	Roya	110203
11020303	មេមុំ	Memom	110203
11020304	ក្ដោយ	Kdaoy	110203
11020305	រវ៉ាក់	Rovak	110203
11020401	ក្លង់ឡែ	Klang Lae	110204
11020402	អញ្ជ័រ	Anhchoar	110204
11020403	ស្រែធំ	Srae Thum	110204
11020404	ជីក្លប់	Chi Klab	110204
11020501	ស្រែហ៊ុយ	Srae Huy	110205
11020502	ឈូល	Chhul	110205
11020601	មានជ័យ	Mean Chey	110206
11020602	សិរីមានរិទ្ធិ	Serei Mean Rith	110206
11020603	សិរីមង្គល	Serei Mongkol	110206
11020604	ចំរើន	Chamraeun	110206
11020605	ក្បាលជ្រោយ	Kbal Chrouy	110206
11020606	ក្បាលកោះ	Kbal Kaoh	110206
11020607	រង្សី	Reangsei	110206
11020608	សិរីរដ្ឋ	Serei Rodth	110206
11020609	អូរយ៉េះ	Ou Yeh	110206
11030101	ពូត្រែង	Pu Traeng	110301
11030102	ពូឡេះ	Pu Leh	110301
11030103	ពូឆប	Pu Chhab	110301
11030201	ពូហ្យាម	Pu Hoam	110302
11030202	អណ្ដូងក្រឡឹង	Andoung Kraloeng	110302
11030203	ពូទ្រូ	Pu Tru	110302
11030204	ពូរ៉ាង	Pu Rang	110302
11040101	ក្រង់តេះ	Krang Teh	110401
11040102	ឡៅរមៀត	Lau Romiet	110401
11040103	ពូរ៉ាប៉េត	Pu Rapet	110401
11040104	ត្រាំកាច់	Tram Kach	110401
11040201	មេប៉ៃ	Me Pai	110402
11040202	ពូជ្រៃចាង	Pu Chrey Chang	110402
11040203	ពូជ្រៃចុងផាង	Pu Chrey Chong Phang	110402
11040204	ពូតាង	Pu Tang	110402
11040301	ពូក្រូច	Pu Krouch	110403
11040302	ពូរ៉ាដែត	Pu Radaet	110403
11040303	ពូក្រេង	Pu Kraeng	110403
11040401	ពូទឺត	Pu Tuet	110404
11040402	ពូរាំង	Pu Reang	110404
11040403	ប៊ូស្រា	Bu Sra	110404
11040404	ពូទិល	Pu Til	110404
11040405	ឡាំមេះ	Lam Meh	110404
11040406	ពូចា	Pu Cha	110404
11040407	ពូលុ	Pu Lu	110404
11050101	ដើមស្រល់	Daeum Sral	110501
11050102	ជ្រៃសែន	Chrey Saen	110501
11050201	មានលាភ	Mean Leaph	110502
11050202	ដោះក្រមុំ	Daoh Kramom	110502
11050203	ស្វាយចេក	Svay Chek	110502
11050204	ឡៅកា	Lauka	110502
11050301	អូរស្ពាន	Ou Spean	110503
11050302	ចំបក់	Chambak	110503
11050303	កណ្ដាល	Kandal	110503
11050304	ចំការតែ	Chamkar Tae	110503
11050401	ពូត្រុំ	Pu Trom	110504
11050402	ពូតាំង	Pu Tang	110504
11050403	ពូលូង	Pu Lung	110504
11050404	ស្រែអ៊ី	Srae I	110504
12010101	ភូមិ ១	Phum 1	120101
12010102	ភូមិ ២	Phum 2	120101
12010103	ភូមិ ៣	Phum 3	120101
12010104	ភូមិ ៤	Phum 4	120101
12010105	ភូមិ ៥	Phum 5	120101
12010106	ភូមិ ៦	Phum 6	120101
12010107	ភូមិ ៧	Phum 7	120101
12010108	ភូមិ ៨	Phum 8	120101
12010109	ភូមិ ៩	Phum 9	120101
12010110	ភូមិ ១០	Phum 10	120101
12010111	ភូមិ ១១	Phum 11	120101
12010112	ភូមិ ១២	Phum 12	120101
12010113	ភូមិ ១៣	Phum 13	120101
12010114	ភូមិ ១៤	Phum 14	120101
12010115	ភូមិ ១៥	Phum 15	120101
12010116	ភូមិ ១៦	Phum 16	120101
12010201	ភូមិ ១	Phum 1	120102
12010202	ភូមិ ២	Phum 2	120102
12010203	ភូមិ ៣	Phum 3	120102
12010204	ភូមិ ៤	Phum 4	120102
12010205	ភូមិ ៥	Phum 5	120102
12010206	ភូមិ ៦	Phum 6	120102
12010207	ភូមិ ៧	Phum 7	120102
12010208	ភូមិ ៨	Phum 8	120102
12010209	ភូមិ ៩	Phum 9	120102
12010301	ភូមិ ១	Phum 1	120103
12010302	ភូមិ ២	Phum 2	120103
12010303	ភូមិ ៣	Phum 3	120103
12010304	ភូមិ ៤	Phum 4	120103
12010305	ភូមិ ៥	Phum 5	120103
12010306	ភូមិ ៦	Phum 6	120103
12010307	ភូមិ ៧	Phum 7	120103
12010308	ភូមិ ៨	Phum 8	120103
12010309	ភូមិ ៩	Phum 9	120103
12010401	ភូមិ ១	Phum 1	120104
12010402	ភូមិ ២	Phum 2	120104
12010403	ភូមិ ៣	Phum 3	120104
12010404	ភូមិ ៤	Phum 4	120104
12010405	ភូមិ ៥	Phum 5	120104
12010406	ភូមិ ៦	Phum 6	120104
12010407	ភូមិ ៧	Phum 7	120104
12010408	ភូមិ ៨	Phum 8	120104
12010409	ភូមិ ៩	Phum 9	120104
12010501	ភូមិ ១	Phum 1	120105
12010502	ភូមិ ២	Phum 2	120105
12010503	ភូមិ ៣	Phum 3	120105
12010504	ភូមិ ៤	Phum 4	120105
12010505	ភូមិ ៥	Phum 5	120105
12010601	ភូមិ ១	Phum 1	120106
12010602	ភូមិ ២	Phum 2	120106
12010603	ភូមិ ៣	Phum 3	120106
12010604	ភូមិ ៤	Phum 4	120106
12010605	ភូមិ ៥	Phum 5	120106
12010606	ភូមិ ៦	Phum 6	120106
12010607	ភូមិ ៧	Phum 7	120106
12010701	ភូមិ ១	Phum 1	120107
12010702	ភូមិ ២	Phum 2	120107
12010703	ភូមិ ៣	Phum 3	120107
12010704	ភូមិ ៤	Phum 4	120107
12010705	ភូមិ ៥	Phum 5	120107
12010706	ភូមិ ៦	Phum 6	120107
12010707	ភូមិ ៧	Phum 7	120107
12010708	ភូមិ ៨	Phum 8	120107
12010709	ភូមិ ៩	Phum 9	120107
12010710	ភូមិ ១០	Phum 10	120107
12010711	ភូមិ ១១	Phum 11	120107
12010801	ភូមិ ១	Phum 1	120108
12010802	ភូមិ ២	Phum 2	120108
12010803	ភូមិ ៣	Phum 3	120108
12010804	ភូមិ ៤	Phum 4	120108
12010805	ភូមិ ៥	Phum 5	120108
12010901	ភូមិ ១	Phum 1	120109
12010902	ភូមិ ២	Phum 2	120109
12010903	ភូមិ ៣	Phum 3	120109
12010904	ភូមិ ៤	Phum 4	120109
12011001	ភូមិ ១	Phum 1	120110
12011002	ភូមិ ២	Phum 2	120110
12011003	ភូមិ ៣	Phum 3	120110
12011004	ភូមិ ៤	Phum 4	120110
12011005	ភូមិ ៥	Phum 5	120110
12011101	ភូមិ ១	Phum 1	120111
12011102	ភូមិ ២	Phum 2	120111
12011106	ភូមិ ៦	Phum 6	120111
12011107	ភូមិ ៧	Phum 7	120111
12011108	ភូមិ ៨	Phum 8	120111
12011201	ភូមិ ១	Phum 1	120112
12011202	ភូមិ ២	Phum 2	120112
12011203	ភូមិ ៣	Phum 3	120112
12011204	ភូមិ ៤	Phum 4	120112
12011205	ភូមិ ៥	Phum 5	120112
12011206	ភូមិ ៦	Phum 6	120112
12011207	ភូមិ ៧	Phum 7	120112
12020101	ភូមិ១	Phum 1	120201
12020102	ភូមិ២	Phum 2	120201
12020103	ភូមិ៣	Phum 3	120201
12020104	ភូមិ៤	Phum 4	120201
12020105	ភូមិ៥	Phum 5	120201
12020106	ភូមិ៦	Phum 6	120201
12020107	ភូមិ៧	Phum 7	120201
12020108	ភូមិ៨	Phum 8	120201
12020109	ភូមិ៩	Phum 9	120201
12020110	ភូមិ១០	Phum 10	120201
12020111	ភូមិ១១	Phum 11	120201
12020201	ភូមិ១	Phum 1	120202
12020202	ភូមិ២	Phum 2	120202
12020203	ភូមិ៣	Phum 3	120202
12020204	ភូមិ៤	Phum 4	120202
12020205	ភូមិ៥	Phum 5	120202
12020206	ភូមិ៦	Phum 6	120202
12020207	ភូមិ៧	Phum 7	120202
12020208	ភូមិ៨	Phum 8	120202
12020209	ភូមិ៩	Phum 9	120202
12020301	ភូមិ ១	Phum 1	120203
12020302	ភូមិ ២	Phum 2	120203
12020303	ភូមិ ៣	Phum 3	120203
12020304	ភូមិ ៤	Phum 4	120203
12020305	ភូមិ ៥	Phum 5	120203
12020306	ភូមិ ៦	Phum 6	120203
12020307	ភូមិ ៧	Phum 7	120203
12020308	ភូមិ ៨	Phum 8	120203
12020309	ភូមិ ៩	Phum 9	120203
12020310	ភូមិ ១០	Phum 10	120203
12020311	ភូមិ ១១	Phum 11	120203
12020312	ភូមិ ១២	Phum 12	120203
12020313	ភូមិ ១៣	Phum 13	120203
12020314	ភូមិ ១៤	Phum 14	120203
12020401	ភូមិ ១	Phum 1	120204
12020402	ភូមិ ២	Phum 2	120204
12020403	ភូមិ ៣	Phum 3	120204
12020404	ភូមិ ៤	Phum 4	120204
12020405	ភូមិ ៥	Phum 5	120204
12020406	ភូមិ ៦	Phum 6	120204
12020407	ភូមិ ៧	Phum 7	120204
12020408	ភូមិ ៨	Phum 8	120204
12020409	ភូមិ ៩	Phum 9	120204
12020410	ភូមិ ១០	Phum 10	120204
12020501	ភូមិ ១	Phum 1	120205
12020502	ភូមិ ២	Phum 2	120205
12020503	ភូមិ ៣	Phum 3	120205
12020504	ភូមិ ៤	Phum 4	120205
12020505	ភូមិ ៥	Phum 5	120205
12020506	ភូមិ ៦	Phum 6	120205
12020507	ភូមិ ៧	Phum 7	120205
12020508	ភូមិ ៨	Phum 8	120205
12020509	ភូមិ ៩	Phum 9	120205
12020510	ភូមិ ១០	Phum 10	120205
12020511	ភូមិ ១១	Phum 11	120205
12020512	ភូមិ ១២	Phum 12	120205
12020513	ភូមិ ១៣	Phum 13	120205
12020514	ភូមិ ១៤	Phum 14	120205
12020515	ភូមិ ១៥	Phum 15	120205
12020516	ភូមិ ១៦	Phum 16	120205
12020601	ភូមិ ១	Phum 1	120206
12020602	ភូមិ ២	Phum 2	120206
12020603	ភូមិ ៣	Phum 3	120206
12020604	ភូមិ ៤	Phum 4	120206
12020605	ភូមិ ៥	Phum 5	120206
12020606	ភូមិ ៦	Phum 6	120206
12020607	ភូមិ ៧	Phum 7	120206
12020608	ភូមិ ៨	Phum 8	120206
12020609	ភូមិ ៩	Phum 9	120206
12020610	ភូមិ ១០	Phum 10	120206
12020611	ភូមិ ១១	Phum 11	120206
12020701	ភូមិ ១	Phum 1	120207
12020702	ភូមិ ២	Phum 2	120207
12020703	ភូមិ ៣	Phum 3	120207
12020704	ភូមិ ៤	Phum 4	120207
12020705	ភូមិ ៥	Phum 5	120207
12020706	ភូមិ ៦	Phum 6	120207
12020707	ភូមិ ៧	Phum 7	120207
12020708	ភូមិ ៨	Phum 8	120207
12020801	ភូមិ ១	Phum 1	120208
12020802	ភូមិ ២	Phum 2	120208
12020803	ភូមិ ៣	Phum 3	120208
12020804	ភូមិ ៤	Phum 4	120208
12020805	ភូមិ ៥	Phum 5	120208
12020806	ភូមិ ៦	Phum 6	120208
12020807	ភូមិ ៧	Phum 7	120208
12020808	ភូមិ ៨	Phum 8	120208
12020809	ភូមិ ៩	Phum 9	120208
12020810	ភូមិ ១០	Phum 10	120208
12020811	ភូមិ ១១	Phum 11	120208
12020901	ភូមិ ១	Phum 1	120209
12020902	ភូមិ ២	Phum 2	120209
12020903	ភូមិ ៣	Phum 3	120209
12020904	ភូមិ ៤	Phum 4	120209
12020905	ភូមិ ៥	Phum 5	120209
12020906	ភូមិ ៦	Phum 6	120209
12020907	ភូមិ ៧	Phum 7	120209
12020908	ភូមិ ៨	Phum 8	120209
12020909	ភូមិ ៩	Phum 9	120209
12020910	ភូមិ ១០	Phum 10	120209
12021001	ភូមិ ១	Phum 1	120210
12021002	ភូមិ ២	Phum 2	120210
12021003	ភូមិ ៣	Phum 3	120210
12021004	ភូមិ ៤	Phum 4	120210
12021005	ភូមិ ៥	Phum 5	120210
12021006	ភូមិ ៦	Phum 6	120210
12021007	ភូមិ ៧	Phum 7	120210
12021008	ភូមិ ៨	Phum 8	120210
12021009	ភូមិ ៩	Phum 9	120210
12021010	ភូមិ ១០	Phum 10	120210
12021011	ភូមិ ១១	Phum 11	120210
12021012	ភូមិ ១២	Phum 12	120210
12021013	ភូមិ ១៣	Phum 13	120210
12021014	ភូមិ ១៤	Phum 14	120210
12021015	ភូមិ ១៥	Phum 15	120210
12021016	ភូមិ ១៦	Phum 16	120210
12021017	ភូមិ ១៧	Phum 17	120210
12021018	ភូមិ ១៨	Phum 18	120210
12021019	ភូមិ ១៩	Phum 19	120210
12021020	ភូមិ ២០	Phum 20	120210
12021021	ភូមិ ២១	Phum 21	120210
12021022	ភូមិ ២២	Phum 22	120210
12021023	ភូមិ ២៣	Phum 23	120210
12021024	ភូមិ ២៤	Phum 24	120210
12021101	ភូមិ ១	Phum 1	120211
12021102	ភូមិ ២	Phum 2	120211
12021103	ភូមិ ៣	Phum 3	120211
12021104	ភូមិ ៤	Phum 4	120211
12021105	ភូមិ ៥	Phum 5	120211
12021106	ភូមិ ៦	Phum 6	120211
12021107	ភូមិ ៧	Phum 7	120211
12021108	ភូមិ ៨	Phum 8	120211
12021109	ភូមិ ៩	Phum 9	120211
12021110	ភូមិ ១០	Phum 10	120211
12030101	ភូមិ ១	Phum 1	120301
12030102	ភូមិ ២	Phum 2	120301
12030103	ភូមិ ៣	Phum 3	120301
12030104	ភូមិ ៤	Phum 4	120301
12030105	ភូមិ ៥	Phum 5	120301
12030106	ភូមិ ៦	Phum 6	120301
12030201	ភូមិ ១	Phum 1	120302
12030202	ភូមិ ២	Phum 2	120302
12030203	ភូមិ ៣	Phum 3	120302
12030204	ភូមិ ៤	Phum 4	120302
12030205	ភូមិ ៥	Phum 5	120302
12030206	ភូមិ ៦	Phum 6	120302
12030207	ភូមិ ៧	Phum 7	120302
12030208	ភូមិ ៨	Phum 8	120302
12030209	ភូមិ ៩	Phum 9	120302
12030301	ភូមិ ១	Phum 1	120303
12030302	ភូមិ ២	Phum 2	120303
12030303	ភូមិ ៣	Phum 3	120303
12030304	ភូមិ ៤	Phum 4	120303
12030305	ភូមិ ៥	Phum 5	120303
12030306	ភូមិ ៦	Phum 6	120303
12030401	ភូមិ ១	Phum 1	120304
12030402	ភូមិ ២	Phum 2	120304
12030403	ភូមិ ៣	Phum 3	120304
12030404	ភូមិ ៤	Phum 4	120304
12030405	ភូមិ ៥	Phum 5	120304
12030406	ភូមិ ៦	Phum 6	120304
12030407	ភូមិ ៧	Phum 7	120304
12030408	ភូមិ ៨	Phum 8	120304
12030501	ភូមិ ១	Phum 1	120305
12030502	ភូមិ ២	Phum 2	120305
12030503	ភូមិ ៣	Phum 3	120305
12030504	ភូមិ ៤	Phum 4	120305
12030505	ភូមិ ៥	Phum 5	120305
12030506	ភូមិ ៦	Phum 6	120305
12030507	ភូមិ ៧	Phum 7	120305
12030508	ភូមិ ៨	Phum 8	120305
12030509	ភូមិ ៩	Phum 9	120305
12030601	ភូមិ ១	Phum 1	120306
12030602	ភូមិ ២	Phum 2	120306
12030603	ភូមិ ៣	Phum 3	120306
12030604	ភូមិ ៤	Phum 4	120306
12030605	ភូមិ ៥	Phum 5	120306
12030606	ភូមិ ៦	Phum 6	120306
12030607	ភូមិ ៧	Phum 7	120306
12030608	ភូមិ ៨	Phum 8	120306
12030609	ភូមិ ៩	Phum 9	120306
12030610	ភូមិ ១០	Phum 10	120306
12030701	ភូមិ ១	Phum 1	120307
12030702	ភូមិ ២	Phum 2	120307
12030703	ភូមិ ៣	Phum 3	120307
12030704	ភូមិ ៤	Phum 4	120307
12030705	ភូមិ ៥	Phum 5	120307
12030706	ភូមិ ៦	Phum 6	120307
12030707	ភូមិ ៧	Phum 7	120307
12030708	ភូមិ ៨	Phum 8	120307
12030709	ភូមិ ៩	Phum 9	120307
12030710	ភូមិ ១០	Phum 10	120307
12030711	ភូមិ ១១	Phum 11	120307
12030712	ភូមិ ១២	Phum 12	120307
12030801	ភូមិ ១	Phum 1	120308
12030802	ភូមិ ២	Phum 2	120308
12030803	ភូមិ ៣	Phum 3	120308
12030804	ភូមិ ៤	Phum 4	120308
12030805	ភូមិ ៥	Phum 5	120308
12030806	ភូមិ ៦	Phum 6	120308
12040101	ភូមិ ១	Phum 1	120401
12040102	ភូមិ ២	Phum 2	120401
12040103	ភូមិ ៣	Phum 3	120401
12040104	ភូមិ ៤	Phum 4	120401
12040105	ភូមិ ៥	Phum 5	120401
12040106	ភូមិ ៦	Phum 6	120401
12040107	ភូមិ ៧	Phum 7	120401
12040108	ភូមិ ៨	Phum 8	120401
12040109	ភូមិ ៩	Phum 9	120401
12040110	ភូមិ ១០	Phum 10	120401
12040201	ភូមិ ១	Phum 1	120402
12040202	ភូមិ ២	Phum 2	120402
12040203	ភូមិ ៣	Phum 3	120402
12040204	ភូមិ ៤	Phum 4	120402
12040205	ភូមិ ៥	Phum 5	120402
12040206	ភូមិ ៦	Phum 6	120402
12040207	ភូមិ ៧	Phum 7	120402
12040208	ភូមិ ៨	Phum 8	120402
12040209	ភូមិ ៩	Phum 9	120402
12040210	ភូមិ ១០	Phum 10	120402
12040211	ភូមិ ១១	Phum 11	120402
12040301	ភូមិ ១	Phum 1	120403
12040302	ភូមិ ២	Phum 2	120403
12040303	ភូមិ ៣	Phum 3	120403
12040304	ភូមិ ៤	Phum 4	120403
12040305	ភូមិ ៥	Phum 5	120403
12040306	ភូមិ ៦	Phum 6	120403
12040307	ភូមិ ៧	Phum 7	120403
12040308	ភូមិ ៨	Phum 8	120403
12040309	ភូមិ ៩	Phum 9	120403
12040310	ភូមិ ១០	Phum 10	120403
12040401	ភូមិ ១	Phum 1	120404
12040402	ភូមិ ២	Phum 2	120404
12040403	ភូមិ ៣	Phum 3	120404
12040404	ភូមិ ៤	Phum 4	120404
12040405	ភូមិ ៥	Phum 5	120404
12040406	ភូមិ ៦	Phum 6	120404
12040407	ភូមិ ៧	Phum 7	120404
12040408	ភូមិ ៨	Phum 8	120404
12040409	ភូមិ ៩	Phum 9	120404
12040410	ភូមិ ១០	Phum 10	120404
12040411	ភូមិ ១១	Phum 11	120404
12040412	ភូមិ ១២	Phum 12	120404
12040413	ភូមិ ១៣	Phum 13	120404
12040414	ភូមិ ១៤	Phum 14	120404
12040415	ភូមិ ១៥	Phum 15	120404
12040416	ភូមិ ១៦	Phum 16	120404
12040501	ភូមិ ១	Phum 1	120405
12040502	ភូមិ ២	Phum 2	120405
12040503	ភូមិ ៣	Phum 3	120405
12040504	ភូមិ ៤	Phum 4	120405
12040505	ភូមិ ៥	Phum 5	120405
12040506	ភូមិ ៦	Phum 6	120405
12040507	ភូមិ ៧	Phum 7	120405
12040508	ភូមិ ៨	Phum 8	120405
12040509	ភូមិ ៩	Phum 9	120405
12040510	ភូមិ ១០	Phum 10	120405
12040511	ភូមិ ១១	Phum 11	120405
12040512	ភូមិ ១២	Phum 12	120405
12040513	ភូមិ ១៣	Phum 13	120405
12040601	ភូមិ ១	Phum 1	120406
12040602	ភូមិ ២	Phum 2	120406
12040603	ភូមិ ៣	Phum 3	120406
12040604	ភូមិ ៤	Phum 4	120406
12040605	ភូមិ ៥	Phum 5	120406
12040606	ភូមិ ៦	Phum 6	120406
12040607	ភូមិ ៧	Phum 7	120406
12040608	ភូមិ ៨	Phum 8	120406
12040609	ភូមិ ៩	Phum 9	120406
12040610	ភូមិ ១០	Phum 10	120406
12040611	ភូមិ ១១	Phum 11	120406
12040612	ភូមិ ១២	Phum 12	120406
12040613	ភូមិ ១៣	Phum 13	120406
12040701	ភូមិ ១	Phum 1	120407
12040702	ភូមិ ២	Phum 2	120407
12040703	ភូមិ ៣	Phum 3	120407
12040704	ភូមិ ៤	Phum 4	120407
12040705	ភូមិ ៥	Phum 5	120407
12040706	ភូមិ ៦	Phum 6	120407
12040707	ភូមិ ៧	Phum 7	120407
12040708	ភូមិ ៨	Phum 8	120407
12040709	ភូមិ ៩	Phum 9	120407
12040710	ភូមិ ១០	Phum 10	120407
12040711	ភូមិ ១១	Phum 11	120407
12040712	ភូមិ ១២	Phum 12	120407
12040713	ភូមិ ១៣	Phum 13	120407
12040714	ភូមិ ១៤	Phum 14	120407
12040801	ភូមិ ១	Phum 1	120408
12040802	ភូមិ ២	Phum 2	120408
12040803	ភូមិ ៣	Phum 3	120408
12040804	ភូមិ ៤	Phum 4	120408
12040805	ភូមិ ៥	Phum 5	120408
12040806	ភូមិ ៦	Phum 6	120408
12040807	ភូមិ ៧	Phum 7	120408
12040808	ភូមិ ៨	Phum 8	120408
12040809	ភូមិ ៩	Phum 9	120408
12040810	ភូមិ ១០	Phum 10	120408
12040811	ភូមិ ១១	Phum 11	120408
12040812	ភូមិ ១២	Phum 12	120408
12040813	ភូមិ ១៣	Phum 13	120408
12040814	ភូមិ ១៤	Phum 14	120408
12040815	ភូមិ ១៥	Phum 15	120408
12040816	ភូមិ ១៦	Phum 16	120408
12040817	ភូមិ ១៧	Phum 17	120408
12040818	ភូមិ ១៨	Phum 18	120408
12040819	ភូមិ ១៩	Phum 19	120408
12040820	ភូមិ ២០	Phum 20	120408
12040821	ភូមិ ២១	Phum 21	120408
12040822	ភូមិ ២២	Phum 22	120408
12040823	ភូមិ ២៣	Phum 23	120408
12040901	ភូមិ ១	Phum 1	120409
12040902	ភូមិ ២	Phum 2	120409
12040903	ភូមិ ៣	Phum 3	120409
12040904	ភូមិ ៤	Phum 4	120409
12040905	ភូមិ ៥	Phum 5	120409
12040906	ភូមិ ៦	Phum 6	120409
12040907	ភូមិ ៧	Phum 7	120409
12040908	ភូមិ ៨	Phum 8	120409
12040909	ភូមិ ៩	Phum 9	120409
12040910	ភូមិ ១០	Phum 10	120409
12040911	ភូមិ ១១	Phum 11	120409
12040912	ភូមិ ១២	Phum 12	120409
12040913	ភូមិ ១៣	Phum 13	120409
12040914	ភូមិ ១៤	Phum 14	120409
12040915	ភូមិ ១៥	Phum 15	120409
12040916	ភូមិ ១៦	Phum 16	120409
12041001	ភូមិ ១	Phum 1	120410
12041002	ភូមិ ២	Phum 2	120410
12041003	ភូមិ ៣	Phum 3	120410
12041004	ភូមិ ៤	Phum 4	120410
12041005	ភូមិ ៥	Phum 5	120410
12041006	ភូមិ ៦	Phum 6	120410
12041007	ភូមិ ៧	Phum 7	120410
12041008	ភូមិ ៨	Phum 8	120410
12041009	ភូមិ ៩	Phum 9	120410
12041010	ភូមិ ១០	Phum 10	120410
12041011	ភូមិ ១១	Phum 11	120410
12041012	ភូមិ ១២	Phum 12	120410
12041013	ភូមិ ១៣	Phum 13	120410
12041014	ភូមិ ១៤	Phum 14	120410
12041015	ភូមិ ១៥	Phum 15	120410
12041016	ភូមិ ១៦	Phum 16	120410
12041017	ភូមិ ១៧	Phum 17	120410
12050101	ថ្មី	Thmei	120501
12050102	បាគូ	Baku	120501
12050103	សំបួរ	Sambuor	120501
12050104	តាឡី	Ta Lei	120501
12050105	ម័ល	Mol	120501
12050106	ខ្វា	Khva	120501
12050701	ត្រពាំងទា	Trapeang Tea	120507
12050702	ត្រពាំងគ	Trapeang Kor	120507
12050703	ពងទឹក	Pong Tuek	120507
12050704	វត្ដស្លែង	Voat Slaeng	120507
12050705	ស្រែញ័រ	Srae Nhoar	120507
12050706	ឃ្លះសណ្ដាយ	Khleah Sanday	120507
12050707	ព្រៃកី ខ	Prey Kei Kha	120507
12050708	ព្រៃកី ក	Prey Kei Ka	120507
12050709	ត្រាំងដោក	Trang Daok	120507
12050710	ត្រពាំងសាលា	Trapeang Sala	120507
12050801	ព្រៃវែងខាងលិច	Prey Veaeng Khang Lech	120508
12050802	ព្រៃវែងខាងកើត	Prey Veaeng Khang Kaeut	120508
12050803	ត្រពាំងចក	Trapeang Chak	120508
12050804	ត្រពាំងស្វាយ	Trapeang Svay	120508
12050805	ទ័ពបោះ	Toap Baoh	120508
12050806	កំរៀង	Kamrieng	120508
12050807	រោលជ្រូក	Roul Chruk	120508
12050808	សេរីដីដុះ	Serei Dei Doh	120508
12050809	ទួលសំបូរ	Tuol Sambour	120508
12051001	ព្រៃធំ	Prey Thum	120510
12051002	ព្រៃសខាងកើត	Prey Sa Khang Kaeut	120510
12051003	ប្រការ	Prakar	120510
12051004	ព្រៃសខាងលិច	Prey Sa Khang Lech	120510
12051005	ព្រៃទីទុយ	Prey Tituy	120510
12051006	អន្លង់គង	Anlong Kong	120510
12051007	គោកបន្ទាយ	Kouk Banteay	120510
12051008	ធម្មត្រ័យ	Thommeak Trai	120510
12051009	ពាម	Peam	120510
12051010	ម្ភៃបួន	Mphey Buon	120510
12051011	អន្លង់គងថ្មី	Anlong Kong Thmei	120510
12051012	ទួលរកាកុះ	Tuol Roka Koh	120510
12051201	ក្រាំងស្វាយ	Krang Svay	120512
12051202	ក្រាំងពង្រ	Krang Pongro	120512
12051203	ទឹកថ្លា	Tuek Thla	120512
12051204	ព្រៃសំព័រ	Prey Sampoar	120512
12051301	ប្រទះឡាង	Prateah Lang	120513
12051302	ភា	Phea	120513
12051303	អង្គ	Angk	120513
12051304	តាំងរនាម	Tang Roneam	120513
12051305	គោកខ្សាច់	Kouk Khsach	120513
12051306	គោកមាស	Kouk Meas	120513
12051401	ពោធី៍រលំ	Pou Rolum	120514
12051402	ខ្វិត	Khvet	120514
12051403	ក្រាំងតាផូ	Krang Ta Phou	120514
12051404	កំរ៉ែង	Kamraeng	120514
12051405	សំបួរ	Sambuor	120514
12051406	សាក់សំពៅ	Sak Sampov	120514
12051407	ពារាម	Peaream	120514
12051501	ជើងឯក	Cheung Aek	120515
12051502	រលួស	Roluos	120515
12051503	ស្រុកចេក	Srok Chek	120515
12051504	ព្រែកប្រណាក	Preaek Pranak	120515
12051505	ព្រែកថ្លឹង	Preaek Thloeng	120515
12051506	បូរីកម្មករ	Bourei Kameakkar	120515
12051601	គងនយ	Kong Noy	120516
12051602	វាលថ្លាន់	Veal Thlan	120516
12051603	សេរីសម្បត្ដិ	Serei Sambatt	120516
12051604	ត្រពាំងសំរិត	Trapeang Samret	120516
12051701	ព្រែកកំពឹស	Preaek Kampues	120517
12051702	ព្រែករទាំង	Preaek Roteang	120517
12051703	ព្រែកថ្លឹង	Preaek Thloeng	120517
12051704	ដំណាក់សង្កែ	Damnak Sangkae	120517
12051705	ស្រីស្នំ	Srei Snam	120517
12051706	ក្រាំងស្វាយ	Krang Svay	120517
12051801	ក្រពើទ្រោម	Krapeu Troum	120518
12051802	ព្រះធាតុ	Preah Theat	120518
12051803	កណ្ដាល	Kandal	120518
12051901	អញ្ចាញ	Anhchanh	120519
12051902	គោកឪឡឹក	Kouk Ovloek	120519
12051903	ម៉ឺន្ដ្រា	Meun Tra	120519
12051904	ស្ពានថ្ម	Spean Thma	120519
12051905	ស្វាយមានល័ក្ខណ៍	Svay Mean Leak	120519
12051906	ភូមិហា	Phum Ha	120519
12051907	ដូង	Doung	120519
12051908	ព្រែកជ្រៃ	Preaek Chrey	120519
12052001	ក្រាំងក្រូច	Krang Krouch	120520
12052002	ថ្មី	Thmei	120520
12052003	ថ្ម	Thma	120520
12052004	កន្ទុយទឹក	Kantuy Tuek	120520
12052005	សាលា	Sala	120520
12052006	ក្រាំង	Krang	120520
12060601	ព្រែកតាគង់	Prek Ta Kong	120606
12060602	ព្រែកតានូ	Prek Ta Nu	120606
12060603	ព្រែកតាគង់១	Prek Ta Kong I	120606
12060604	ព្រែកតាគង់២	Prek Ta Kong II	120606
12060605	ព្រែកតាគង់៣	Prek Ta Kong III	120606
12090910	តានួន	Ta Nuon	120909
12060606	ព្រែកតានូ១	Preaek Ta Nu I	120606
12060607	ព្រែកតានូ២	Preaek Ta Nu II	120606
12060701	ទួលរកា	Tuol Roka	120607
12060702	ព្រែកតាឡុង	Preaek Ta Long	120607
12060703	ទួលរកា១	Tuol Roka Muoy	120607
12060704	ទួលរកា២	Tuol Roka Pir	120607
12060705	ទួលរកា៣	Tuol Roka Bei	120607
12060706	ព្រែកតាឡុង១	Preaek Ta Long Muoy	120607
12060707	ព្រែកតាឡុង២	Preaek Ta Long II	120607
12060708	ព្រែកតាឡុង៣	Preaek Ta Long III	120607
12060801	មានជ័យ	Mean Chey	120608
12060802	មានជ័យ១	Mean Chey Muoy	120608
12060803	មានជ័យ២	Mean Chey 2	120608
12060804	ថ្មី	Thmei	120608
12060805	ទ្រា	Trea	120608
12060806	ទ្រា១	Trea Muoy	120608
12060807	ទ្រា២	Trea Pir	120608
12060808	ទ្រា៣	Trea Bei	120608
12060901	ភ្នាត	Phneat	120609
12060902	ដំណាក់ធំ	Damnak Thum	120609
12060903	ដំណាក់ធំ១	Damnak Thum Muoy	120609
12060904	ដំណាក់ធំ៤	Damnak Thum 4	120609
12060905	ឫស្សី	Ruessei	120609
12060906	ឫស្សី ៣	Ruessei 3	120609
12060907	ព្រែកទាល់	Prek Toal	120609
12060908	ព្រែកទាល់១	Prek Toal 1	120609
12061001	ទ្រា៤	Trea Buon	120610
12061002	ឫស្សី១	Russey Muoy	120610
12061003	ឫស្សី ២	Ruessei 2	120610
12061004	ដំណាក់ធំ២	Damnak Thum Pir	120610
12061005	ដំណាក់ធំ៣	Damnak Thum Bei	120610
12061006	ដំណាក់ធំ៥	Damnak Thum 5	120610
12061101	ចំរើនផល	Chamraeun Phal	120611
12061102	ចំរើនផល១	Chamroeunphal Muoy	120611
12061103	ចំរើនផល២	Chamroeunphal 2	120611
12061104	ចំរើនផល៣	Chamroeunphal 3	120611
12061105	ចំរើនផល៤	Chamroeunphal 4	120611
12061106	សន្សំកុសល ១	Sansam Kosal Muoy	120611
12061107	សន្សំកុសល ២	Sansam Kosal Pir	120611
12061108	សន្សំកុសល ៣	Sansam Kosal 3	120611
12061109	សន្សំកុសល ៤	Sansam Kosal 4	120611
12061110	សន្សំកុសល ៥	Sansam Kosal 5	120611
12061111	សន្សំកុសល៦	Sansam Kosal 6	120611
12061201	ក្បាលទំនប់	Kbal Tumnob	120612
12061202	ក្បាលទំនប់១	Kbal Tumnub Muoy	120612
12061203	ក្បាលទំនប់២	Kbal Tumnub Pir	120612
12061204	ក្បាលទំនប់៣	Kbal Tumnub 3	120612
12061205	ត្នោតជ្រុំ	Tnaot Chrum	120612
12061206	ត្នោតជ្រុំ១	Tnaot Chrum Muoy	120612
12061207	ត្នោតជ្រុំ២	Tnaot Chrum Pir	120612
12061208	ត្នោតជ្រុំ៣	Tnaot Chrum Bei	120612
12061209	ត្នោតជ្រុំ៤	Tnaot Chrum Boun	120612
12061210	ត្នោតជ្រុំ៥	Tnaot Chrum 5	120612
12061211	ត្នោតជ្រុំ៦	Tnaot Chrum 6	120612
12070301	ឡកំបោរ	La Kambaor	120703
12070302	លូ	Lu	120703
12070303	ស្វាយប៉ាក	Svay Pak	120703
12070401	ក្រោលគោ	Kraol Kou	120704
12070402	ស្ពានខ្ពស់	Spean Khpos	120704
12070403	បឹងឈូក	Boeng Chhuk	120704
12070601	មិត្ដភាព	Mittakpheap	120706
12070602	សាមគ្គី	Sameakki	120706
12070603	ឃ្លាំងសាំង	Khleang Sang	120706
12070604	បឹងសាឡាង	Boeng Salang	120706
12071101	ភូមិ ១	Phum 1	120711
12071102	ភូមិ ២	Phum 2	120711
12071103	ភូមិ ៣	Phum 3	120711
12071104	ភូមិ ៤	Phum 4	120711
12071201	ភូមិ ក	Phum Ka	120712
12071202	ភូមិ ខ១	Phum Kha Muoy	120712
12071203	ភូមិ ខ២	Phum Kha Pir	120712
12071204	ភូមិឃ	Phum Kho	120712
12071301	ផ្សារតូច	Phsar Toch	120713
12071302	ទួលសង្កែ	Toul sangke	120713
12071303	ទួលគោក	Tuol Kok	120713
12071304	ចុងខ្សាច់	Chong Khsach	120713
12071305	បាក់ទូក	Bak Touk	120713
12071306	ទួលសំពៅ	Tuol Sampov	120713
12071401	គង្គាផុស	Kongkea Phos	120714
12071402	កោះអណ្តែត	Kos Andaet	120714
12071403	ពោងពាយ	Pong Peav	120714
12071404	បឹងរាំង	Boeung Rang	120714
12071405	ទួលពពែ	Tuol Porpae	120714
12071406	ទួលថ្ងាន់	Tuol Thgan	120714
12080102	ពោងពាយ	Poung Peay	120801
12080104	បាយ៉ាប	Bayab	120801
12080105	ភ្នំពេញថ្មី	Phnom Penh Thmei	120801
12080107	ទំនប់	Tumnob	120801
12080111	ទំនប់១	Tumnob 1	120801
12080113	ឧកញ៉ាវាំង	Ouknha Veang	120801
12080204	ផ្សារទឹកថ្លា	Phsar Tuek Thla	120802
12080205	សេប៉េសេ	Se Pe Se	120802
12080206	បូរី១០០ខ្នង	Bourei Muoy Roy Khnang	120802
12080207	ចុងថ្នល់ខាងកើត	Chong Thnal Khang Kaeut	120802
12080208	ចុងថ្នល់ខាងលិច	Chong Thnal Khang Lech	120802
12080209	ទឹកថ្លា	Tuek Thla	120802
12080211	បុរីកម្មករ	Borey Kamakar	120802
12080301	ឃ្មួញ	Anlong Kngan	120803
12080302	បន្លាស្អិត	Banla S'et	120803
12080303	សំរោង	Samraong	120803
12080304	អន្លង់ក្ងាន	Anlong Kngan	120803
12080305	ត្រពាំងរាំង	Trapeang Reang	120803
12080306	សែនសុខទី១	Saen Sokh Ti Muoy	120803
12080307	សែនសុខទី២	Saen Sokh Ti Pir	120803
12080308	សែនសុខទី៣	Saen Sokh Ti Bei	120803
12080309	សែនសុខទី៤	Saen Sokh Ti Buon	120803
12080310	សែនសុខទី៥	Seaen Sokh Ti Pram	120803
12080311	សែនសុខទី៦	Saen Sokh Ti Prammuoy	120803
12080312	សែនសុខទី៧	Saen Sokh Ti Prampir	120803
12080313	ត្រពាំងរាំងថ្មី	Trapeang Reang Thmei	120803
12080701	ក្រាំងអង្ក្រង	Krang Angkrang	120807
12080702	ត្រពាំងមាន	Trapeang Mean	120807
12080703	ជាងទង	Cheang Tong	120807
12080704	ត្រពាំងជើងស្រុក	Trapeang Cheung Srok	120807
12080705	ព្រៃខ្លា	Prey Khla	120807
12080706	សំរោងទាវ	Samraong Teav	120807
12080707	ព្រៃមូល	Prey Mul	120807
12080708	វិមានទ្រង់	Vimean Trong	120807
12080801	អូរបែកក្អម	Ou Baek K'am	120808
12080802	ត្រពាំងឈូក	Trapeang Chhuk	120808
12080803	អ័រគីដេ	Orchide	120808
12080804	ស្លែងរលើង	Slaeng Roleung	120808
12080805	ទ្រុងមាន់	Trong Moan	120808
12080901	រោងចក្រ	Roung Chakr	120809
12080902	រោងចក្រ១	Roung Chakr 1	120809
12080903	ក្រុងថ្មី	Krong Thmey	120809
12080904	ត្រពាំងស្វាយ	Trapeang Svay	120809
12080905	ដីថ្មី	Dei Thmei	120809
12080906	ដំណាក់	Damnak	120809
12080907	គោកឃ្លាង	Kouk Khleang	120809
12080908	ច្រេស	Chres	120809
12090101	អក្សរ	Aksar	120901
12090102	ក្រាំង	Krang	120901
12090103	ត្រពាំងអណ្ដូង	Trapaang Andoung	120901
12090104	ព្រៃដូនអុក	Prey Doun Ok	120901
12090105	ត្រពាំងទា	Trapeang Tea	120901
12090106	ត្រពាំងអញ្ចាញ	Trapeang Anhchanh	120901
12090107	ជង្រុក	Chongruk	120901
12090108	វាល	Veal	120901
12090109	ខ្វែ	Khvae	120901
12090110	ត្រពាំងក្រសាំង	Trapeang Krasang	120901
12090111	សាមគ្គី ១	Sameakki 1	120901
12090112	សាមគ្គី ២	Sameakki 2	120901
12090113	សាមគ្គី ៣	Sameakki 3	120901
12090301	ទួលកី	Tuol Kei	120903
12090302	កប់ភ្លុក	Kab Phluk	120903
12090303	ព្រៃរងៀង	Prey Rongieng	120903
12090304	ត្រាញ់តាបាញ់	Tranh Tabanh	120903
12090305	ភ្លើងឆេះរទេះលិច	Phleung Chheh Roteh Lech	120903
12090306	ភ្លើងឆេះរទេះកើត	Phleung Chheh Roteh  Keut	120903
12090307	គោកខ្សាច់	Kouk Khsach	120903
12090308	ព្រៃកី	Prey Kei	120903
12090601	ចំការស្បែង	Chamkar Sbaeng	120906
12090602	ត្រពាំងធ្នង់	Trapeang Thnong	120906
12090603	គោកព្រេជ	Kouk Prich	120906
12090604	តិកូបញ្ញេ	Tekapanhao	120906
12090605	សំរោង	Samraong	120906
12090606	ចែងម៉ែង	Chaeng Maeng	120906
12090607	ចាក់ជ្រូក	Chak Chruk	120906
12090608	អករំដួល	Ak Rumduol	120906
12090609	ស្រែរាជ្ជៈ	Srae Reacheak	120906
12090610	អណ្ដូងតាអន	Andoung Ta An	120906
12090611	ព្រៃពពេល	Prey Popel	120906
12090801	ត្មាតពង	Tmat Pong	120908
12090802	ព្រៃរមាសទី២	Prey Romeas Ti Pir	120908
12090803	ព្រៃរមាសទី១	Prey Romeas Ti Muoy	120908
12090804	តាជេត	Ta Chet	120908
12090805	បឹងធំទី១	Boeng Thum Ti Muoy	120908
12090806	បឹងធំទី២	Boeng Thum Ti Pir	120908
12090807	បឹងធំទី៣	Boeng Thum Ti Bei	120908
12090808	ដូនកុក	Doun Kok	120908
12090809	ខ្ចៅ	Khchau	120908
12090810	ក្ងោក	Kngaok	120908
12090811	ទួលស្វាយ	Tuol Svay	120908
12090812	ត្រពាំងក្រសាំង	Trapeang Krasang	120908
12090813	ចំបក់ពណ្ណរាយ	Chambak Ponnoreay	120908
12090814	ត្រពាំងត្រប់	Trapeang Trab	120908
12090815	អន្លុងស្វាយ	Anlong Svay	120908
12090816	ព្រៃតាកែ	Prey Ta Kae	120908
12090901	ផ្សារកំបូល	Phsar Kamboul	120909
12090902	តាកេរិ៍្ដ	Ta Ke	120909
12090903	ត្រពាំងទួល	Trapeang Tuol	120909
12090904	កំបូល	Kamboul	120909
12090905	ទួលតាឡាត់	Tuol Ta Lat	120909
12090906	តាភេម	Ta Phem	120909
12090907	ព្រៃកុដិ	Prey Kod	120909
12090908	តាសេក	Ta Sek	120909
12090909	ទួលសាម៉	Tuol Sama	120909
12090911	កប់អំបិល	Kab Ambel	120909
12090912	ស្នួលខ្ពស់	Snuol Khpos	120909
12090913	អំពិល	Ampil	120909
12090914	ត្រិប	Treb	120909
12090915	សាឡូង	Saloung	120909
12090916	ជំទាវម៉ៅ	Chumteav Mau	120909
12090917	អង្គបឹងចក	Angk Boeng Chak	120909
12090918	លិចវត្ដ	Lech Voat	120909
12091002	ថ្មដា	Thma Da	120910
12091003	ត្រពាំងគល់	Trapeang Kol	120910
12091004	ស្ងួនពេជ្រ	Snguon Pech	120910
12091005	កន្ទោកត្បូង	Kantaok Tboung	120910
12091006	គល់	Kol	120910
12091007	អង្គត្រគៀត	Angk Trakiet	120910
12091008	កន្ទោកជើង	Kantaok Cheung	120910
12091009	ត្រពាំងឈូក	Trapeang Chhuk	120910
12091010	ស្រែក្នុង	Srae Knong	120910
12091012	ព្រៃបឹង	Prey Boeng	120910
12091013	កំរៀង	Kamrieng	120910
12091015	ដំបូកខ្ពស់	Dambouk Khpos	120910
12091017	ត្រាំស្លឹក	Tram Sloek	120910
12091101	ព្រៃតាប៉ុក	Prey Ta Pok	120911
12091102	ត្រពាំងកក់	Trapeang Kak	120911
12091103	អង្គស្លែង	Angk Slaeng	120911
12091104	ដូនរ័ត្ន	Doun Roatn	120911
12091105	ត្រពាំងអារ័ក្ស	Trapeang Areaks	120911
12091106	ត្រពាំងពោធិ៍	Trapeang Pou	120911
12091107	បឹងគ្រើល	Boeng Kreul	120911
12091108	ជ័យជំនះ	Chey Chumneah	120911
12091109	បឹងកំបោរ	Boeng Kambaor	120911
12091110	ត្បែងមានជ័យ	Tbaeng Mean Chey	120911
12091111	ត្រង់នំ	Trang Num	120911
12091112	ពង្រ	Pongro	120911
12091113	ថ្ម	Thma	120911
12091114	សាមគ្គីប្រយុទ្ធ	Sameakki Prayutth	120911
12091301	សាក់ប្រយុទ្ធ	Sak Prayutth	120913
12091302	អង្គរជ័យ	Angkor Chey	120913
12091303	ស្រែអំពិល	Srae Ampil	120913
12091304	តាអិន	Ta En	120913
12091305	កុលក្រស្នារ	Kol Krasna	120913
12091306	ប្រាសាទ	Prasat	120913
12091307	ស្វាយ	Svay	120913
12091308	ស្នោរកើត	Snaor Kaeut	120913
12091309	តាពូង	Ta Pung	120913
12091310	ផ្លាំង	Phlang	120913
12091311	ស្នោរលិច	Snaor Lech	120913
12091312	ពង្រ	Pongro	120913
12091313	ព្រៃរឹង	Prey Rueng	120913
12091314	រំដួលជើង	Rumduol Cheung	120913
12091315	រំដួលត្បូង	Rumduol Tboung	120913
12091316	ទួលលៀប	Tuol Lieb	120913
12091317	ព្រៃក្រាយ	Prey Kray	120913
12091318	ព្រៃឈូក	Prey Chhuk	120913
12091401	គោកចំបក់	Kouk Chambak	120914
12091402	ទួលពង្រ	Tuol Pongro	120914
12091403	ត្រពាំងរំចេក	Trapeang Rumchek	120914
12091404	ចោមចៅ១	Chaom Chau 1	120914
12091405	ត្រពាំងថ្លឹង១	Trapeang Thloeng 1	120914
12091406	ត្រពាំងថ្លឹង២	Trapeang Thloeng 2	120914
12091407	ត្រពាំងថ្លឹង៣	Trapeang Thloeng 3	120914
12091408	ត្រពាំងថ្លឹង៤	Trapeang Thloeng 4	120914
12091501	ថ្មគោល១	Thma Koul 1	120915
12091502	ថ្មគោល២	Thma Koul 2	120915
12091503	ថ្មគោល៣	Thma Koul 3	120915
12091504	ចោមចៅ២	Chaom Chau 2	120915
12091505	ចោមចៅ៣	Chaom Chau 3	120915
12091506	ជ្រៃកោង	Chrey Kaong	120915
12091507	ល្វា	Lvea	120915
12091508	ព្រៃល្ង	Prey Lngor	120915
12091509	ព្រៃស្ពឺ	Prey Spueu	120915
12091510	ព្រៃកំបុត	Prey Kambot	120915
12091511	ដំណាក់ត្រយឹង	Damnak Trayueng	120915
12091512	ស្រែជំរៅ	Srae Chumrov	120915
12091513	កប់គង	Kab Kong	120915
12091514	ក្រាំងដូនទៃ	Krang Doun Tey	120915
12091515	ព្រៃសណ្ដែក	Prey Sandaek	120915
12091516	ព្រៃព្រីងខាងត្បូង១	Prey Pring Khang Tboung 1	120915
12091601	ព្រៃទា១	Prey Tea 1	120916
12091602	ព្រៃទា២	Prey Tea 2	120916
12091603	ព្រៃជីសាក់	Prey Chi Sak	120916
12091604	ត្រពាំងពោធិ៍	Trapeang Pou	120916
12091605	ព្រៃព្រីងខាងជើង១	Prey Pring Khang Cheung 1	120916
12091606	ព្រៃព្រីងខាងជើង២	Prey Pring Khang Cheung 2	120916
12091607	ព្រៃព្រីងខាងត្បូង២	Prey Pring Khang Tboung 2	120916
12091608	ថ្នល់បំបែក	Thnal Bambaek	120916
12091609	ជម្ពូវ័ន១	Chumpu Voan 1	120916
12091610	ជម្ពូវ័ន២	Chumpu Voan 2	120916
12091611	ព្រៃស្វាយ	Prey Svay	120916
12091612	អង្គកែវ	Angk  Kaev	120916
12091613	អង្គ	Angk	120916
12091614	អូរ ដឹម	Ou Dem	120916
12091701	ក្បាលដំរី១	Kbal Damrei 1	120917
12091702	ចំការឪឡឹក១	Chamkar Ovloek 1	120917
12091703	តាងួន១	Ta Nguon 1	120917
12091704	តាងួន២	Ta Nguon 2	120917
12091705	ប៉ប្រកខាងត្បូង	Paprak Khang Tboung	120917
12091706	ត្រពាំងល្វា១	Trapeang Lvea 1	120917
12091707	ត្រពាំងល្វា២	Trapeang Lvea 2	120917
12091708	ប៉ប្រកខាងជើង	Paprak Khang Cheung	120917
12091801	ក្បាលដំរី២	Kbal Damrei 2	120918
12091802	ចំការឪឡឹក២	Chamkar Ovloek 2	120918
12091803	ព្រៃសាលា	Prey Sala	120918
12091804	កាកាប	Kakab	120918
12091805	ត្រពាំងជ្រៃ	Trapeang Chrey	120918
12100101	ភូមិ ១	Phum 1	121001
12100102	ភូមិ ២	Phum 2	121001
12100103	ភូមិ ៣	Phum 3	121001
12100104	ដើមគរ	Daeum Kor	121001
12100105	គៀនឃ្លាំង	Kien Khleang	121001
12100201	គៀនឃ្លាំង	Kien Khleang	121002
12100202	ព្រែកលៀប	Preaek Lieb	121002
12100203	បាក់ខែង	Bak Khaeng	121002
12100204	ខ្ទរ	Khtor	121002
12100301	ព្រែកតារ័ត្ន	Preaek Ta Roatn	121003
12100302	ព្រែកតាគង់	Preaek Ta Kong	121003
12100303	ព្រែករាំង	Preaek Reang	121003
12100304	ព្រែកតាសេក	Preaek Ta Sek	121003
12100305	ដើមគរ	Daeum Kor	121003
12100401	ចុងកោះ	Chong Kaoh	121004
12100402	ល្វា	Lvea	121004
12100403	ក្បាលកោះ	Kbal Kaoh	121004
12100404	កោះដាច់	Kaoh Dach	121004
12100405	រនះ	Roneah	121004
12100501	បាក់ខែងលើ	Bak Khaeng Leu	121005
12100502	ក្ដីចាស់	Kdei Chas	121005
12100503	ចំបក់មាស	Chambak Meas	121005
12110101	ដួង	Duong	121101
12110102	ពោធិ៍មង្គល	Pou Mongkol	121101
12110103	ព្រែកព្នៅ	Preaek Pnov	121101
12110104	ផ្សារលិច	Phsar Lech	121101
12110105	កណ្ដាល	Kandal	121101
12110201	ធំត្បូង	Thum Tboung	121102
12110202	ធំជើង	Thum Cheung	121102
12110203	ត្រពាំងស្នោរ	Trapeang Snaor	121102
12110204	បឹង	Boeng	121102
12110205	ត្រពាំងព្រីង	Trapeang Pring	121102
12110206	ស្រែដូនតូច	Srae Doun Touch	121102
12110207	ព្រៃពង្រ	Prey Pongro	121102
12110208	វែង	Veaeng	121102
12110301	គ្រួស	Kruos	121103
12110302	សំរោងជើង	Samraong Cheung	121103
12110303	សំរោងកណ្ដាល	Samraong Kandal	121103
12110304	សំរោងត្បូង	Samraong Tboung	121103
12110401	កប់ស្រូវតូច	Kab Srov Touch	121104
12110402	កប់ស្រូវធំ	Kab Srov Thum	121104
12110403	ស្វាយចេក	Svay Chek	121104
12110404	បែកបក	Baek Bak	121104
12110405	ត្រពាំងវែង	Trapeang Veaeng	121104
12110406	ត្រពាំងពោធិ៍	Trapeang Pou	121104
12110407	ព្រៃធំ	Prey Thum	121104
12110408	ពុទ្រា	Putrea	121104
12110409	ជ្រេស	Chres	121104
12110410	ខ្មែរលើ	Khmer Leu	121104
12110411	គោករកា	Kouk Roka	121104
12110412	ធ្លក	Thlok	121104
12110413	ជំរៅ	Chumrov	121104
12110414	អណ្ដូង	Andoung	121104
12110415	ត្រពាំងសំព័រ	Trapeang Sampoar	121104
12110416	អង្គតាកូវ	Angk Ta Kov	121104
12110417	ភ្លូផ្អែម	Phlu Ph'aem	121104
12110418	ទួលសំពៅ	Tuol Sampov	121104
12110501	បួនមុខ	Buon Mukh	121105
12110502	ត្រពាំងអំពិល	Trapeang  Ampil	121105
12110503	ស្វាយឧត្ដម	Svay Otdam	121105
12110504	ថ្នល់បន្ទាយ	Thnal Banteay	121105
12110505	ត្រពាំងទទឹង	Trapeang Totueng	121105
12110506	កាន់ទ្រង់	KanTrong	121105
12110507	ត្រពាំងរនាម	Trapeang Roneam	121105
12110508	ដើមចាន់	Daeum Chan	121105
12110509	បឹងប៉ិច	Boeng Pech	121105
12110510	ឧសភា	Osphea	121105
12110511	តាគល់	Ta Kol	121105
12110512	ព្រៃស្វាយ	Prey Svay	121105
12110513	កោះរងៀង	Kaoh Rongieng	121105
12110514	ទួល	Tuol	121105
12110515	ត្នោតខ្ពស់	Tnaot Khpos	121105
12110516	បឹងខ្នំ	Boeng Khnam	121105
12110517	ចុងថ្នល់	Chong Thnal	121105
12110518	កន្លែងគល់	Kanlaeng Kol	121105
12110519	ចំបក់ធំ	Chambak Thum	121105
12110520	ត្រពាំងថ្លាន់	Trapeang Thlan	121105
12110521	ត្រពាំងស្គន់	Trapeang Skon	121105
12110522	ព្រៃស្នួល	Prey Snuol	121105
12110523	តាស្គរ	Ta Skor	121105
12110524	ទួលពន្សាំង	Tuol Ponsang	121105
12120101	ព្រែក	Preaek	121201
12120102	ដើមម៉ាក់ក្លឿ	Daeum Meakkloea	121201
12120103	ដើមអំពិល	Daeum Ampil	121201
12120201	ដើមចាន់	Deum Chan	121202
12120202	កណ្ដាល	Kandal	121202
12120203	ដើមស្លែង	Deum Slaeng	121202
12120204	ដើមចាន់១	Deum Chan I	121202
12120205	កណ្ដាល១	Kandal I	121202
12120206	ដើមស្លែង១	Deum Slaeng I	121202
12120301	តាងៅ	Ta Ngov	121203
12120302	បឹងឈូក	Boeng Chhuk	121203
12120303	ឫស្សីស្រស់	Ruessei Sras	121203
12120304	កោះនរា	Kaoh Norea	121203
12120305	តាងៅកណ្ដាល	Ta Ngov Kandal	121203
12120306	តាងៅក្រោម	Ta Ngov Kraom	121203
12120401	ជ្រោយបាសាក់	Chrouy Basak	121204
12120402	ព្រះពន្លា	Preah Ponlea	121204
12120403	ព្រែកតាពៅ	Preaek Ta Pov	121204
12120404	អូរអណ្ដូង	Ou Andoung	121204
12120405	ជ្រោយបាសាក់១	Chrouy Basak Muoy	121204
12120406	អូរអណ្ដូង១	Ou Andoung Muoy	121204
12120501	ក្ដីតាកុយ	Kdei Ta Koy	121205
12120502	វាលស្បូវ	Veal Sbov	121205
12120503	ស្វាយតាអុក	Svay Ta Ok	121205
12120504	ព្រែកជាងព្រុំ	Preaek Cheang Prum	121205
12120505	ស្វាយតាអុក ១	Svay Ta Ok 1	121205
12120601	ក្បាលជ្រោយ	Kbal Chrouy	121206
12120602	តាព្រហ្ម	Ta Prum	121206
12120603	មិត្ដភាព	Mitakpheap	121206
12120604	ទួលតាចាន់	Tuol Ta Chan	121206
12120605	ចុងព្រែក	Chong Preaek	121206
12120606	របោះអង្កាញ់	Roboah Angkanh	121206
12120607	មិត្ដភាព ១	Mitakpheap 1	121206
12120608	ចុងព្រែក ១	Chong Preaek 1	121206
12120609	របោះអង្កាញ់ ១	Roboah Angkanh 1	121206
12120701	ជ្រោយអំពិល	Chrouy Ampil	121207
12120702	យកបាត្រ	Yok Bat	121207
12120703	ព្រែកធំ	Preaek Thum	121207
12120704	ជ្រោយអំពិល ១	Chrouy Ampil 1	121207
12120705	ជ្រោយអំពិល ២	Chrouy Ampil 2	121207
12120706	យកបាត្រ ១	Yok Bat 1	121207
12120707	ព្រែកធំ ១	Preaek Thum 1	121207
12120708	ព្រែកធំ ២	Preaek Thum 2	121207
12120801	ចំពុះក្អែក	Champuh K'aek	121208
12120802	កោះក្របី	Kaoh Krabei	121208
12120803	ព្រែកថ្មី	Preaek Thmei	121208
12120804	ចំពុះក្អែក ១	Champuh K'aek 1	121208
12120805	កោះក្របី ១	Kaoh Krabei 1	121208
12120806	ព្រែកថ្មី ១	Preaek Thmei 1	121208
13010101	ស្អាង	S'ang	130101
13010102	ទឹកលិច	Tuek Lich	130101
13010103	គោក	Kouk	130101
13010201	តស៊ូ	Tasu	130102
13010202	ថ្មី	Thmei	130102
13010203	សំរោង	Samraong	130102
13010301	ខ្យង	Khyang	130103
13010302	ម៉ឺនរាជ	Meun Reach	130103
13010303	ស្លែង	Slaeng	130103
13010401	បដិវត្ដន៍	Pakdevoat	130104
13010402	ច្រាច់	Chrach	130104
13010403	ចំរើន	Chamraeun	130104
13010404	ផ្លោច	Phlaoch	130104
13010405	ប្រមូលផ្ដុំ	Pramoul Phdom	130104
13010406	ដំណាក់ត្រាច	Damnak Trach	130104
13010501	ធ្មា	Thmea	130105
13010502	ស្រែវាល	Srae Veal	130105
13010503	ភ្ញាក់រលឹក	Phneak Roluek	130105
13010601	កំពង់ពុទ្រា	Kampong Putrea	130106
13010602	ពើក	Peuk	130106
13010603	វាលបរ	Veal Bar	130106
13020101	ឆែបលិច	Chhaeb Lech	130201
13020102	ឆែបកើត	Chhaeb Kaeut	130201
13020103	ក្រសាំង	Krasang	130201
13020201	គុណភាពមួយ	Kunakpheap Muoy	130202
13020202	គុណភាពពីរ	Kunakpheap Pir	130202
13020203	ណារ៉ុង	Narong	130202
13020204	ដងផ្លិត	Dang Phlet	130202
13020301	សង្កែ	Sangkae	130203
13020302	សាអែម	Sra'aem	130203
13020401	កោឡោត	Kalaot	130204
13020402	សម្បូរ	Sambour	130204
13020403	ជោគជ័យ	Chouk Chey	130204
13020501	ម្លូព្រៃ	Mlu Prey	130205
13020502	តុល	Tul	130205
13020503	ពោធិទាប	Pou Teab	130205
13020601	បុះ	Boh	130206
13020602	ប្រើសក្អក	Praeus K'ak	130206
13020701	កំពង់ស្រឡៅ	Kampong Sralau	130207
13020702	កំពង់ពោធិ	Kampong Pou	130207
13020703	កំពង់សង្កែ	Kampong Sangkae	130207
13020704	ខំាកឺត	Kham  Keut	130207
13020705	សួង	Suong	130207
13020801	កំពង់ជ្រៃ	Kampong Chrey	130208
13020802	កំពង់ក្រសាំង	Kampong Krasang	130208
13020803	កំពង់សាមី	Kampong Sami	130208
13020804	កំពង់ព្រះឥន្ទ	Kampong Preah Ent	130208
13030101	ជាំក្សាន្ដ	Choam Ksant	130301
13030102	គោកស្រឡៅ	Kouk Sralau	130301
13030104	វាលពោធិ៍	Veal Pou	130301
13030105	វាលធំ	Veal Thum	130301
13030106	ត្រពាំងសង្កែខាងកើត	Trapaeng Sangkae Khang Kaeut	130301
13030107	ឈើទាលគង	Chheu Teal Kong	130301
13030108	អានសេះ	An Ses	130301
13030201	ទឹកក្រហម	Tuek Kraham	130302
13030202	ចាត់តាំង	Chat Tang	130302
13030203	សង្គមថ្មី	Sangkom Thmei	130302
13030204	ត្រពាំងធំ	Trapeang Thum	130302
13030205	អូរក្សាន្ដ	Ou Khsan	130302
13030209	សែនរុងរឿង១	Sen Rung Roeung 1	130302
13030213	សែនរុងរឿង៥	Sen Rung Roeung 5	130302
13030301	ក្រឡាពាស	Krala Peas	130303
13030302	ត្មាតប៉ើយ	Tmat Paeuy	130303
13030401	ស្រែ	Srae	130304
13030402	គោក	Kouk	130304
13030403	រលំថ្ម	Rolum Thma	130304
13030404	ស្វាយ	Svay	130304
13030405	ត្រពាំងសង្កែខាងត្បូង	Tapeang Sangkae Khang Tboung	130304
13030406	ពាក់ស្បែក	Peak Sbaek	130304
13030407	ដំណាក់កណ្តោល	Damnak Kandol	130304
13030501	យាង	Yeang	130305
13030502	គង់យ៉ោង	Kong Yaong	130305
13030503	រស្មី	Reaksmei	130305
13030504	កំពាញ	Kampeanh	130305
13030505	ជាំអន្ទឹល	Choam Antuel	130305
13030506	ជាំស្រែ	Choam Srae	130305
13030601	កន្ទួត	Kantuot	130306
13030602	ស្រអែមខាងត្បូង	Sra aem Khang Tboung	130306
13030603	អន្លង់វែង	Anlong Veaeng	130306
13030604	ចារ្យ	Char	130306
13030612	ត្រពាំងសង្កែខាងលិច	Trapaeng Sangkae Khang Lech	130306
13030613	មរកតតេជោ	Morokot Te Chour	130306
13030614	សុខសែនជ័យ	Sok Sen Chey	130306
13030701	ធម្មជាតិសម្ដេចតេជោ ហ៊ុន សែន	Thomacheat Samdach Te Chhor Hun Sen	130307
13030702	ស្រអែមខាងជើង	Sra aem Khang Cheung	130307
13030703	សែនជ័យ	Sen Chey	130307
13030704	តេជោបុស្សស្បូវ	Te Chour Bosbov	130307
13030705	ចំបក់សែនជ័យ	Chambok Sen Chey	130307
13030706	ស្ទឹងខៀវតេជោ	Steung Kheav Te Chour	130307
13030707	បង្គោល៨	Bongkol 8	130307
13030801	របុញ	Robonh	130308
13030802	សែនតេជៈ	Sen Techas	130308
13030803	តេជោមរកត	Te Chour Morokot	130308
13030804	សែនរុងរឿង២	Sen Rung Roeung 2	130308
13030805	សែនរុងរឿង៣	Sen Rung Roeung 3	130308
13030806	សែនរុងរឿង៤	Sen Rung Roeung 4	130308
13040101	គូលែនត្បូង	Kuleaen Tboung	130401
13040102	ក្របៅ	Krabau	130401
13040201	គូលែនជើង	Kuleaen Cheung	130402
13040202	ព្យួរជ្រូក	Pyuor Chruk	130402
13040301	ថ្នល់បែក	Thnal Baek	130403
13040302	ត្រាវគៀត	Trav Kiet	130403
13040303	ពង្រ	Pongro	130403
13040304	ដាន	Dan	130403
13040305	ដំណាក់កន្ទួត	Damnak Kantuot	130403
13040401	ព្នៅ	Pnov	130404
13040402	បុះ	Bos	130404
13040403	ស្របាល	Srabal	130404
13040501	ឈូក	Chhuk	130405
13040502	ស្រឡៃ	Sralay	130405
13040503	បរិបូណ៌	Baribour	130405
13040504	ក្ដាក់	Kdak	130405
13040601	ស្រយង់ជើង	Srayang Cheung	130406
13040602	ស្រយង់ត្បូង	Srayang Tboung	130406
13040603	កោះកេរ	Kaoh Ker	130406
13040604	ម្រេច	Mrech	130406
13040605	រំចេក	Rumchek	130406
13040606	សម្បូរ	Sambour	130406
13040607	ស្នាផ្អែក	Sna Pa'ek	130406
13050101	រវៀងជើង	Rovieng Cheung	130501
13050102	ត្នោតម្លូ	Tnaot Mlu	130501
13050103	តាំងត្រក	Tang Trak	130501
13050104	បាក់ក្ដោង	Bak Kdaong	130501
13050105	បឹង	Boeng	130501
13050106	អូរ	Ou	130501
13050201	ដំណាក់ចិន	Damnak Chen	130502
13050202	តាតុង	Ta Tong	130502
13050203	ចំបក់ផ្អែម	Chambak Ph'aem	130502
13050204	ត្រពាំងឫស្សី	Trapeang Ruessei	130502
13050301	ថ្កែង	Thkaeng	130503
13050302	កំពត	Kampot	130503
13050303	សង្កែរូង	Sangkae Rung	130503
13050304	កក់ពោន	Kak Poun	130503
13050305	ចំឡង	Chamlang	130503
13050306	អន្លង់ស្វាយ	Anlong Svay	130503
13050401	ថ្នល់កែង	Thnal Kaeng	130504
13050402	រវៀងត្បូង	Rovieng Tboung	130504
13050403	បុះពៃ	Boh Pey	130504
13050404	ស្រែធំ	Srae Thum	130504
13050501	ប៉ាលហាល	Pal Hal	130505
13050502	បុះ	Boh	130505
13050503	ដូង	Doung	130505
13050601	ឈ្នួន	Chhnuon	130506
13050602	ទន្លាប់	Tonloab	130506
13050603	ឫស្សីស្រុក	Ruessei Srok	130506
13050701	កេរ្ដ	Ker	130507
13050702	ខ្នា	Khnar	130507
14030103	អន្សោង	Ansaong	140301
13050703	សំរិទ្ធិ	Samreth	130507
13050704	សំព្រៀង	Samprieng	130507
13050705	ព្រៃស្នួល	Prey Snuol	130507
13050801	ស្លែងទោល	Slaeng Toul	130508
13050802	ស្រែ	Srae	130508
13050803	បង្កន	Bangkan	130508
13050901	ដូនម៉ា	Doun Ma	130509
13050902	សំរោង	Samraong	130509
13050903	ព្រាល	Preal	130509
13050904	កក់ពោន	Kak Poun	130509
13050905	រំដោះ	Rumdaoh	130509
13050906	សន្លុងជ័យ	Sanlung Chey	130509
13050907	ពលកម្ម	Poleakkam	130509
13050908	ស្រឡៅស្រោង	Sralau Sraong	130509
13051001	ថ្នល់កោង	Thnal Kaong	130510
13051002	ស្វាយប៉ាត	Svay Pat	130510
13051003	គោកអំពិល	Kouk Ampil	130510
13051004	ឪឡឹក	Ovloek	130510
13051101	ត្រពាំងទទឹម	Trapeang Totuem	130511
13051102	អូរទ្រលោក	Ou Talaok	130511
13051103	ទួលរវៀង	Tuol Rovieng	130511
13051104	បង្កើនផល	Bangkaeun Phal	130511
13051105	ស្វាយដំណាក់ចាស់	Svay Damnak Chas	130511
13051106	ស្វាយដំណាក់ថ្មី	Svay Damnak Thmei	130511
13051201	រំចេក	Rumchek	130512
13051202	អូរពោរ	Ou Pour	130512
13051203	ជីឱក	Chi Aok	130512
13051204	ភ្នំដែក	Phnum Daek	130512
13051205	ស្រែធ្នង់	Srae Thnong	130512
13060101	ប្រធាតុ	Pratheat	130601
13060102	ត្បែង	Tbaeng	130601
13060103	ដា	Da	130601
13060104	សែនគង់	Saen Kong	130601
13060105	ស្រីស្រណោះ	Srei Sranaoh	130601
13060201	អណ្ដូងភ្លូ	Andoung Phlu	130602
13060202	ខ្នារ	Khnar	130602
13060203	ស្ទឺង	Stueng	130602
13060204	ក្ដី	Kdei	130602
13060205	បឺង	Boeng	130602
13060206	ខ្នុរ	Knor	130602
13060301	សំឡាញ	Samlanh	130603
13060302	ក្បាលខ្លា	Kbal Khla	130603
13060401	តាបស	Ta Bas	130604
13060402	ស្ដៅ	Sdau	130604
13060403	សុច	Soch	130604
13060404	ត្រពាំងធ្លក	Trapeang Thlok	130604
13060405	ត្រពាំងខ្ចែង	Trapeang  Khchaeng	130604
13060501	តាសែងកណ្ដាល	Ta Saeng Kandal	130605
13060502	តាសែងជើង	Ta Saeng Khang Cheung	130605
13060503	ត្រពាំងរាំង	Trapeang Reang	130605
13060504	ស្វាយ	Svay	130605
13060505	គោកថ្កូវ	koukThkov	130605
13060506	រលំស្លែង	Rolum Slaeng	130605
13070301	បាក់កាំ	Bak Kam	130703
13070302	សេដ្ឋកិច្ច	Sedthakkech	130703
13070303	មហាផល	Moha Phal	130703
13070401	ពោធិ៍	Pou	130704
13070402	ស្រឡៅទូង	Sralau Tung	130704
13070403	ពោធិ៍ខឿន	Pou Khoean	130704
13070404	អូរកក់	Ou Kak	130704
13070501	បុស្សធំ	Bos Thum	130705
13070502	ប្រមេរុ	Prame	130705
13070503	ស្រែព្រាង	Srae Preang	130705
13070601	អន្លង់ស្វាយ	Anlong Svay	130706
13070602	ក្រាំងដូង	Krang Doung	130706
13080101	សំរោង	Samraong	130801
13080102	ថ្មី	Thmei	130801
13080103	គោកបេង	Kouk Beng	130801
13080104	អណ្ដូងពោធិ	Andoung Pou	130801
13080105	ឡឥដ្ឋ	La Edth	130801
13080106	ដំណាក់	Damnak	130801
13080107	ស្រះឈូក	Srah Chhuk	130801
13080108	កណ្ដាល	Kandal	130801
13080109	កំពង់ចម្លង	Kampong Chamlang	130801
13080110	ទួលទំនប់	Tuol Tumnob	130801
13080201	ហ្មសែត	Ma Saet	130802
13080202	អូរខ្លែងពណ៌	Ou Khlaeng Poar	130802
13080203	ទំនប់	Tumnob	130802
13080204	ប៉ាលហាល	Pal Hal	130802
13080205	ភារកិច្ច	Peareakkech	130802
13080206	ស្ថាពរ	Sthapor	130802
13080207	សាមគ្គី	Sameakki	130802
13080208	ឯកភាព	Aekakpheap	130802
13080209	អភិវឌ្ឍន៍	Akphivoat	130802
13080210	ចំការស្រម៉ូវ	Chamkar Sramov	130802
14010101	អង្រ្កង	Angkrong	140101
14010102	ឫស្សីក្អែក	Ruessei K'aek	140101
14010103	ស្វាយតានី	Svay Ta Ni	140101
14010104	ប្រស្រែ	Prasrae	140101
14010105	តាម៉ា	Ta Ma	140101
14010106	ក្បាលដំរី	Kbal Damrei	140101
14010107	ល្ពាច	Lpeach	140101
14010108	ដីថុយ	Dei Thoy	140101
14010109	ឫស្សីជួរ	Ruessei Chuor	140101
14010110	តាជៃ	Ta Chey	140101
14010111	តាម៉ៅ	Ta Mau	140101
14010112	កណ្ដាល	Kandal	140101
14010113	បឹងព្រះ	Boeng Preah	140101
14010114	ស្នែរាន	Snae Rean	140101
14010201	មាត់ព្រៃ	Moat Prey	140102
14010202	ពោធិ៍អណ្ដោត	Pou Andaot	140102
14010203	ផ្លូវរលួស	Phlov Roluos	140102
14010204	បឹងរកា	Boeng Roka	140102
14010205	អណ្ដូង	Andoung	140102
14010206	ស្វាយសាមសិប	Svay Samseb	140102
14010207	រោងដំរី	Roung Damrei	140102
14010301	ឈើកាច់	Chheu Kach	140103
14010302	កំហែងរាជ្យ	Kamhaeng Reach	140103
14010303	ក្រោលគោ	Kraol Kou	140103
14010304	ព្រៃក្ដួច	Prey Kduoch	140103
14010305	ទ្រា	Trea	140103
14010306	ទួលខ្ពស់	Tuol Khpos	140103
14010307	ត្នោត	Tnaot	140103
14010308	កណ្ដាល	Kandal	140103
14010309	អង្កាញ់	Angkanh	140103
14010310	ត្រពាំងសាលា	Trapeang Sala	140103
14010311	ឃ្លាំង	Khleang	140103
14010312	ស្វាយប្រក្រាល	Svay Prakal	140103
14010313	បឹងប្រស្រែ	Boeng Prasrae	140103
14010314	គ្រួស	Kruos	140103
14010401	គោកសណ្ដែក	Kouk Sandaek	140104
14010402	ខ្សាច់ស	Khsach Sa	140104
14010403	ត្រើយងរ៍	Traeuy Ngor	140104
14010404	ថ្មទ្រាំង	Thma Treang	140104
14010405	ថ្មីក្រៅ	Thmei Krau	140104
14010406	តាពេជខាងជើង	Ta Pech Khang Cheung	140104
14010407	តាពេជខាងត្បូង	Ta Pech Khang Tboung	140104
14010408	រក្សជ័យ	Reaks Chey	140104
14010409	តាអ៊ួក	Ta Uok	140104
14010410	ជ្រួលធំ	Chruol Thum	140104
14010411	ជ្រួលថ្មី	Chruol Thmei	140104
14010412	ឈើត្រែង	Chheu Traeng	140104
14010501	ក្ដីដូង	Kdei Doung	140105
14010502	ពងពស់	Pong Pos	140105
14010503	ទីតាង៉ើយ	Ti Ta Ngaeuy	140105
14010504	ស្វាយខ្នី	Svay Khnei	140105
14010505	ព្រៃភ្ងាម	Prey Phngeam	140105
14010506	ជីរោង	Chi Roung	140105
14010507	រវាំងជុំ	Roveang Chum	140105
14010508	ត្រោក	Traok	140105
14010509	វល្លិយាវ	Voa Yeav	140105
14010510	ត្នោតស្វាយ	Tnaot Svay	140105
14010511	កន្ទ្រាន	Kantrean	140105
14010512	ជើងទឹក	Cheung Tuek	140105
14010601	តាគោក	Ta Kouk	140106
14010602	ត្រពាំងសិការ	Trapeang Sekar	140106
14010604	ថ្មី	Thmei	140106
14010605	ក្រាំងចិន	Krang Chen	140106
14010606	សិម្ពលី	Sempoli	140106
14010607	ត្របែក	Trabaek	140106
14010608	ធ្នង់	Thnong	140106
14010609	ព្រៃផ្ដៅ	Prey Phdau	140106
14010610	ដូនមា	Doun Mea	140106
14010611	ច្រកស្វាយ	Chrak Svay	140106
14010612	ព្រៃកន្ទ្រង់	Prey Kantrong	140106
14010613	បឹងត្របរ	Boeng Trabar	140106
14010614	ទង់នាគ	Tong Neak	140106
14010615	ត្រពាំងស្វាយ	Trapeang Svay	140106
14010701	ស្នួល	Snuol	140107
14010702	ក្រាំង	Krang	140107
14010703	ស្វាយពក	Svay Pok	140107
14010704	កាឡីខាងជើង	Kalei Khang Cheung	140107
14010705	កាឡីខាងត្បូង	Kalei Khang Tboung	140107
14010706	តាឡោន	Ta Laon	140107
14010707	ព្រេច	Prech	140107
14010708	ស្ដៅកោង	Sdau Kaong	140107
14010709	ស្ពឺខាងកើត	Spueu Khang Kaeut	140107
14010710	ស្ពឺខាងលិច	Spueu Khang Lech	140107
14010801	ព្រៃចំការ	Prey Chamkar	140108
14010802	ចាន់រ៉ា   ក	Chan Ra Ka	140108
14010803	ចាន់រ៉ា   ខ	Chan Ra Kha	140108
14010804	ព្រៃប្រង់	Prey Prang	140108
14010805	ព្រៃស្វា	Prey Sva	140108
14010806	ធ្លក	Thlok	140108
14010901	ចក	Chak	140109
14010902	ពោធិ៍ភ្លុក	Pou Phluk	140109
14010903	កំរែង	Kamraeng	140109
14010904	ល្វា	Lvea	140109
14010905	ក្រាំង	Krang	140109
14010906	ព្រៃផ្ចិត	Prey Phchet	140109
14010907	តាសូ	Ta Sou	140109
14010908	អង្កាល់	Angkal	140109
14010909	ស្នួល	Snuol	140109
14010910	កំពង់ស្នែ	Kampong Snae	140109
14010911	កំពង់ស្លែង	Kampong Slaeng	140109
14010912	ធាយ	Theay	140109
14010913	ទ័ពស្ដេច	Toap Sdach	140109
14010914	ខ្វិត	Khvet	140109
14010915	ស្ដៅ	Sdau	140109
14010916	ប្រញ៉ង	Pranhang	140109
14010917	ស្វាយកាប	Svay Kab	140109
14010918	ទីលេង	Ti Leng	140109
14020101	ទួលសង្កែទទឹង	Tuol Sangkae Totueng	140201
14020102	ទួលសង្កែបណ្ដោយ	Tuol Sangkae Bandaoy	140201
14020103	ត្រពាំងរមាស	Trapeang Romeas	140201
14020104	រហាល	Rohal	140201
14020105	កោះខ្ជាយ	Kaoh Khcheay	140201
14020106	ដូនដោក	Doun Daok	140201
14020107	ស្វាយត្រៃ	Svay Trey	140201
14020108	ជួរថ្នល់	Chuor Thnal	140201
14020109	កោះតារ័ត្ន	Kaoh Ta Roatn	140201
14020110	ជាចជួរ	Cheach Chuor	140201
14020111	ជាចខាងលិច	Cheach Khang Lech	140201
14020112	ជាចខាងជើង	Cheach Khang Cheung	140201
14020113	ជាចកណ្ដាល	Cheach Kandal	140201
14020114	ជាចខាងត្បូង	Cheach Khang Tboung	140201
14020115	ពោនខាងលិច	Poun Khang Lech	140201
14020116	ពោនខាងកើត	Poun Khang Kaeut	140201
14020117	លាក់គោ	Leak Kou	140201
14020118	សំបូរ	Sambour	140201
14020119	ពោនខាងជើង	Poun Khang Cheung	140201
14020120	ត្រាចជ្រុំ	Trach Chrum	140201
14020121	ទួលសង្កែខាងកើត	Tuol Sangkae Khang Kaeut	140201
14020122	ត្រពាំងផ្លុង	Trapeang Phlong	140201
14020123	ត្រពាំងថ្ម	Trapeang Thma	140201
14020124	ត្រពាំងធ្លក	Trapeang Thlok	140201
14020125	ត្រពាំងក្រសាំង	Trapeang Krasang	140201
14020126	ទួលអង្គ្រង	Tuol Angkrong	140201
14020201	ទន្សាយជល់ហិប	Tonsay Chol Heb	140202
14020202	ដូនកឹង	Doun Koeng	140202
14020203	គរ	Kor	140202
14020204	ពោធិ៍ពីរ	Pou Pir	140202
14020205	បឹងកក់	Boeng Kak	140202
14020206	ថ្មី	Thmei	140202
14020207	ជួរផ្អាវ	Chuor Ph'av	140202
14020208	ត្រពាំងដង្ហិត	Trapeang Danghet	140202
14020209	ស្វាយសុខុម	Svay Sokhom	140202
14020210	តាដុក	Ta Dok	140202
14020301	ជោរទី ១	Chour Ti Muoy	140203
14020302	ជោរទី ២	Chour Ti Pir	140203
14020303	ជោរទី ៣	Chour Ti Bei	140203
14020304	តាសៅ	Ta Sau	140203
14020305	ក្រវ៉ាន់	Kravan	140203
14020306	ពង្រ	Pongro	140203
14020307	ខ្លុងកោង	Khlong Kaong	140203
14020308	ចំការចេកទី ២	Chamkar Chek Ti Pir	140203
14020309	ចំការចេកទី ១	Chamkar Chek Ti Muoy	140203
14020310	សាមគ្គី	Sameakki	140203
14020311	អង្គ្រងទី ១	Angkrong Ti Muoy	140203
14020312	អង្គ្រងទី ២	Angkrong Ti Pir	140203
14020313	កំចាយមារខាងត្បូង	Kamchay Mear Khang Tboung	140203
14020314	កំចាយមារខាងជើង	Kamchay Mear Khang Cheung	140203
14020315	ស្នួល	Snuol	140203
14020316	ឡឥដ្ឋ	La Edth	140203
14020317	ថ្លុកកណ្តាល	Thlok Kandal	140203
14020318	កណ្ដាល	Kandal	140203
14020319	បឹងព្រោះ	Boeng Pruoh	140203
14020401	តាអី	Ta Ei	140204
14020402	ព្រៃត្រេស	Prey Tres	140204
14020403	ពពេល	Popel	140204
14020404	ក្របៅជួរ	Krabau Chuor	140204
14020405	អណ្ដូងស្អាត	Andoung S'at	140204
14020406	កន្លែងជ្រៅ	Kanlaeng Chrov	140204
14020407	ត្បូងវត្ដ	Tboung Voat	140204
14020408	វាលស្មាច់	Veal Smach	140204
14020409	ពោធិ៍	Pou	140204
14020410	អញ្ចាញ	Anhchanh	140204
14020411	ព្រៃទួលថ្មី	Prey Tuol Thmei	140204
14020501	ឫស្សីជុកទី ១	Ruessei Chuk Ti Muoy	140205
14020502	ឫស្សីជុកទី ២	Ruessei Chuk Ti Pir	140205
14020503	ទួលសុភី	Tuol Sophi	140205
14020504	ត្នោត	Tnaot	140205
14020505	លាក់នឹម	Leak Nuem	140205
14020506	ឧបមា	Opakma	140205
14020507	បុស្ស	Bos	140205
14020508	ល្វា	Lvea	140205
14020509	សង្កែ	Sangkae	140205
14020510	បាយ៉ាប	Bayab	140205
14020511	ចុងបឹង	Chong Boeng	140205
14020512	គ្រួស	Kruos	140205
14020513	ឈូក	Chhuk	140205
14020601	ថ្នល់កែង	Thnal Kaeng	140206
14020602	ទានភ្លើង	Tean Phleung	140206
14020603	ព្រៃស្ទរ	Prey Stor	140206
14020604	ស្មោង	Smaong	140206
14020605	ប្រមូលដុំ	Pramoul Dom	140206
14020606	តាកែវ	Ta Kaev	140206
14020607	បើកទូក	Baeuk Tuk	140206
14020608	គោកសុក្រំ	Kouk Sokram	140206
14020609	គោកព្រាល	Kouk Preal	140206
14020610	ព្រៃលំពែង	Prey Lumpeaeng	140206
14020611	ធ្នង់ខាងកើត	Thnong Khang Kaeut	140206
14020612	ធ្នង់ខាងលិច	Thnonh Khang Lech	140206
14020613	ត្រពាំងស្គន់	Trapeang Skon	140206
14020614	ពោន	Poun	140206
14020615	ល្អក់	L'ak	140206
14020616	តាម៉ិញ	Ta Menh	140206
14020617	ទួលក្រឡាញ់	Toul Kralanh	140206
14020701	ស្រឡូងស្រឡី	Sraloung Sralei	140207
14020702	កូនឫស្សី	Koun Ruessei	140207
14020703	ព្រហ៊ារ	Prahear	140207
14020704	ជំពូ	Chumpu	140207
14020705	ព្រៃភ្លង	Prey Phlorng	140207
14020706	ព្រៃចំការ	Prey Chamkar	140207
14020707	ឆ្មាលោត	Chhma Lout	140207
14020708	ព្រៃខ្លូត	Prey Khlout	140207
14020709	គង់	Kong	140207
14020710	គំនុំ	Kumnum	140207
14020711	វាល	Veal	140207
14020712	អូរកន្ទុយ	Ou Kantuy	140207
14020713	ប្រឹក្សាទី១	Proeksa Ti Muoy	140207
14030902	ចំបក់	Chambak	140309
14020714	ប្រឹក្សាទី​២	Proeksa Ti Pir	140207
14020715	រំដួល	Rumduol	140207
14020716	ព្រៃស្លឹក	Prey Sloek	140207
14020717	ព្រៃធំ	Prey Thum	140207
14020718	បឹងពោធិ៍	Boeng Pou	140207
14020719	អង្គជា	Angk Chea	140207
14020720	ដំណាក់សេរី	Damnak Serei	140207
14020801	ច្រេសលិច	Chres Lech	140208
14020802	ច្រេសកណ្ដាល	Chres Kandal	140208
14020803	ច្រេសខាងកើត	Chres Khang Kaeut	140208
14020804	ត្រពាំងកំពឹស	Trapeang Kampoes	140208
14020805	អូរ	Ou	140208
14020806	ទួលតាមាក់	Tuol Ta Meak	140208
14020807	ត្រពាំងប្រីយ៍	Trapeang Prei	140208
14020808	ចំបក់កោង	Chambak Kaong	140208
14020809	ត្រពាំងព្រិច	Trapeang Prich	140208
14020810	ត្រពាំងឈូក	Trapeang Chhuk	140208
14020811	ដូនដៀវ	Doun Diev	140208
14020812	ត្រឡាចស	Tralach Sa	140208
14020813	ព្រៃត្បែង	Prey Tbaeng	140208
14030101	គ្រើល	Kreul	140301
14030102	អង្វះមួយរយ	Angveah Muoy Roy	140301
14030104	តាពូង	Ta Pung	140301
14030105	សំបួរ	Sambuor	140301
14030106	តាអោង	Ta Aong	140301
14030107	បន្ទាបុស្ស	Bantea Bos	140301
14030108	ត្រពាំងរកា	Trapeang Roka	140301
14030201	រោង	Roung	140302
14030202	ចាម	Cham	140302
14030203	កាធំ	Ka Thum	140302
14030204	ប្រស្ដេច	Prasdach	140302
14030205	ព្រៃកន្សា	Prey Kansa	140302
14030206	ពេជ្ជីរតន៍	Pechi Roatn	140302
14030207	វាល	Veal	140302
14030208	រលួស	Roluos	140302
14030209	ជីពាយ	Chipeay	140302
14030210	ក្រាំលាវ	Kram Leav	140302
14030301	បឹងក្រនឹប	Boeng Kranueb	140303
14030302	តាមាស	Ta Meas	140303
14030303	ជាងដែក	Cheang Daek	140303
14030304	ពញាកើត	Ponhea Kaeut	140303
14030305	ក្រូច	Krouch	140303
14030306	ព្រៃម្លុង	Prey Mlung	140303
14030307	អង្គ	Angk	140303
14030308	ក្រាំងវែង	Krang Veaeng	140303
14030309	អង្គ្រង	Angkrong	140303
14030310	ឧកញ៉ាសឹង	Oknha Soeng	140303
14030311	ថ្នឹង	Thnoeng	140303
14030312	តាបុល	Ta Bol	140303
14030401	ត្រោក	Traok	140304
14030402	ពៅ្ន	Pnov	140304
14030403	ត្រពាំងរេ	Trapeang Re	140304
14030404	ដក់ពរ	Dak Por	140304
14030405	ជ្រៃ	Chrey	140304
14030406	ចំបក់	Chambak	140304
14030407	ដូង	Doung	140304
14030408	សំរោង	Samraong	140304
14030409	ស្វាយប៉ាក	Svay Pak	140304
14030501	កន្សោមអក	Kansaom Ak	140305
14030502	បល្ល័ង្គ	Ballangk	140305
14030503	ជ្រួល	Chruol	140305
14030504	តាទាំង	Ta Teang	140305
14030505	ត្រពាំងរុន	Trapeang Run	140305
14030506	ព្រៃអណ្ដូង	Prey Andoung	140305
14030507	ព្រៃខ្មៅ	Prey Khmau	140305
14030508	ក្រូច	Krouch	140305
14030509	ទ័ពសៀម	Toap Siem	140305
14030601	គោខ្ចក	Kou Khchak	140306
14030602	ព្រៃធំ	Prey Thum	140306
14030603	គោក្រោក	Kou Kraok	140306
14030604	ស្គា	Skea	140306
14030605	ព្រៃគុយ	Prey Kuy	140306
14030606	ហប់	Hab	140306
14030607	ចំរ៉េះ	Chamreh	140306
14030608	ត្រពាំងត្រាវ	Trapeang Trav	140306
14030609	រមាសឈរ	Romeas Chhor	140306
14030610	ក្រោល	Kraol	140306
14030611	ព្រៃស្នួល	Prey Snuol	140306
14030612	ត្រាវ	Trav	140306
14030701	ទួលរកា	Tuol Roka	140307
14030702	ខ្មែរឥស្លាម	Khmer Eslam	140307
14030703	ព្រែកផ្ដៅ	Preaek Phdau	140307
14030704	អន្លង់ចក	Anlong Chak	140307
14030705	រកាធំ	Roka Thum	140307
14030706	កំពង់ស្វាយខាងកើត	Kampong Svay Khang Kaeut	140307
14030707	កំពង់ស្វាយខាងលិច	Kampong Svay Khang Lech	140307
14030708	កំពង់ត្របែក	Kampong Trabaek	140307
14030709	អន្លង់រាជ្យ	Anlong Reach	140307
14030710	បឹងខ្យង	Boeng Khyang	140307
14030801	អង្គរអង្គ	Angkor Angk	140308
14030802	ពាមមន្ទារ	Peam Montear	140308
14030803	សិតក្រមួន	Set Kramuon	140308
14030804	ចំណងទាក	Chamnang Teak	140308
14030805	ក្រចាប់ក្រោម	Krachab Kraom	140308
14030806	ក្រចាប់លើ	Krachab Leu	140308
14030807	សហករណ៍	Sakhakkar	140308
14030808	តាកែវ	Ta Kaev	140308
14030809	ដង្កៀបក្ដាម	Dangkieb Kdam	140308
14030810	ព្រែកតា	Preaek Ta	140308
14030811	ខ្លំ	Khlam	140308
14030901	ប្រាសាទ	Prasat	140309
14030903	អំពិល	Ampil	140309
14030904	ពាន់វត្ដ	Poan Voat	140309
14030905	ជ្រលង	Chrolong	140309
14030906	ដូងទុង	Doung Tung	140309
14030907	បី	Bei	140309
14030908	ភ្លង	Phlorng	140309
14030909	ថ្កូវ	Thkov	140309
14031001	ឈើទាល	Chheu Teal	140310
14031002	រលួស	Roluos	140310
14031003	ឆ្វាង	Chhvang	140310
14031004	ត្រោក	Traok	140310
14031005	ត្រម៉ុត	Tramot	140310
14031006	ពោធិ៍	Pou	140310
14031007	អង្កាញ់	Angkanh	140310
14031008	ប្រធាតុ	Pratheat	140310
14031009	ព្រៃញាតិ	Prey Nheat	140310
14031101	ព្រៃតានេន	Prey Ta Nen	140311
14031102	ដូង	Doung	140311
14031103	ត្បែង	Tbaeng	140311
14031104	ពៅ្ន	Pnov	140311
14031105	អាគ្រាជ	A Kreach	140311
14031106	ព្រៃដំរី	Prey Damrei	140311
14031107	ព្រៃម្នាស់់	Prey Mnoas	140311
14031108	ស្វាយចេក	Svay Chek	140311
14031201	ជីពាយ	Chi Peay	140312
14031202	ជីអក	Chi Ak	140312
14031203	ព្រៃសំរោង	Prey Samraong	140312
14031204	បេង	Beng	140312
14031205	ព្រៃក្រាំង	Prey Krang	140312
14031206	ព្រៃពោន	Prey Poun	140312
14031207	តាប្រុយ	Ta Proy	140312
14031208	ត្រពាំងក្រសាំង	Trapeang Krasang	140312
14031301	តាហ៊	Ta Ho	140313
14031302	ធំ	Thum	140313
14031303	ពោធិវង្ស	Pouthi Vongs	140313
14031304	ពោធិ៍	Pou	140313
14031305	ត្បែង	Tbaeng	140313
14031306	ឫស្សី	Ruessei	140313
14031307	តាមួង	Ta Muong	140313
14040101	មានជ័យ	Mean Chey	140401
14040102	ព្រៃត្បាល់	Prey Tbal	140401
14040103	កណ្ដាច់	Kandach	140401
14040104	ចុងអំពិល	Chong Ampil	140401
14040105	ចំបក់	Chambak	140401
14040106	ព្រៃស្វាយ	Prey Svay	140401
14040107	ពារោង	Pea Roung	140401
14040201	ប្រស្រែលិច	Prasrae Lech	140402
14040202	ប្រស្រែមុខ	Prasrae Mukh	140402
14040203	ជើងទឹក	Cheung Tuek	140402
14040204	ព្រៃផ្ដៅ	Prey Phdau	140402
14040205	ធម្មកេរ្ដិ៍	Thommeak Ker	140402
14040206	ឆ្អឹងជំនីរ	Chh'oeng Chumnir	140402
14040207	អូរតាថុក	Ou Ta Thok	140402
14040208	កញ្ជ្រៀច	Kanhchriech	140402
14040209	ព្រៃភូមិ	Prey Phum	140402
14040210	ពោធិ៍ទង	Pou Tong	140402
14040211	ពោធិ៍ម្រិញ	Pou Mrenh	140402
14040301	ដូនវាល	Doun Veal	140403
14040302	ក្ដឿងរាយ	Kdoeang Reay	140403
14040303	ចារជ្រុំ	Char Chrum	140403
14040304	ក្រូច	Krouch	140403
14040305	គ្រួស	Kruos	140403
14040306	ពោធិ៍ធំ	Pou Thum	140403
14040307	ពោធិ៍តូច	Pou Touch	140403
14040308	តាណាល	Ta Nal	140403
14040309	សំរោង	Samraong	140403
14040310	ល្ងើន	Lngeun	140403
14040311	សាឡូង	Saloung	140403
14040312	ពានាផ្សារ	Peanea Phsar	140403
14040313	ពានាកណ្ដាល	Peanea Kandal	140403
14040314	ពានាជួរ	Peanea Chuor	140403
14040315	អំព្នាំង	Ampeang	140403
14040316	ត្រោក	Traok	140403
14040317	បឹងអញ្ចាញ	Boeng Anhchanh	140403
14040401	ថ្មទឹកដាច់	Thma Tuek Dach	140404
14040402	គោកក្រសាំង	Kouk Krasang	140404
14040403	ត្រពាំងស្វាយ	Trapeang Svay	140404
14040404	បុស្សត្នោត	Bos Tnaot	140404
14040405	បែកក្អម	Baek K'am	140404
14040406	ឫស្សីទន្លេ	Ruessei Tonle	140404
14040407	សេរីចរចារ	Serei Charchar	140404
14040408	ជ្រៃម្រាក់	Chrey Mreak	140404
14040409	ទុកស្រូវ	Tuk Srov	140404
14040410	ស្រះស្រង់	Srah Srang	140404
14040411	ត្រពាំងអំពិល	Trapeang Ampil	140404
14040412	ជ័យមុនី	Chey Muni	140404
14040501	អ្នកតាជ័យ	Neak Ta Chey	140405
14040502	ដំណាក់ស្នួល	Damnak Snuol	140405
14040503	ត្រពាំងឫស្សី	Trapeang Ruessei	140405
14040504	ត្រពាំងប្រស្រែលិច	Trapeang Prasrae Lech	140405
14040505	ត្រពាំងប្រស្រែកើត	Trapeang Prasrae Kaeut	140405
14040506	ត្រពាំងពី	Trapeang Pir	140405
14040507	ព្រៃចេក	Prey Chek	140405
14040508	ខ្ទមលាវ	Khtom Leav	140405
14040509	ស្វាយចេក	Svay Chek	140405
14040510	គោកគង់កើត	Kouk Kong Kaeut	140405
14040511	គោកគង់លិច	Kouk Kong Lech	140405
14040512	គោកគង់កណ្ដាល	Kouk Kong Kandal	140405
14040513	គោកគង់ត្បូង	Kouk Kong Tboung	140405
14040514	ស្វាយរុន	Svay Run	140405
14040515	ទួលពពេល	Tuol Popel	140405
14040516	រកាទ្រេត	Roka Tret	140405
14040517	ស្វាយទោល	Svay Toul	140405
14040601	ត្រពាំងទឹម	Trapeang Tuem	140406
14040602	ត្រពាំងសេះ	Trapeang Seh	140406
14040603	ពោធិ៍ថ្មី	Pou Thmei	140406
14040604	អណ្ដូងសាលា	Andoung Sala	140406
14040605	ត្រពាំងថ្លាន់ត្បូង	Trapeang Thlan Tboung	140406
14040606	ត្រពាំងថ្លាន់ជើង	Trapeang Thlan Cheung	140406
14040607	ថ្មី	Thmei	140406
14040608	ទួលត្នោត	Tuol Tnaot	140406
14040609	គោករកា	Kouk Roka	140406
14040610	ព្រៃតាព្រុំ	Prey Ta Prum	140406
14040611	ត្រពាំងក្រាញ់	Trapeang Kranh	140406
14040612	ល្ហើយ	Lhaeuy	140406
14040613	ពោធិព្រឹក្សា	Pouthi Proeksa	140406
14040614	ទួលត្រាច	Tuol Trach	140406
14040615	ត្រពាំងកកោះ	Trapeang Kakaoh	140406
14040616	ស្វាយ	Svay	140406
14040701	ឆ្ពឹស	Chhpoes	140407
14040702	ព្រាលទី២	Preal Ti Pir	140407
14040703	ព្រាលទី១	Preal Ti Muoy	140407
14040704	បេង	Beng	140407
14040705	ព្រះឥន្ទស្មត់	Preah Ent Smat	140407
14040706	ថ្មពូន	Thma Pun	140407
14040707	ក្បាលដំរី	Kbal Damrei	140407
14040708	ព្រៃចារ	Prey Char	140407
14040709	ព្រងើយទី១	Prongeuy Ti Muoy	140407
14040710	តាប៉ោង	Ta Paong	140407
14040711	ព្រងើយទី២	Prongeuy Ti Pir	140407
14040801	ត្នោត	Tnaot	140408
14040802	ក្រឡាមាឃ	Krala Meakh	140408
14040803	ជម្ពូវ័ន្ដ	Chumpu Voan	140408
14040804	គក	Kok	140408
14040805	តារាជ	Ta Reach	140408
14040806	ថ្នល់បែក	Thnal Baek	140408
14040807	ខ្នាយកូវ	Khnay Kov	140408
14040808	ស្វាយចេក	Svay Chek	140408
14050101	ស្រះតាអឹម	Srah Ta Oem	140501
14050102	គោកច្រេស	Kouk Chres	140501
14050103	សូរ	Sour	140501
14050104	ពន្លៃ	Ponley	140501
14050105	អង្គរសរ	Angkor Sar	140501
14050106	សំបូរ	Sambour	140501
14050107	ត្រពាំងធំ	Trapeang Thum	140501
14050108	អង្គ្រង	Angkrong	140501
14050109	អង្គ	Angk	140501
14050201	អង្គព្រះ	Angk Preah	140502
14050202	អណ្ដូងត្រាច	Andoung Trach	140502
14050203	ចំបក់ជ្រុំ	Chambak Chrum	140502
14050204	ត្រពាំងស្គន់	Trapeang Skon	140502
14050205	អណ្ដូងតាស្រែន	Andoung Ta Sraen	140502
14050206	ច្រេស	Chres	140502
14050207	ក្រសាំងលៃ	Krasang Ley	140502
14050208	ព្រេច	Prech	140502
14050209	ទ័ពស្ដេច	Toap Sdach	140502
14050210	ចន្ទ័គ្រឹស្នា	Chant Kruesna	140502
14050211	ព្រហ៊ារ	Prohear	140502
14050212	បឹង	Boeng	140502
14050213	មានជ័យ	Mean Chey	140502
14050214	បឹងអន្ទង់	Boeng Antong	140502
14050215	ពោន	Poun	140502
14050216	ទួលតារី	Tuol Ta Ri	140502
14050217	ព្រៃសង្គម	Prey Sangkum	140502
14050218	ព្រៃរកា	Prey Roka	140502
14050219	ត្រោក	Traok	140502
14050301	ត្រពាំងស្គន់	Trapeang Skon	140503
14050302	ពោធិ៍ពាត់	Pou Poat	140503
14050303	ស្នាយបុណ្យ	Snay Bon	140503
14050304	ត្រោក	Traok	140503
14050305	ជីផុច	Chi Phoch	140503
14050306	ពោធិ៍រោង	Pou Roung	140503
14050307	ក្រសាំង	Krasang	140503
14050308	ថ្មស	Thma Sa	140503
14050309	ព្រៃត្រខុប	Prey Trakhob	140503
14050310	សំរោងវាល	Samraong Veal	140503
14050311	សំរោងវត្ដ	Samraong Voat	140503
14050312	ឫស្សីសាញ់	Ruessei Sanh	140503
14050313	វាំង	Veang	140503
14050314	ស្វាយអណ្ដូង	Svay Andoung	140503
14050315	យាងតូច	Yeang Touch	140503
14050316	យាងធំ	Yeang Thum	140503
14050317	ថ្មី	Thmei	140503
14050318	ក្រសាំងកន្ទ្រែ	Krasang Kantrae	140503
14050401	ពោធិ៍ស្នាយ	Pou Snay	140504
14050402	ត្រពាំងផ្លុង	Trapeang Phlong	140504
14050403	ឫស្សីស្បាត	Ruessei Sbat	140504
14050404	ត្រពាំងព្រះទី១	Trapeang Preah Ti Muoy	140504
14050405	ត្រពាំងព្រះទី២	Trapeang Preah Ti Pir	140504
14050406	តាម៉ៅ	Ta Mau	140504
14050407	សន្លូងលៀប	Sanloung Lieb	140504
14050408	អូរសង្កែ	Ou Sangkae	140504
14050409	ស្វាយជោ	Svay Chou	140504
14050410	ឫស្សីទា្វរ	Ruessei Tvear	140504
14050411	ព្រៃឃ្នេស  ក	Prey Khnes Ka	140504
14050412	ព្រៃឃ្នេស ខ	Prey Khnes Kha	140504
14050413	គ្រួស	Kruos	140504
14050414	សំបួរ	Sambuor	140504
14050415	ឫស្សីចចក	Ruessei Chachak	140504
14050416	សន្លុង	Sanlung	140504
14050417	ពៅ្ន	Pnov	140504
14050418	បារាជ	Ba Reach	140504
14050419	ថ្មី	Thmei	140504
14050420	របស់ផ្ចឹក	Robas Phchoek	140504
14050421	ស្លា	Sla	140504
14050422	កែវស្នា	Kaev Sna	140504
14050501	មេសាង	Me Sang	140505
14050502	ចារ	Char	140505
14050503	គ្រើល	Kreul	140505
14050504	កណ្ដាល	Kandal	140505
14050505	ព្រៃចេក	Prey Chek	140505
14050506	ព្រៃរំដេង	Prey Rumdeng	140505
14050507	ពងទឹក	Pong Tuek	140505
14050508	ព្រៃខ្នុរ	Prey Khnor	140505
14050601	ព្រៃអំពៅ	Prey Ampov	140506
14050602	ត្បែង	Tbaeng	140506
14050603	ព្នៅ	Pnov	140506
14050604	ព្រៃមូល	Prey Mul	140506
14050605	បឹង	Boeng	140506
14050606	អំពិលទោល	Ampil Toul	140506
14050607	សំព័រ	Sampoar	140506
14050608	ព្រៃជ្រុំ	Prey Chrum	140506
14050609	ព្រៃទទឹង	Prey Totueng	140506
14050610	ត្រពាំងក្ដាម	Trapeang Kdam	140506
14050611	អង្គក្អោត	Angk K'aot	140506
14050612	ផ្អាវ	Ph'av	140506
14050701	ព្រៃព្រះអណ្ដូង	Prey Preah Andoung	140507
14050702	ថ្នល់កែង	Thnal Kaeng	140507
14050703	សាវាំង	Sa Veang	140507
14050704	អង្គាសដី	Angkeas Dei	140507
14050705	ស្វាយទាប	Svay Teab	140507
14050706	ស្វាយទង	Svay Tong	140507
14050707	ស្វាយជ្រុំ	Svay Chrum	140507
14050708	ទ្រា	Trea	140507
14050709	ពោធិ៍តាមុំ	Pou Ta Mom	140507
14050710	ព្រៃចំការខាងត្បូង	Prey Chamkar Khang Tboung	140507
14050711	ព្រៃចំការខាងជើង	Prey Chamkar Khang Cheung	140507
14050712	ក្បាលខ្វែក	Kbal Khvaek	140507
14050713	ចុងទួល	Chong Tuol	140507
14050714	ស្រែរាន	Srae Rean	140507
14050715	ថ្មី	Thmei	140507
14050716	បឹងអន្ទង់	Boeng Antong	140507
14050717	ស្វាយឧត្ដម	Svay Otdam	140507
14050718	ភ្នៀត	Phniet	140507
14050801	ស្រម៉	Srama	140508
14050802	ប្រហ៊ូត	Brohut	140508
14050803	ប្រស្វា	Brasva	140508
14050804	ស្វាយរកៈ	Svay Rokeah	140508
14050805	ត្រពាំងស្រែ	Trapeang Srae	140508
14050806	ចេកធ្លក	Chek Thlok	140508
14050807	ត្បែង	Tbaeng	140508
14050808	ត្រគៀត	Trakiet	140508
14050809	ម៉ឺនពាន់	Meun Poan	140508
14050810	ផ្លាំង	Phlang	140508
14050811	ព្រៃគុយ	Prey Kuy	140508
14050812	ម្រេញ	Mrenh	140508
14060101	អង្គរអង្គ	Angkor Angk	140601
14060102	ព្រែកត្រែង	Preaek Traeng	140601
14060103	វាលរបងក្រោម	Veal Robang Kraom	140601
14060104	វាលរបងលើ	Veal Robang Leu	140601
14060201	តាហ៊ុយ	Ta Huy	140602
14060202	តាប៉ើ	Ta Paeu	140602
14060203	ក្រាំងក្រូច	Krang Krouch	140602
14060204	ទឹកវិល	Tuek Vil	140602
14060205	កំពង់ប្រាសាទ	Kampong Prasat	140602
14060301	មានជ័យ	Mean Chey	140603
14060302	កោះចេក	Kaoh Chek	140603
14060303	កោះពាមរាំង	Kaoh Peam Reang	140603
14060304	ស្ពាន	Spean	140603
14060401	ស្វាយជ្រុំ	Svay Chrum	140604
14060402	ដីស្រុត	Dei Srot	140604
14060403	ជ្រៃថ្មី	Chrey Thmei	140604
14060404	កោះរកា	Kaoh Roka	140604
14060501	ពោធិ៍ថ្មី	Pou Thmei	140605
14060502	អំពៅព្រៃ	Ampov Prey	140605
14060503	ស្វាយអណ្ដូង	Svay Andoung	140605
14060504	ទួលសាំង	Tuol Sang	140605
14060505	ខ្សាច់	Khsach	140605
14060601	ជ្រៃឧត្ដម	Chrey Otdam	140606
14060602	ក្រាំងចិន	Krang Chen	140606
14060603	ក្រាំងព្រៃផ្ដៅ	Krang Prey Phdau	140606
14060604	ក្រាំងតាយ៉ង	Krang Ta Yang	140606
14060605	ក្រាំងស្ករ	Krang Skar	140606
14060606	ព្រីង	Pring	140606
14060607	ពងទឹក	Pong Tuek	140606
14060608	រកាដុះ	Roka Doh	140606
14060701	ឧត្ដម	Otdam	140607
14060702	ឧត្ដុង្គ	Otdong	140607
14060703	ព្រែកក្របៅ	Preaek Krabau	140607
14060801	ខ្ពប	Khpob	140608
14060802	សំបួរ	Sambuor	140608
14060803	ព្រែកជ្រៅ	Preaek Chrov	140608
14060901	ពែន	Peaen	140609
14060902	តាសូ	Ta Sou	140609
14060903	តាពូង	Ta Pung	140609
14060904	ឫស្សីស្រុក	Ruessei Srok	140609
14060905	ឥដ្ឋ	Edth	140609
14060906	ឈើទាល	Chheu Teal	140609
14060907	ស្វាយចេក	Svay Chek	140609
14060908	ព្រៃមាន់	Prey Moan	140609
14060909	បឹងអក្សរ	Boeng Aksar	140609
14060910	ពោធិ៍ខ្ពស់	Pou Khpos	140609
14060911	ក្រាំងពោន	Krang Poun	140609
14061001	សង្គ្រោះ	Sangkruoh	140610
14061002	សាមគ្គី	Sameakki	140610
14061003	បង្អែក	Bang'aek	140610
14070101	ពន្លៃ	Ponley	140701
14070102	ដូង	Doung	140701
14070103	ជោគជ័យ	Chouk Chey	140701
14070104	បាបោង	Ba Baong	140701
14070201	ប្រាសាទលិច	Prasat Lech	140702
14070202	ប្រាសាទជើង	Prasat Cheung	140702
14070203	ប្រាសាទកើត	Prasat Kaeut	140702
14070204	ព្រែកចាម	Preaek Cham	140702
14070205	ព្រែករាំង	Preaek Reang	140702
14070206	ដឹកដា	Doek Da	140702
14070301	អ្នកលឿង	Neak Loeang	140703
14070302	ព្រែកតាសរ	Preaek Ta Sar	140703
14070303	ព្រែកធំ	Preaek Thum	140703
14070304	ស្ទឹងស្លូត	Stueng Slout	140703
14070305	ស្ទឹងសន្ដិភាព	Stueng Santepheap	140703
14070401	ថ្មី	Thmei	140704
14070402	បឹងក្អែក	Boeng K'aek	140704
14070403	បឹងផ្សោត	Boeng Phsaot	140704
14070404	ចំការវែង	Chamkar Veaeng	140704
14070405	បន្លេច	Banlech	140704
14070501	ពាមកោះ	Peam Kaoh	140705
14070502	ថ្កូវ	Thkov	140705
14070503	បាទី	Bati	140705
14070504	ចំបក់ប្រាំង	Chambak Prang	140705
14070505	ចាក់ខ្លាញ់	Chak Khlanh	140705
14070601	ព្រែកខ្សាយ	Preaek Khsay	140706
14070602	ឧត្ដម	Otdam	140706
14070603	ជ័យឧត្តម	Chey Oudom	140706
14070604	ជ័យឧត្តមបឹងខ្ទុម	Chey Oudom Boeung Ktom	140706
14070605	ព្រែកខ្សាយខាងជើង	Preaek Khsay Khang Choeung	140706
14070701	ភូមិ ១	Phum Muoy	140707
14070702	ភូមិ ២	Phum Pir	140707
14070703	ភូមិ ៣	Phum Bei	140707
14070704	ភូមិ ៤	Phum Buon	140707
14070705	ភូមិ ៥	Phum Pram	140707
14070706	ភូមិ ៦	Phum Prammuoy	140707
14070801	ព្រៃកណ្ដៀង	Prey Kandieng	140708
14070802	ព្រៃខ្លា	Prey Khla	140708
14070803	ព្រៃអង្គុញ	Prey Angkunh	140708
14070804	ព្រៃកំពែង	Prey Kampeaeng	140708
14070805	ចាន់	Chan	140708
14070806	ស្ដៅ	Sdau	140708
14070807	ពន្លៃ	Ponley	140708
14080101	បទសន្ទ្រា	Bat Santrea	140801
14080102	កំពង់ពពិល	Kampong Popil	140801
14080103	ព្រែកកាំភ្លើង	Preaek Kamphleung	140801
14080104	ជំនីក	Chumnik	140801
14080105	ត្រាល	Tral	140801
14080106	គគរ	Kokor	140801
14080107	ខ្សុំជើង	Khsom Cheung	140801
14090216	អំពិល	Ampil	140902
14080108	ខ្សុំត្បូង	Khsom Tboung	140801
14080109	ពហ៊ារ	Pohear	140801
14080110	តាំងរលាង	Tang Roleang	140801
14080202	ទ្រា	Trea	140802
14080203	ដូង	Doung	140802
14080204	ថ្កូវ	Thkov	140802
14080206	វាល	Veal	140802
14080207	ដំបូកធំ	Dambouk Thum	140802
14080209	តាំងរមាំង	Tang Romeang	140802
14080210	កញ្ចំ ក	Kanhcham Kor	140802
14080211	កញ្ចំ ខ	Kanhcham Khor	140802
14080212	ព្រៃទំពូង ក	Prey Tumpung Kor	140802
14080213	ព្រៃទំពូង ខ	Prey Tumpung Khor	140802
14080214	ទន្លេជ្រៃ ក	Tonle Chrey Kor	140802
14080215	ទន្លេជ្រៃ ខ	Tonle Chrey Khor	140802
14080301	ព្រែកជ្រូក	Preaek Chruk	140803
14080302	ព្រែកតារ័ត្ន	Preaek Ka Roatn	140803
14080303	កំពង់ប្រាំង	Kampong Prang	140803
14080304	សំបួរ	Sambuor	140803
14080305	ល្វាកោង	Lvea Kaong	140803
14080306	ពាក់ស្បៃ	Peak Sbai	140803
14080501	អណ្ដូង	Andoung	140805
14080502	មេសរប្រចាន់លើ	Mesar Prachan Leu	140805
14080503	មេសរប្រចាន់ក្រោម	Mesar Prachan Kraom	140805
14080504	កំពង់ទ្រា	Kampong trea	140805
14080505	ព្រែកចំប៉ា	Preaek Champa	140805
14080506	មេមល់	Me Mol	140805
14080507	យោត	Yout	140805
14080701	អង្គាសដី	Angkeas Dei	140807
14080702	ព្រហ្ម	Prum	140807
14080703	សាមគ្គី	Sameakki	140807
14080704	ស្នាយភ្លើង	Snay Phleung	140807
14080705	ព្រៃស្លា	Prey Sla	140807
14080706	ព្រៃព្នៅ	Prey Pnov	140807
14080707	គ្រួស	Kruos	140807
14080708	សំរាប	Samreab	140807
14080709	កគោ	Ka Kou	140807
14080710	ស្រម៉	Srama	140807
14080802	កំពង់ពោធិ៍	Kampong Pou	140808
14090505	ភ្នៀត	Phniet	140905
14080803	ទំញាំងជ្រើស	Tumpeang Chreus	140808
14080805	ព្រៃស្នៀតខាងជើង	Prey Sniet Khang Choeung	140808
14080806	ព្រៃស្នៀតខាងលិច	Prey Sniet Khang Lech	140808
14080807	ព្រៃស្នៀតខាងកើត	Prey Sniet Khang Kaeut	140808
14080808	មេលោងខាងជើង	Me Loung Khang Choeung	140808
14080809	មេលោងខាងត្បូង	Me Loung Khang Tboung	140808
14080901	ព្រះម្លូរ	Preah Mlu	140809
14080902	គរ	Kor	140809
14080904	ព្រហ៊ូត	Prohut	140809
14080907	គកតូច	Kok Touch	140809
14080908	គកធំ	Kok Thum	140809
14080909	ព្រៃស្រឡិត	Prey Sralet	140809
14080910	ព្រៃក្រឡាញ់តូច	Prey Kralanh Touch	140809
14080911	ព្រៃក្រឡាញ់ធំ	Prey Kralanh Thum	140809
14080912	ចុងព្រៃ	Chong Prey	140809
14080913	ក្រាំង ក	Krang Kor	140809
14080914	ក្រាំង ខ	Krang Khor	140809
14080915	ជ្រៃ ក	Chrey Kor	140809
14080916	ជ្រៃ ខ	Chrey Khor	140809
14080917	ស្វាយ ក	Svay Kor	140809
14080918	ស្វាយ ខ	Svay Khor	140809
14081001	ពារាំង	Peareang	140810
14081002	ចុងក្រូច	Chong Krouch	140810
14081003	វៃវេទ	Vey Vet	140810
14081004	ពាមអំពិល	Peam Ampil	140810
14081005	ជ្រៃ	Chrey	140810
14081006	ពោធិ៍សាបាង	Pou Sabang	140810
14081007	ព្រៃខ្លា	Prey Khla	140810
14081101	ស្នាយពល	Snay Pol	140811
14081102	រកា	Roka	140811
14081103	ត្រកៀត	Trakiet	140811
14081104	ឫស្សីជុក	Ruessei Chuk	140811
14081105	ត្នោត	Tnaot	140811
14081106	ព្រៃសម្លាញ	Prey Samlanh	140811
14081107	សន្លុង	Sanlung	140811
14081108	តាំងស្នាយ	Tang Snay	140811
14081109	មេលប់	Me Lob	140811
14090101	ក្រូច	Krouch	140901
14090102	លឹង្គ	Luengk	140901
14090103	ពញាលៀង	Ponhea Lieng	140901
14090104	ធំ	Thum	140901
14090105	ព្រៃអាស្ទាំង	Prey A Steang	140901
14090106	ទឹកជូរ	Tuek Chur	140901
14090107	ចំការតាម៉ូយ	Chamkar Ta Mouy	140901
14090108	ឧកញ៉ាឯម	Oknha Aem	140901
14090109	ជ្រៃ	Chrey	140901
14090110	ព្រៃស្រម៉ោច	Prey Sramaoch	140901
14090111	ស្វាយចារ	Svay Char	140901
14090112	ហារ	Har	140901
14090113	បឹងឥដ្ឋ	Boeng Edth	140901
14090114	ព្រៃរំចាន់	Prey Rumchan	140901
14090115	ស្វាយ	Svay	140901
14090116	ព្រៃមាស	Prey Meas	140901
14090117	ក្រសាំងទង	Krasang Tong	140901
14090201	រកាជួរទី ១	Roka Chuor Ti Muoy	140902
14090202	រកាជួរទី ២	Roka Chuor Ti Pir	140902
14090203	រកាជួរទី ៣	Roka Chuor Ti Bei	140902
14090204	ជៃតា	Chey Ta	140902
14090205	ម្រេញ	Mrenh	140902
14090206	ពោធិ៍រិយំ	Pou Riyum	140902
14090207	កគោ	Ka Kou	140902
14090208	ងែកងក	Ngeaek Ngok	140902
14090209	ប្រោះស្វា	Praoh Sva	140902
14090210	ដំរីស្លាប់	Damrei Slab	140902
14090211	សំពោង	Sampoung	140902
14090212	តាអឹម	Ta Oem	140902
14090213	បឹងកំពត	Boeng Kampot	140902
14090214	ប្របុសរលួយ	Prabos Roluoy	140902
14090215	មុន្នីសិលា	Muni Sela	140902
14090217	ពីងពង់	Ping Pong	140902
14090218	ឫស្សីជុក	Ruessei Chuk	140902
14090219	ពោធិ៍	Pou	140902
14090220	ពោធិ៍ជ្រែក	Pou Chreaek	140902
14090301	សំបួរ	Sambuor	140903
14090302	តាអូក	Ta Ouk	140903
14090303	សូរិយា	Souriya	140903
14090304	បឹងដោល	Boeng Daol	140903
14090305	ប៉ាក់ព្រី	Pak Pri	140903
14090306	ក្លែងគង់	Klaeng Kong	140903
14090307	អំពិល	Ampil	140903
14090308	ទឹកសិន	Tuek Sen	140903
14090309	ថ្កោល	Thkaol	140903
14090310	រការកូនសាត់	Roka Koun Sat	140903
14090311	តាហៀវ	Ta Hiev	140903
14090401	ក្ដីស្គា	Kdei Skea	140904
14090402	ពោធិ៍	Pou	140904
14090403	ប្រថ្ម	Pra Thma	140904
14090404	ជៃកំពក	Chey Kampok	140904
14090405	ស្នោរ	Snaor	140904
14090406	ត្រស់	Tras	140904
14090407	ស្វាយទោល	Svay Toul	140904
14090408	អង្គស្វាយទូ	Angk Svay Tu	140904
14090409	កំពង់បាស្រី	Kampong Ba Srei	140904
14090410	តាពូង	Ta Pung	140904
14090411	ទួលលាន	Tuol Lean	140904
14090412	ព្រៃបាស្រី	Prey Ba Srei	140904
14090501	ស្វាយ	Svay	140905
14090502	ពិលា	Pilea	140905
14090503	ស្រះថ្កូវ	Srah Thkov	140905
14090504	ព្រៃខ្លា	Prey Khla	140905
14090506	ស្វាយបាង	Svay Bang	140905
14090507	តាម៉ៅ	Ta Mau	140905
14090508	សឹង	Soeng	140905
14090509	វាល	Veal	140905
14090510	កណ្ដាល	Kandal	140905
14090511	ក្រាំងក្អុក	Krang K'ok	140905
14090512	ជំរៅ	Chumrov	140905
14090601	សង្កែចុង	Sangkae Chong	140906
14090602	ពោធិ៍	Pou	140906
14090603	ក្រាំងស្វាយ	Krang Svay	140906
14090604	ទួលមានគុណ	Tuol Mean Kun	140906
14090605	សុណនចៃ	Sonan Chai	140906
14090606	ពាយនាយ	Peay Neay	140906
14090607	ព្រីង	Pring	140906
14090608	គោកសំពៅ	Kouk Sampov	140906
14090609	ស្រះកែវ	Srah Kaev	140906
14090610	ស្ដៅ	Sdau	140906
14090701	សំរោង	Samraong	140907
14090702	ត្នោតច្រុះ	Tnaot Chroh	140907
14090703	ពានី	Peani	140907
14090704	ធំ	Thum	140907
14090705	បឹងស្នោរ	Boeng Snaor	140907
14090706	ល្វា	Lvea	140907
14090707	ស្វាយក្ដៀប	Svay Kdieb	140907
14090708	ព្រៃក្ដួច	Prey Kduoch	140907
14090709	កំពង់ថ្នល់	Kampong Thnal	140907
14090710	តាគោក	Ta Kouk	140907
14090711	ព្រំខ្សាច់	Prum Khsach	140907
14090801	កងនាង	Kang Neang	140908
14090802	ផុត	Phot	140908
14090803	ព្រៃរុន	Prey Run	140908
14090804	ឫស្សីទន្លេ	Ruessei Tonle	140908
14090805	ព្រៃទ័ព	Prey Toap	140908
14090806	ផ្លាំង	Phlang	140908
14090807	ឫស្សីទទឹង	Ruessei Totueng	140908
14090808	ត្នោតទោល	Tnaot Toul	140908
14090809	តាកេត	Ta Ket	140908
14090810	អំពិល	Ampil	140908
14090811	អន្លង់ចារ	Anlong Char	140908
14090812	អន្ទ្រាក	Antreak	140908
14090813	ទួលជៃ	Tuol Chey	140908
14090901	ឈ្នះជៃលើ	Chhneah Chey Leu	140909
14090902	ឈ្នះជៃក្រោម	Chhneah Chey Kraom	140909
14090903	តាម៉ៅ	Ta Mau	140909
14090904	តាហ៊េល ក	Ta Hel Ka	140909
14090905	តាហ៊េល ខ	Ta Hel Kha	140909
14091001	ត្រពាំងឈូក	Trapeang Chhuk	140910
14091002	តាង៉ក	Ta Ngak	140910
14091003	ទួលទ្រា	Tuol Trea	140910
14091004	ជីពុត	Chi Put	140910
14091005	ស្រះ	Srah	140910
14091006	ជង្រុះ	Chongruh	140910
14091007	សទ្ធា	Satthea	140910
14091008	ព្រៃផ្ដៅ	Prey Phdau	140910
14091009	តាណាល	Ta Nal	140910
14091010	ព្រៃផ្ញា	Prey Phnha	140910
14091011	គោក	Kouk	140910
14091012	ជើងទឹក	Cheung Tuek	140910
14091013	សាលា	Sala	140910
14091014	ក្រសារជេត	Krasar Chet	140910
14091015	ឡឹក	Loek	140910
14091016	អំពិល	Ampil	140910
14091101	ក្លែងគង់	Klaeng Kong	140911
14091102	ក្ដាមពុក	Kdam Puk	140911
14091103	ក្រសាំងចារ	Krasang Char	140911
14091104	គំរាង	Kumreang	140911
14091105	ស្នាយព្រឹម	Snay Pruem	140911
14091106	ធ្នង់	Thnong	140911
14091107	ព្រីង	Pring	140911
14091108	ស្ពានជៃ	Spean Chey	140911
14091109	ប្រស្នាធំ	Prasna Thum	140911
14091110	ប្រស្នាតូច	Prasna Touch	140911
14091111	ត្រពាំងប្របុស	Trapeang Brabos	140911
14091112	ជៃអាខោល	Chey A Khaol	140911
14091113	អំពិល	Ampil	140911
14091114	ខ្លាខាំ	Khla Kham	140911
14091115	ទ្រា	Trea	140911
14091116	ស្នោរ	Snaor	140911
14091117	សំនយ	Samnoy	140911
14091118	កំរោល	Kamraol	140911
14100101	បារាយណ៍កើត	Baray Kaeut	141001
14100102	បារាយណ៍លិច	Baray Lech	141001
15010519	អូរបត់	Ou Bat	150105
14100201	ជើងទឹក ក	Cheung Tuek Ka	141002
14100202	ជើងទឹក ខ	Cheung Tuek Kha	141002
14100203	កំពង់អាទង់	Kampong A Tong	141002
14100204	ស្វាយសុខោ	Svay Sokhao	141002
14100205	ឯករាម	Aek Ream	141002
14100301	លេខ១	Lekh Muoy	141003
14100302	លេខ២	Lekh Pir	141003
14100303	លេខ៣	Lekh Bei	141003
14100304	លេខ៤	Lekh Buon	141003
14100305	លេខ៥	Lekh Pram	141003
14100306	លេខ៦	Lekh Prammuoy	141003
14100307	លេខ៧	Lekh Prampir	141003
14100308	លេខ៨	Lekh Prambei	141003
14110101	ពោធិ៍រៀងជើង	Pou Rieng Cheung	141101
14110102	ពោធិ៍រៀងត្បូង	Pou Rieng Tboung	141101
14110103	វាលព្រៅ	Veal Prov	141101
14110104	យាយសល់	Yeay Sal	141101
14110201	ព្រែកអន្ទះ	Preaek Anteah	141102
14110202	ព្រែកផ្គាំ	Preaek Phkoam	141102
14110203	ច្រាំងទទឹង	Chrang Totueng	141102
14110204	តាម៉ោ	Ta Mao	141102
14110205	តាមែង	Ta Meaeng	141102
14110206	អង្គរយស	Angkor Yos	141102
14110207	ថ្មី	Thmei	141102
14110301	ព្រែកជ្រៃលើ	Preaek Chrey Leu	141103
14110302	ព្រែកជ្រៃក្រោម	Preaek Chrey Kraom	141103
14110303	អន្លង់ទ្រា	Anlong Trea	141103
14110304	បាក់ដោក	Bak Daok	141103
14110305	ពាមស្ដី	Peam Sdei	141103
14110401	ស្វាយកំពីងពួយ	Svay Kamping Puoy	141104
14110402	កំពង់ក្រមួន	Kampong Kra muon	141104
14110403	ជ្រាវ	Chreav	141104
14110404	ពពឹស	Popueus	141104
14110405	ព្រៃកន្លោង	Prey Kanlaong	141104
14110501	កុកត្រុំ ក	Kok Trom Ka	141105
14110502	កុកត្រុំ ខ	Kok Trom Kha	141105
14110503	ខ្នយ	Khnoy	141105
14110504	ភ្លយ	Phloy	141105
14110505	ស្គដាច	Skor Dach	141105
14110506	ត្នោតទ្រេត	Tnaot Tret	141105
14110507	តាកោ	Ta Kao	141105
14110508	ភគ្គនេស្ស	Pheakkeaknes	141105
14110601	កំពង់ឫស្សី	Kampong Ruessei	141106
14110602	ល្វា	Lvea	141106
14110603	ព្រៃមាស	Prey Meas	141106
14110604	ត្នោត	Tnaot	141106
14110605	ស្លា	Sla	141106
14110606	ជ្រៃគ្រហ៊ឹម	Chrey Krohuem	141106
14110701	ព្រែកក្រូច	Preaek Krouch	141107
14110702	ព្រែកឈ្មោះ	Preaek Chhmuoh	141107
14110703	ព្រែកតាសរ	Preaek Ta Sar	141107
14110704	តាព្រះ	Ta Preah	141107
14120101	ស្វាយទាប	Svay Teab	141201
14120102	ពានា	Peanea	141201
14120103	ក្បាលបឹង	Kbal Boeng	141201
14120104	ទួលជ្រៃ	Tuol Chrey	141201
14120105	អំពិលក្រៅ	Ampil Krau	141201
14120201	ព្រៃស្វា	Prey Sva	141202
14120202	ល្វា	Lvea	141202
14120203	កន្ទ្រោញ	Kantrounh	141202
14120204	បឹងឡែង	Boeng Laeng	141202
14120205	ជ្រៃឃ្មុំ	Chrey Khmum	141202
14120206	ប្រាសាទ	Prasat	141202
14120207	តាណាល	Ta Nal	141202
14120208	ឡាំឡូង	Lam Loung	141202
14120301	ល្វេ	Lve	141203
14120302	អំបែងចេះ	Ambaeng Cheh	141203
14120303	កោងទន្លេលើ	Kaong Tonle Leu	141203
14120304	កោងទន្លេក្រោម	Kaong Tonle Kraom	141203
14120305	ព្រុំម្នី	Prum Mni	141203
14120306	កោងស្រែ	Kaong Srae	141203
14120401	ព្នៅ	Pnov	141204
14120402	តាគ្រាប	Ta Kreab	141204
14120403	កំព្រៅ	Kamprov	141204
14120404	ផាត់សណ្ដោង	Phat Sandaong	141204
14120405	ទួលស្រឹង	Tuol Sroeng	141204
14120406	ទួលអង្គុញ	Tuol Angkunh	141204
14120407	បន្លិចស្វាយ	Banlich Svay	141204
14120501	តាង៉កស្រែ	Ta Ngak Srae	141205
14120502	ស្គាស្រុក	Skea Srok	141205
14120503	ស្គាក្ដី	Skea  Kdei	141205
14120504	តាង៉កទន្លេ	Ta Ngak Tonle	141205
14120601	ចុង	Chong	141206
14120602	ត្រាច	Trach	141206
14120603	ពោធិ៍ទី	Pou Ti	141206
14120604	ស្វាយសាក់	Svay Sak	141206
14120605	ព្រៃព្រហ្ម	Prey Prum	141206
14120606	ត្រពាំងចាម	Trapeang Cham	141206
14120701	ព្រែកចង្ក្រានលើ	Preaek Changkran Leu	141207
14120702	ព្រែកចង្ក្រានក្រោម	Preaek Changkran Kraom	141207
14120703	បាប្រីយ៍	Ba Prei	141207
14120704	ព្រែកព្នៅ	Preaek Pnov	141207
14120705	ព្រែកសណ្ដែក	Preaek Sandaek	141207
14120801	ព្រៃដើមថ្នឹងទី ១	Prey Daeum Thnoeng Ti Muoy	141208
14120802	ព្រៃដើមថ្នឹងទី ២	Prey Daeum Thnoeng Ti Pir	141208
14120803	ព្រៃដើមថ្នឹងទី ៣	Prey Daeum Thnoeng Ti Bei	141208
14120804	ព្រៃដើមថ្នឹងទី ៤	Prey Daeum Thnoeng Ti Buon	141208
14120901	ឈើទាល	Chheu Teal	141209
14120902	ខ្នារ	Khnar	141209
14120903	ព្រៃទឹង	Prey Tueng	141209
14120904	បឹងជ័រ	Boeng Choar	141209
14120905	គោករការ	Kouk Rokar	141209
14121001	រលាំង	Roleang	141210
14121002	ព្រៃលាន	Prey Lean	141210
14121003	ចារ	Char	141210
14121004	ព្រៃពោធិ៍	Prey Pou	141210
14121005	អន្លង់សរ	Anlong Sar	141210
14121006	កំភារ	Kamphear	141210
14121101	ស្វាយជីក្រាយ	Svay Chi Kray	141211
14121102	ឫស្សីសាញ់	Ruessei Sanh	141211
14121104	ព្រៃឈៀង	Prey Chhieng	141211
14130101	អង្គរទ្រេត	Angkor Tret	141301
14130102	ត្របែកលិច	Trabaek Lech	141301
14130103	ត្របែកកើត	Trabaek Kaeut	141301
14130104	គក	Kok	141301
14130105	តារាមលិច	Ta Ream Lech	141301
14130106	តារាមកើត	Ta Ream Kaeut	141301
14130107	វត្ដត្រាច	Voat Trach	141301
14130108	ឫស្សីធ្លក	Ruessei Thlok	141301
14130109	ស្រឡូងទី១	Sraloung Ti Muoy	141301
14130110	ស្រឡូងទី២	Sraloung Ti Pir	141301
14130111	ស្រឡូងទី៣	Sraloung Ti Bei	141301
14130112	តាឡើក	Tra Laeuk	141301
14130113	បឹងរ៉ាច់	Boeng Rach	141301
14130201	ជ្រៃសីម៉ា	Chrey Seima	141302
14130202	ព្រៃឫស្សី	Prey Ruessei	141302
14130203	ខ្លាពារ	Khla Pear	141302
14130204	ឆ្កែកូន	Chhkae Koun	141302
14130205	ដូនយូ	Doun Yu	141302
14130206	ជាខ្លាង	Chea Khlang	141302
14130207	ច្រេស	Chres	141302
14130208	ធ្នង់	Thnong	141302
14130301	គោករវៀង	Kouk Rovieng	141303
14130302	ព្រៃតាណាន់	Prey Ta Nan	141303
14130303	ស្វាយគុណ	Svay Kun	141303
14130304	ព្រៃតាម៉ុក	Prey Ta Mok	141303
14130305	ក្រសាំងគយ	Krasang Koy	141303
14130306	មេនងក្រោម	Menong Kraom	141303
14130307	ឫស្សីស្លាប់	Ruessei Slab	141303
14130308	ស្វាយអាត់	Svay At	141303
14130309	មេនងលើ	Menong Leu	141303
14130310	ម៉ឺនពួក	Meun Puok	141303
14130311	ព្រៃមហាចាន់	Prey Moha Chan	141303
14130312	ជ្រៃវាល	Chrey Veal	141303
14130313	ជ្រៃផ្សារ	Chrey Phsar	141303
14130314	ព្រៃចារ	Prey Char	141303
14130315	ព្រហ៊ារ	Prohear	141303
14130316	ដូនយុគ	Doun Yuk	141303
14130401	ចំការគួយលិច	Chamkar Kuoy Lech	141304
14130402	ចំការគួយកើត	Chamkar Kuoy Kaeut	141304
14130403	អូរកណ្ដោលត្បូង	Ou Kandaol Tboung	141304
14130404	ថ្កូវ	Thkov	141304
14130405	គាំប្រដឺស	Koam Pradeus	141304
14130406	បន្ទាយស្រែ	Banteay Srae	141304
14130407	ត្រពាំងព្រីង	Trapeang Pring	141304
14130408	វាលតូច	Veal Touch	141304
14130409	ព្រៃភ្លាំង	Prey Phleang	141304
14130410	កូនត្នោត	Koun Tnaot	141304
14130411	បិតមាស	Bet Meas	141304
14130412	បឹងវែង	Boeng Veaeng	141304
14130413	ត្បូងក្ដី	Tboung Kdei	141304
14130414	បុស្ស	Bos	141304
14130415	ព្រៃរូង	Prey Rung	141304
14130416	ដំរីពួន	Damrei Puon	141304
14130417	អូរកណ្ដោលជើង	Ou Kandaol Cheung	141304
14130501	ចចកទី ១	Chachak Ti Muoy	141305
14130502	ចចកទី ២	Chachak Ti Pir	141305
14130503	មេបុណ្យ	Me Bon	141305
14130504	រកាខ្សុក	Roka Khsok	141305
14130505	ភ្នំគង់	Phnum Kong	141305
14130506	ថ្កូវ	Thkov	141305
14130507	ហាបូរ	Ha Bour	141305
14130601	ព្រៃជ្រាំង	Prey Chreang	141306
14130602	ត្រពាំងតាមោក	Trapeang Ta Mouk	141306
14130603	ត្រពាំងស្មៅ	Trapeang Smau	141306
14130604	ក្រាំងចំបក់	Krang Chambak	141306
14130605	អណ្ដូងថ្ម	Andoung Thma	141306
14130606	ជ្រៃរលើង	Chrey Roleung	141306
14130607	ព្រៃរំពាក់	Prey Rumpeak	141306
14130608	ត្រពាំងធំ	Trapeang Thum	141306
14130609	ព្រៃរូង	Prey Rung	141306
14130610	ពានរោង	Pean Roung	141306
14130611	ថ្នល់កែង	Thnal Kaeng	141306
14130612	ឆ្អឹងពស់	Chh'oeng Pos	141306
14130613	ព្រៃនគរក្នុង	Prey Nokor Knong	141306
14130614	កណ្ដាល	Kandal	141306
14130615	ត្របែក	Trabaek	141306
14130616	កូនពោធិ៍	Koun Pou	141306
14130617	ព្រៃវល្លិ	Prey Voa	141306
14130618	ព្រៃឆ្លុង	Prey Chhlong	141306
14130619	ចេក	Chek	141306
14130620	ដុំ	Dom	141306
14130621	ធ្លក	Thlok	141306
14130701	ខ្សោកជើង	Khyaok Cheung	141307
14130702	ខ្សោកកណ្ដាល	Khyaok Kandal	141307
14130703	ខ្សោកត្បូង	Khyaok Tboung	141307
14130704	ថ្នល់ជ័យ	Thnal Chey	141307
14130801	ព្រៃសុធន់	Prey Sothon	141308
14130802	តងឡងទី ១	Tanglang Ti Muoy	141308
14130803	តងឡងទី ២	Tanglang Ti Pir	141308
14130804	តងឡងទី ៣	Tanglang Ti Bei	141308
14130805	ព្រៃខ្លាទី ១	Prey Khla Ti Muoy	141308
14130806	ព្រៃខ្លាទី ២	Prey Khla Ti Pir	141308
14130807	ក្រចាបទី ១	Krachab Ti Muoy	141308
14130808	ក្រចាបទី ២	Krachab Ti Pir	141308
14130809	ក្រចាបទី ៣	Krachab Ti Bei	141308
14130810	បាក់តាង	Bak Tang	141308
14130811	សុបិន	Soben	141308
14130812	វាល	Veal	141308
14130813	សង្វាន	Sangvan	141308
14130901	ព្រៃឈើទាល	Prey Chheu Teal	141309
14130902	ព្រលឹងមាស	Prolueng Meas	141309
14130903	ត្រពាំងចក	Trapeang Chak	141309
15031110	ថ្មី	Thmei	150311
14130904	ត្រពាំងឥដ្ឋ	Trapeang Edth	141309
14130905	ព្រៃសំឡាញ	Prey Samlanh	141309
14130906	សំរោង	Samraong	141309
14130907	ព្រៃឃ្នង	Prey Khnong	141309
14130908	កណ្ដាល	Kandal	141309
14130909	ព្រហូត	Prohut	141309
14130910	ត្រោក	Traok	141309
14130911	ត្រាច	Trach	141309
14130912	សង្កែ	Sangkae	141309
14130913	តាគាត់	Ta Koat	141309
14130914	ថ្មី	Thmei	141309
14131001	ស្វាយអន្ទរទី ១	Svay Antor Ti Muoy	141310
14131002	ស្វាយអន្ទរទី ២	Svay Antor Ti Pir	141310
14131003	ពោធិ៍ចិន្ដាំ	Pou Chentam	141310
14131004	ពោធិ៍ជ្រៃ	Pou Chrey	141310
14131005	ព្រៃខ្វែក	Prey Khvaek	141310
14131007	ថ្លាវ	Thlav	141310
14131101	ត្រោកតាប៉ាង	Traok Ta Pang	141311
14131102	ព្រៃគាវ	Prey Keav	141311
14131103	ព្រៃផ្ដៅ	Prey Phdau	141311
14131104	ព្រៃទទឹង	Prey Totueng	141311
14131105	ឫស្សីទ្វា	Ruessei Tvea	141311
14131106	មានជ័យ	Mean Chey	141311
14131107	សង្កែជ្រុំ	Sangkae Chrum	141311
14131108	ទួលអំពិល	Tuol Ampil	141311
14131109	ប្រអួលទឹក	Pra'uol Tuek	141311
14131110	ព្រៃល្វាយ	Prey Lveay	141311
14131111	បូតគង	Bout Kong	141311
14131112	ទឹកថ្លា	Tuek Thla	141311
14131113	កន្លោង	Kanlaong	141311
14131114	បន្ទាយ	Banteay	141311
14131115	ត្រោក	Traok	141311
14131116	ព្រិច	Prich	141311
14131117	គ្រង់	Krong	141311
14131118	ពោន	Poun	141311
15010101	ដូងជ្រុំ	Doung Chrum	150101
15010102	សំរោង	Samraong	150101
15010103	ត្រាំំសេះ	Tram Seh	150101
15010104	អូរ	Ou	150101
15010105	បត់ត្រាច	Bat Trach	150101
15010106	របងរមាស	Robang Romeas	150101
15010107	បត់កណ្ដោល	Bat Kandaol	150101
15010108	ស្វាយ	Svay	150101
15010109	ព្រះអំពិល	Preah Ampil	150101
15010110	បឹងឈូក	Boeng Chhuk	150101
15010111	ទួលធ្មា	Tuol Thmea	150101
15010112	ស្វាយជ្រុំ	Svay Chrum	150101
15010114	ឬស្សីតាម៉ាន់	Ruessei Ta Man	150101
15010201	ព្រៃផ្ដៅ	Prey Phdau	150102
15010202	បឹងខ្នារ	Boeng Khnar	150102
15010203	ក្រសាំងគ្រួ	Krasang Kruo	150102
15010204	រូង	Rung	150102
15010205	វត្ដជ្រែ	Voat Chreae	150102
15010206	ព្រះម្លូ	Preah Mlu	150102
15010207	ព្រៃស្វាយ	Prey Svay	150102
15010208	ចំការលើ	Chamkar Leu	150102
15010209	ព្រៃដំរី	Prey Damrei	150102
15010210	ខ្នាចរមាស	Khnach Romeas	150102
15010211	ស្រករ	Srakar	150102
15010212	ដើមច្រេស	Daeum Chres	150102
15010215	ត្រាចក្រោល	Trach Kraol	150102
15010301	ដើមរកា	Daeum Roka	150103
15010302	កោះស្វាយ	Kaoh Svay	150103
15010303	កំប្រាក់កូន	Kamprak Koun	150103
15010304	ទួលអង្គ្រង	Tuol Angkrong	150103
15010305	ក្រូចសើច	Krouch Saeuch	150103
15010306	ខ្នារទទឹង	Khnar Totueng	150103
15010307	បឹងឈូក	Boeng Chhuk	150103
15010308	ផ្ទះស្លា	Phteah Sla	150103
15010309	កោះក្របី	Kaoh Krabei	150103
15010310	ដំណាក់ធ្នង់	Damnak Thnong	150103
15010311	បាក់មែក	Bak Meaek	150103
15010312	កោះវត្ដ	Kaoh Voat	150103
15010401	អង្កាញ់	Angkanh	150104
15010402	អូរព្រាល	Ou Preal	150104
15010403	ចាយ៉ូវ	Cha Yov	150104
15010404	ក្ដាត	Kdat	150104
15010405	ប៉ោឡោ	Paolao	150104
15010406	តាមុំ	Ta Mom	150104
15010407	ចិនតាយ	Chen Tay	150104
15010408	មេទឹក	Me Tuek	150104
15010409	កោះខ្សាច់	Kaoh Khsach	150104
15010410	ម៉	Ma	150104
15010411	ដីរនាត	Dei Roneat	150104
15010412	ត្រាង	Trang	150104
15010414	សំរោងព្រៃខៀវ	Samraong Prey Khiev	150104
15010415	ក្អមសំណ	K'amsamna	150104
15010416	ព្រែកក្រ	Preaek Kra	150104
15010501	ព្រៃយាង	Prey Yeang	150105
15010502	របោះរាំង	Robaoh Reang	150105
15010503	ចំការអូរ	Chamkar Ou	150105
15010504	ចំការខ្លុយ	Chamkar Khloy	150105
15010505	អូរតាប៉ោង	Ou Ta Paong	150105
15010506	អន្លង់ក្រាយ	Anlong Kray	150105
15010507	ស្រះម្កាក់	Srah Mkak	150105
15010509	បត់គគីរចាស់	Bat Kokir Chas	150105
15010510	ស្ដុកឃ្លោក	Sdok Khlouk	150105
15010511	ទួលរគាំង	Tuol Rokeang	150105
15010512	សំរោងពក	Samraong Pok	150105
15010513	ផ្សារអណ្ដែត	Phsar Andaet	150105
15010514	ឧកញ្ញ៉ាមាន់	Oknha Moan	150105
15010515	ស្រះរុន	Srah Run	150105
15010516	បត់គគីរថ្មី	Bat Kokir Thmei	150105
15010517	តាណៃ	Ta Nai	150105
15010521	ព្រៃក្របៅ	Prey Krabau	150105
15010601	ព្នៅ	Pnov	150106
15010602	រូងតាកុក	Roung Ta Kok	150106
15010603	កូនត្នោត	Koun Tnaot	150106
15010604	ប្រឡាយរំដេង	Pralay Rumdeng	150106
15010605	ប្រាសាទ	Prasat	150106
15010606	កំពង់ក្ដី	Kampong Kdei	150106
15010607	រំលេច	Rumlech	150106
15010608	កោះខ្ជាយ	Kaoh Khcheay	150106
15010609	ស្ដុកខ្លា	Sdok Khla	150106
15010610	ខ្វាវ	Khvav	150106
15010611	ដំណាក់ត្រាច	Damnak Trach	150106
15010612	ល្ហុង	Lhong	150106
15010613	ថ្មី	Thmei	150106
15010701	ស្នាមព្រះ	Snam Preah	150107
15010702	ក្រពើរោទិ៍	Krapeu Rou	150107
15010703	អណ្ដូងសំបូរ	Andoung Sambuor	150107
15010704	សាមគ្គី	Sameakki	150107
15010705	ចំបក់មាស	Chambak Meas	150107
15010706	ទួលខ្មែរ	Tuol Khmer	150107
15010707	ស្ដុកស្វាយ	Sdok Svay	150107
15010708	កោះក្រសាំង	Kaoh Krasang	150107
15010709	ព្នៅ	Pnov	150107
15010710	ដង្កៀបក្ដាម	Dangkieb Kdam	150107
15010711	អន្លង់មាន	Anlong Mean	150107
15010712	កំពែងស្វាយ	Kampeaeng Svay	150107
15010713	ខ្មារ	Khmar	150107
15010714	ធ្នោះតាចាប	Thnuoh Ta Chab	150107
15010715	ស្វាយអាត់	Svay At	150107
15010716	អារ៉ែន	Araen	150107
15010717	អណ្ដូងក្រសាំង	Andoung Krasang	150107
15010718	បាក់ព្រីង	Bak Pring	150107
15010719	ជើងភ្លើង	Cheung Phleung	150107
15010720	ត្រាំពែរ	Tram Peaer	150107
15010801	ទួលសំរោង	Tuol Samraong	150108
15010802	ស្វាយដូនកែវទី១	Svay Doun Kaev Ti Muoy	150108
15010803	ស្វាយដូនកែវទី២	Svay Doun Kaev Ti Pir	150108
15010804	ស្វាយស	Svay Sa	150108
15010805	កំប៉ាង	Kampang	150108
15010806	ច្រប់	Chrab	150108
15010807	ថ្មី	Thmei	150108
15010808	កំពោតអាង	Kampout Ang	150108
15010809	និគមន៍លើ	Nikom Leu	150108
15010901	គោករំល	Kouk Rumlo	150109
15010902	ទួលទទឹង	Tuol Totueng	150109
15010903	ទួលថ្ម	Tuol Thma	150109
15010904	បួច្រេស	Buo Chres	150109
15010905	ព្រៃរោង	Prey Roung	150109
15010906	តាលោ	Ta Lou	150109
15010907	ថ្មី	Thmei	150109
15010908	ទួលជ្រាវ	Tuol Chreav	150109
15010909	ព្រៃតោ	Prey Tao	150109
15010910	បឹងកក់	Boeng Kak	150109
15010911	ព្រៃវាំង	Prey Veang	150109
15010912	សិរីគន្ធា	Serei Kunthea	150109
15010913	ត្រយ៉ងស	Trayang Sa	150109
15010914	ឆ្នាល់មាន់	Chhnal Moan	150109
15010915	ព្រៃកន្ទួត	Prey Kantuot	150109
15010916	តាំងគោក	Tang Kouk	150109
15010917	បោសគរ	Baos Kor	150109
15010918	ប្រហាល	Prahal	150109
15010919	រហាលទិល	Rohal Til	150109
15010920	សំសាន្ត	Som Sant	150109
15011001	បាកាន	Bakan	150110
15011002	កាប់ក្រឡាញ់	Kab Kralanh	150110
15011003	ពោធិ៍លំ្យុ	Poulyum	150110
15011004	ស្ទឹងកំបុត	Stueng Kambot	150110
15011005	បឹងប្រីយ៍	Boeng Prei	150110
15011006	ស្រែល្វា	Srae Lvea	150110
15011007	ចំការអូរ	Chamkar Ou	150110
15011008	កណ្ដឹងមាស	Kandoeng Meas	150110
15011009	ត្រពាំងជង	Trapeang Chorng	150110
15011010	កោះអណ្ដែត	Kaoh Andaet	150110
15011011	កោះស្វាយ	Kaoh Svay	150110
15011012	ក្រោលក្របី	Kraol Krabei	150110
15011013	ពិតត្រង់	Pit Trang	150110
15011014	កោះកែវ	Kaoh Kaev	150110
15011015	បួស្រង៉ែ	Buo Srangae	150110
15011016	ស្នាយទោល	Snay Toul	150110
15011017	អូររំចេក	Ou Rumchek	150110
15011018	ក្ដីឈ្នួល	Kdei Chhnuol	150110
15011019	ថ្មី	Thmei	150110
15011020	ព្រះចំបក់	Preah Chambak	150110
15020101	ទួលចារ	Tuol Char	150201
15020102	អូរបាក្រង	Ou Ba Krang	150201
15020103	វត្ដពោធិ៍ ទី១	Voat Pou Ti Muoy	150201
15020104	វត្ដពោធិ៍ ទី២	Voat Pou Ti Pir	150201
15020105	កំពង់ក្របី	Kampong Krabei	150201
15020106	ផ្លូវក្របី	Phlov Krabei	150201
15020107	កញ្ជើបាយដាច	Kanhcheu Bay Dach	150201
15020108	អន្លង់វិល	Anlong Vil	150201
15020109	ព្រែកតាវង	Preaek Ta Vong	150201
15020110	ព្រែកតាគង់	Preaek Ta Kong	150201
15020111	កោះក្រសាំង	Kaoh Krasang	150201
15020112	ព្រែកឈើត្រាវ	Preaek Chheu Trav	150201
15020113	ជ័យជំនះ	Chey Chumneah	150201
15020114	បឹងឈូក	Boeng Chhuk	150201
15020115	ផ្ទះគរ	Phteah Kor	150201
15020116	ក្បាលរមាស	Kbal Romeas	150201
15020301	កំពង់រកា	Kampong Roka	150203
15020302	កែវជ័យ	Kaev Chey	150203
15020303	ស្វាយយាង	Svay Yeang	150203
15020304	កណ្ដៀងក្នុង	Kandieng Knong	150203
15020305	កណ្ដៀង	Kandieng	150203
15020306	ស្ថានីយ៍	Sthani	150203
15020307	យស	Yos	150203
15020308	ព្រៃក្ដីលើ	Prey Kdei Leu	150203
15020309	ព្រៃក្ដីកណ្ដាល	Prey Kdei Kandal	150203
15020310	ព្រៃក្ដីក្រោម	Prey Kdei Kraom	150203
15020311	ស្យា	Sya	150203
15020312	បង្គោល	Bangkoul	150203
15020313	ស្ទឹងលើ	Stueng Leu	150203
15020314	ស្ទឹងក្រោម	Stueng Kraom	150203
15020315	កំពង់ក្រសាំងលើ	Kampong Krasang Leu	150203
15020316	កំពង់ក្រសាំងក្រោម	Kampong Krasang Kraom	150203
15020317	បឹងឈូក	Boeng Chhuk	150203
15020401	កញ្ជរ	Kanhchor	150204
15020402	បឹងក្រាញ់	Boeng Kranh	150204
15020403	ព្រែកត្របែក	Preaek Trabaek	150204
15020404	សំរោង	Samraong	150204
15020405	រលាំង	Roleang	150204
15020406	ទួលទទឹង	Tuol Totueng	150204
15020407	ពោធិ៍អណ្ដែត	Pou Andaet	150204
15020408	កូនក្រាយ	Koun Kray	150204
15020409	ដងអូរ	Dang Ou	150204
15020410	ផ្លូវលួង	Phlov Luong	150204
15020411	ត្បែងបង្គាប	Tbaeng Bangkeab	150204
15020412	កណ្ដាល	Kandal	150204
15020501	រាំងទិល	Reang Til	150205
15020502	ព្រែក	Preaek	150205
15020503	ចារុះ	Charaoh	150205
15020504	កោះកែវ	Kaoh  Kaev	150205
15020505	កោះក្អែក	Kaoh K'aek	150205
15020601	បន្ទាយត្រោក	Banteay Traok	150206
15020602	ចំការតាប៉ូ	Chamkar Ta Pou	150206
15020603	ផ្ទះកោះ	Phteah Kaoh	150206
15020604	សែនជ័យ	Saen Chey	150206
15020606	សារៀង	Sarieng	150206
15020607	ក្ដីឈ្វិត	Kdei Chhvit	150206
15020608	តាម៉ោលី	Ta Mao Li	150206
15020609	ព្រីងខ្ពស់	Pring Khpos	150206
15020610	ត្រង់	Trang	150206
15020611	ធ្លាអំពិល	Thlea Ampil	150206
15020612	ថ្មី	Thmei	150206
15020613	ចំរ៉េះ	Chamreh	150206
15020614	បាគូរ	Bakur	150206
15020615	ពោធិ៍	Pou	150206
15020616	ពោពីរ	Pou Pir	150206
15020617	ឥន្ធធ្យា	Entheakthyea	150206
15020701	បឹងក្រាញ់	Boeng Kranh	150207
15020702	រោងម៉ាស៊ីន	Roung Masin	150207
15020703	ស្វាយលួង	Svay Luong	150207
15020704	ស្វាយចាន់	Svay Chan	150207
15020705	ផ្លូវពោធិវង្ស	Phlov Pouthi Vongs	150207
15020706	ស្វាយចំបក់	Svay Chambak	150207
15020707	ពោធិឡើង	Pou Laeung	150207
15020708	កគោ	Ka Kou	150207
15020709	សន្លុង	Sanlung	150207
15020710	ស្វាយយាង	Svay Yeang	150207
15020711	ផ្ទះស្រែ	Phteah Srae	150207
15020712	ជ្រែង	Chreaeng	150207
15020713	ឈើទាល	Chheu Teal	150207
15020801	កំពង់សំបួរ	Kampong Sambuor	150208
15020802	អន្លង់វិល	Anlong Vil	150208
15020803	ចារឹក	Charuek	150208
15020804	បឹងចក	Boeng Chak	150208
15020805	ក្បាលពាម	Kbal Peam	150208
15020806	ត្រពាំងថ្ម	Trapeang Thma	150208
15020807	ក្បាលឈើពុក	Kbal Chheu Puk	150208
15020808	ស្យា	Sya	150208
15020809	ធ្លក	Thlok	150208
15020810	ព្រៃស្រគុំ	Prey Srakum	150208
15020812	វត្ដលៀប	Voat Lieb	150208
15020901	ក្បាលហុង	Kbal Hong	150209
15020902	ប្រឡាយធំ	Pralay Thum	150209
15020903	វាល	Veal	150209
15020904	ពោធិ៍កំបោរ	Pou Kambaor	150209
15020905	កញ្ជើបាយដាច	Kanhcheu Bay Dach	150209
15020906	ពោធិ៍ដំណាក់	Pou Damnak	150209
15020907	បឹងយា	Boeng Yea	150209
15020908	តាស្ដី	Ta Sdei	150209
15020909	ទួលពង្រ	Tuol Pongro	150209
15021001	អន្លង់ហាប	Anlong Hab	150210
15021002	ស្ពាន	Spean	150210
15021003	ដងរុង	Dang Rung	150210
15021004	ដងឡង	Dang Lang	150210
15021005	ស្ដុកជុំ	Sdok Chum	150210
15021006	ដំរីស	Damrei Sa	150210
15021007	ផ្ទះព្រីង	Phteah Pring	150210
15021008	គៀន	Kien	150210
15021009	អំពិលកញ្ច្រិញ	Ampil Kanhchrinh	150210
15021010	ទួលគូ	Tuol Ku	150210
15030101	ជ្រលង	Chrolorng	150301
15030102	ថ្គោលធំ	Thkoul Thum	150301
15030103	កណ្ដាល	Kandal	150301
15030104	ផ្សារ	Phsar	150301
15030105	ទួលម្កាក់	Tuol Mkak	150301
15030106	ឡបាក់	La Bak	150301
15030107	ខ្លាក្រពើ	Khla Krapeu	150301
15030108	ទន្សាយគល់	Tonsay Kol	150301
15030109	ឃ្លាំងមឿង	Khleang Moeung	150301
15030110	បន្ទាយក្រង	Banteay Krang	150301
15030111	ប៉ប៉ិត	Papet	150301
15030112	ទទឹង	Totueng	150301
15030201	ខ្សាច់ល្អិត	Khsach L'et	150302
15030202	ថ្គោលធំ	Thkoul Thum	150302
15030203	ថ្គោលតូច	Thkoul Touch	150302
15030204	អារ៉ងព្រួច	Arang Pruoch	150302
15030205	កំពង់ថ្គោល	Kampong Thkoul	150302
15030206	សានសរ	San Sar	150302
15030207	ក្បាលដំរី	Kbal Damrei	150302
15030301	ថ្មី	Thmei	150303
15030302	កណ្ដុរស	Kandor Sa	150303
15030303	ត្រពាំងឃ្លៃ	Trapeang Khley	150303
15030304	ជជក	Chochork	150303
15030305	ត្រពាំងកន្ទួត	Trapeang Kantuot	150303
15030306	បឹង	Boeng	150303
15030307	អូរអញ្ចាញ	Ou Anhchanh	150303
15030308	ពោធិ៍ឃឿន	Pou Khoeun	150303
15030309	ពោធិ៍អង្ក្រង	Pou Angkrang	150303
15030310	ធ្លាម្អម	Thlea M'am	150303
15030311	តាកែវក្រោម	Ta Kaev Kraom	150303
15030401	ទួលត្បែង	Tuol Tbaeng	150304
15030402	កណ្ដាល	Kandal	150304
15030403	ផ្ទះចេក	Phteah Chek	150304
15030404	ឈើទែប	Chheu Teaeb	150304
15030405	ចាមចាស់	Cham Chas	150304
15030406	ចាមថ្មី	Cham Thmei	150304
15030407	កប៉ាស់	Kapas	150304
15030408	ដង្កៀបក្ដាម	Dangkieb Kdam	150304
15030409	ក្បាលទាហាន	Kbal Teahean	150304
15030410	បំណក់	Bamnak	150304
15030411	ទានព្រៃ	Tean Prey	150304
15030412	កប៉ាស់លើ	Kapas Leu	150304
15030501	ភូមិទី១	Phum Ti Muoy	150305
15030502	ភូមិទី២	Phum Ti Pir	150305
15030503	ភូមិទី៣	Phum Ti Bei	150305
15030504	ភូមិទី៤	Phum Ti Buon	150305
15030505	ភូមិទី៥	Phum Ti Pram	150305
15030601	ចេកចៅ	Chek Chau	150306
15030602	ពោធិកុដិ	Pou Kod	150306
15030603	កំពង់ឡ	Kampong La	150306
15030604	មាត់ព្រៃ	Moat Prey	150306
15030605	ពោធិរបង	Pou Robang	150306
15030606	រលួសកណ្ដាល	Roluos Kandal	150306
15030607	រលួសខាងកើត	Roluos Khang Kaeut	150306
15030608	ស្នារាជ	Sna Reach	150306
15030701	ទទឹង	Totueng	150307
15030702	ដូង	Doung	150307
15030703	ផ្សារ	Phsar	150307
15030704	ត្រពាំងរំដេញ	Trapeang Rumdenh	150307
15030705	ត្រពាំងស្មាច់	Trapeang Smach	150307
15030706	ឈើទាលខ្ពស់	Chheu Teal Khpos	150307
15030707	កំពង់លើ	Kampong Leu	150307
15030708	សំរោង	Samraong	150307
15030709	កណ្ដាល	Kandal	150307
15030710	ស្រែឫស្សី	Srae Ruessei	150307
15030711	ក្រឡាញ់	Kralanh	150307
15030801	អូរអាចម៍កុក	Ou Ach Kok	150308
15030802	ក្រាំងធំ	Krang Thum	150308
15030803	ថ្នឹង	Thnoeng	150308
15030804	ពុទ្ទ្រាម	Puttream	150308
15030805	ដូងជួរ	Doung Chuor	150308
15030806	អូរតាប្រុក	Ou Ta Prok	150308
15030807	ចុងខ្លុង	Chong Khlong	150308
15030808	អូរសណ្ដាន់	Ou Sandan	150308
15030901	ស្នាអន្សា	Sna Ansa	150309
15030902	ក្រាំងវែង	Krang Veaeng	150309
15030903	បេង	Beng	150309
15030904	ជីចេះ	Chi Cheh	150309
15030905	វាលវង់	Veal Vong	150309
15030906	សារវ័ន	Sarovoan	150309
15030907	ស្វាយស	Svay Sa	150309
15030908	ថ្មី	Thmei	150309
15030910	អន្សក្ដាម	Ansa Kdam	150309
15030911	កំពង់ប្រាក់	Kampong Prak	150309
15031001	កំរែង	Kamraeng	150310
15031002	ត្រពាំងស្នួល	Trapeang Snuol	150310
15031003	អន្សាចំបក់	Ansa Chambak	150310
15031004	ទួលអណ្ដែត	Tuol Andaet	150310
15031005	បឹងស្មុក	Boeng Smok	150310
15031006	អូរចាន់	Ou Chan	150310
15031101	ព្រៃខ្លា	Prey Khla	150311
15031102	ក្របី ស	Krabei Sa	150311
15031103	បង្គងឃ្មុំុ	Bangkong Khmum	150311
15031104	ដងទឹកលាច	Dang Tuek Leach	150311
15031105	ចំបក់ធំ	Chambak Thum	150311
15031106	ត្បែងជ្រុំ	Tbaeng Chrum	150311
15031107	ត្រាំ	Tram	150311
15031108	ជ័រម្គាន	Choar Mkean	150311
15031109	បឹងវាល	Boeng Veal	150311
15031111	កណ្ដាល	Kandal	150311
15031112	ឈើទាល	Chheu Teal	150311
15031113	តាកែវលើ	Ta Kaev Leu	150311
15031114	សែនពេន	Saen Pen	150311
15031115	ដំបូក១០០	Dambouk 100	150311
15040101	អូររំចង់	Ou Rumchang	150401
15040102	បាក់ចិញ្ចៀន	Bak Chenhchien	150401
15040103	ក្របៅជ្រុំ	Krabau Chrum	150401
15040104	ចាន់សេរី	Chan Serei	150401
15040105	ទួលពង្រ	Tuol Pongro	150401
15040106	អូរឬស្សី	Ou Ruessei	150401
15040107	កំពង់ខ្ទុម	Kampong Khtom	150401
15040108	ស្រែជង	Srae Chong	150401
15040109	ដំណាក់អំពិល	Damnak Ampil	150401
15040201	លាច	Leach	150402
15040202	ពេជបាន	Pech Ban	150402
15040203	បោះពួយ	Baoh Puoy	150402
15040204	ស្បូវរីក	Sbov Rik	150402
15040205	ប៉ែន	Paen	150402
15040206	បាក់ត្រកួន	Bak Trakuon	150402
15040207	ក្រូចឆ្មារ	Krouch Chhmar	150402
15040208	តានុក	Ta Nuk	150402
15040301	កោះស្វាយ	Kaoh Svay	150403
15040302	តាសាស់	Ta Sas	150403
15040303	ក្រញាំ	Kranham	150403
15040304	ព្រៃកន្លង់	Prey Kanlang	150403
15040305	ថ្លុកដង្កោ	Thlok Dangkao	150403
15040306	បត់រំដួល	Bat Rumduol	150403
15040307	កណ្ដាល	Kandal	150403
15040308	ផ្ទះរុង	Phteah Rung	150403
15040309	ដំណាក់កន្សែង	Damnak Kansaeng	150403
15040310	ស្ដុកខ្ទុំ	Sdok Khtum	150403
15040311	ព្រហស្បតិ៍ក្បាល	Prohoas Kbal	150403
15040312	ជង្រុក	Chongruk	150403
15040313	ជ្រៃក្រឹម	Chrey Kroem	150403
15040402	អូរស្រាវ	Ou Srav	150404
15040403	កំពែង	Kampeaeng	150404
15040404	ព្រងិល	Prongil	150404
15040405	អូរបាក់ត្រា	Ou Bak Tra	150404
15040407	សំរោងយា	Samraong Yea	150404
15040408	ស្វាយប៉ាក	Svay Pak	150404
15040501	ព្រៃស្មាច់	Prey Smach	150405
15040502	ព្រៃខ្លុង	Prey Khlong	150405
15040503	មល់	Mol	150405
15040504	វាលវង់	Veal Vong	150405
15040601	គល់ទទឹង	Kol Totueng	150406
15040602	សន្ទ្រែ	Santreae	150406
15040603	ក្សេត្របូរី	Ksetr Bourei	150406
15040604	ស្រែពពាយ	Srae Popeay	150406
15040701	ព្រែក ១	Preaek Muoy	150407
15040702	ព្រែក ២	Preaek Pir	150407
15040703	ព្រែក ៣	Preaek Bei	150407
15040704	តាដេះ	Ta Deh	150407
15040705	អូរហេង	Ou Heng	150407
15040706	សំរោង ១	Samraong Muoy	150407
15040707	សំរោង ២	Samraong Pir	150407
15040708	អូរព្រាល	Ou Preal	150407
15040709	វាល	Veal	150407
15040710	អង្គ្រង	Angkrong	150407
15040711	រវៀង	Rovieng	150407
15040712	អន្លង់ប៉ែន	Anglong Paen	150407
15050101	លាវ	Leav	150501
15050102	អូររកា	Ou Roka	150501
15050103	អូរតូង	Ou Tong	150501
15050104	ដូនអី	Doun Ei	150501
15050105	ក្ដីខ្វាវ	Kdei Khvav	150501
15050106	កំពង់ស្ទោង	Kampong Stoung	150501
15050107	ស្វាយមាស	Svay Meas	150501
15050109	ទួលគ្រួស	Tuol Kruos	150501
15050301	ពោធិ៍តាគួយ	Pou Ta Kuoy	150503
15050302	ព្រែកស្ដី	Preaek Sdei	150503
15050303	លលកស	Lolok Sa	150503
15050304	កោះ	Kaoh	150503
15050305	ផ្សារលើ	Phsar Leu	150503
15050306	វត្ដលួង	Voat Luong	150503
15050307	ជំរុំសៀម	Chumrum Siem	150503
15050308	ដប់បាត	Dab Bat	150503
15050309	ដំណាក់អំពិល	Damnak Ampil	150503
15050310	ខ្មារ	Khmar	150503
15050401	ពាលញែក ១	Peal Nheaek Muoy	150504
15050402	ពាលញែក ២	Peal Nheaek Pir	150504
15050403	ក្បាលហុង	Kbal Hong	150504
15050404	ដង្គារ	Dangkear	150504
15050405	ចំការចេកខាងជើង	Chamkar Chek Khang Cheung	150504
15050406	ចំការចេកខាងត្បូង	Chamkar Chek Khang Tboung	150504
15050407	អូរស្ដៅ	Ou Sdau	150504
15050408	ត្នោតទ្រេត	Tnaot Tret	150504
15050409	គក	Kok	150504
15050410	រ៉ា	Ra	150504
15050501	បាក់រទេះ	Bak Roteh	150505
15050502	ដូងជ្រុំ	Doung Chrum	150505
15050503	ប្រឡាយធំ	Pralay Thum	150505
15050504	ស្ពានថ្ម	Spean Thma	150505
15050505	មាន់ចែ	Moan Chae	150505
15050506	សាលាគំរូ	Sala Kumru	150505
15050507	ក្រាំងតាសែន	Krang Ta Saen	150505
15050508	ស្រះស្រង់	Srah Srang	150505
15050601	ពោធិ៍អណ្ដោត	Pou Andaot	150506
15050602	ព្រៃឱម៉ាល់	Prey Aomal	150506
15050603	ទួលម្កាក់	Tuol Mkak	150506
15050604	ថ្នល់បំបែក	Thnal Bambaek	150506
15050605	ស្ពានថ្ម	Spean Thma	150506
15050606	ឆ្លងកាត់	Chhlang Kat	150506
15050607	ស្ទឹងតូច	Stueng Touch	150506
15050608	រលាប	Roleab	150506
15050609	សូរិយាលើ	Souriya Leu	150506
15050610	សូរិយាក្រោម	Souriya Kraom	150506
15050611	ថ្នល់ជប៉ុន	Thnal Chopon	150506
15050612	ព្រែកត្នោត	Preaek Tnaot	150506
15050613	អូរថ្កូវ	Ou Thkov	150506
15050701	ស្ថានីយ៍	Sthani	150507
15050702	ក្រាំងពភ្លាក់	Krang Pophleak	150507
15050703	ត្រាង	Trang	150507
15050704	ស្វាយអាត់	Svay At	150507
15050705	អូរស្ដៅ	Ou Sdau	150507
15050801	អូរបាក្រងលើ	Ou Ba Krang Leu	150508
15050802	អូរបាក្រងក្រោម	Ou Ba Krang Kraom	150508
15050803	អូរបាក្រងកណ្ដាល	Ou Ba Krang Kandal	150508
15050804	កែវសុវណ្ណលើ	Kaev Sovann Leu	150508
15050805	កែវសុវណ្ណក្រោម	Kaev Sovann Kraom	150508
15050806	តាកុយ	Ta Koy	150508
15050807	ក្បាលហុង	Kbal Hong	150508
15050808	បណ្ដុះសណ្ដែក	Bandoh Sandaek	150508
15050809	ឥស្លាម	Eslam	150508
15050810	បន្ទាយដីលើ	Banteay Dei Leu	150508
15050811	បន្ទាយដីក្រោម	Banteay Dei Kraom	150508
15050812	កែវមុនី	Kaev Muni	150508
15060101	អូរសោម	Ou Saom	150601
15060102	កណ្ដាល	Kandal	150601
15060103	ឆាយលូក	Chhay Louk	150601
15060104	គៀនជង្រុក	Kien Chongruk	150601
15060201	ក្រពើពីរលើ	Krapeu Pir Leu	150602
15060202	ក្រពើពីរក្រោម	Krapeu Pir Kraom	150602
15060203	សំឡាញ	Samlanh	150602
15060301	កណ្ដាល	Kandal	150603
15060302	ក្រាំងរងៀង	Krang Rongieng	150603
15060303	ចំការជ្រៃខាងជើង	Chamka Chrey Khang Cheung	150603
15060304	ចំការជ្រៃខាងត្បូង	Chamka Chrey Khang Tbong	150603
15060305	ដីក្រហម	Dei Kraham	150603
15060401	ឈើទាលជ្រុំ	Chheu Teal Chrum	150604
15060402	ផ្ចឹកជ្រុំ	Pchoek Chrum	150604
15060403	ស្ទឹងថ្មី	Stueng Thmei	150604
15060404	ប្រម៉ោយ	Pramaoy	150604
15060405	ទំព័រ	Tumpoar	150604
15060501	ឯកភាព	Aekakpheap	150605
15060502	កណ្ដាល	Kandal	150605
15060503	សង្គមថ្មី	Sangkum Thmei	150605
16010101	ម៉ាលិក	Malik	160101
16010102	កាតែ	Katae	160101
16010103	កាហល	Ka Hal	160101
16010104	លោម	Laom	160101
16010301	កាជូត	Ka Chut	160103
16010302	ណាយ	Nay	160103
16010303	មុយ	Muy	160103
16010304	ពែង	Peaeng	160103
16010305	ចង	Chang	160103
16010306	តាង៉ា	Ta Nga	160103
16010307	ចាយ	Chay	160103
16010308	កែត	Kaet	160103
16010309	តាំងជិ	Tang Chea	160103
16010310	ដាល	Dal	160103
16010311	តាំងសេ	Tang Se	160103
16010312	ញ៉ាង	Nhang	160103
16010401	តាឡាវ	Ta Lav	160104
16010402	អ៊ីន	Inn	160104
16010403	កាណាត	Ka Nat	160104
16010404	កាក់	Kak	160104
16010405	តាណង	Ta Nang	160104
16020101	ភូមិ ១	Phum Muoy	160201
16020102	ភូមិ ២	Phum Pir	160201
16020103	ភូមិ ៣	Phum Bei	160201
16020104	ភូមិ ៤	Phum Buon	160201
16020201	ជ័យជំនះ	Chey Chumnas	160202
16020203	៧មករា	7 Makara	160202
16020208	ថ្មី	Thmei	160202
16020209	អភិវឌ្ឍន៍	Akpiwat	160202
16020210	អូរមៀត	Ou Romeat	160202
16020301	ឡូន	Loun	160203
16020302	ភ្នំ	Phnum	160203
16020303	សិល	Sel	160203
16020304	ឡាប៉ូ	La Pou	160203
16020305	ជ្រី	Chri	160203
16020401	ទេសអន្លុង	Tes Anlung	160204
16020402	អូរកន្សែង	Ou Konsaeng	160204
16020403	ភ្នំស្វាយ	Phnom Svay	160204
16020404	អូរកន្តិល	Ou Kontil	160204
16020405	ថ្មដា	Tmar Da	160204
16030101	លើតូច	Leu Touch	160301
16030102	សាលា	Sala	160301
16030103	កាចក់	Ka Chak	160301
16030104	កក់	Kak	160301
16030105	យឺន	Yeun	160301
16030106	ជ្រុង	Chrung	160301
16030201	លើហន់	Leu Han	160302
16030202	លើឃួន	Leu Kuon	160302
16030203	គ្រៀង	Krieng	160302
16030204	ទៀន	Tien	160302
16030205	ប៉ាអរ	Pa Ar	160302
16030206	ប៉ាឡែ	Pa Lae	160302
16030207	រ៉យ	Ray	160302
16030208	ជ្រុង	Chrung	160302
16030209	សាលាវ	Sa Leav	160302
16030301	ត្រុំ	Trom	160303
16030302	ស៊ូ	Su	160303
16030303	ញ៉ល	Nhol	160303
16030304	ខ្មាំង	Khmang	160303
16030305	ភូមិមួយ	Phum Muoy	160303
16030401	លុងឃុង	Lung Khung	160304
16030402	ប៉ាអរ	Pa Ar	160304
16030403	ប៉ាយ៉ាង	Pa Yang	160304
16030404	ជ្រាក	Chreak	160304
16030501	យ៉ាសោម	Ya Som	160305
16030502	ស៊ើង	Saeung	160305
16030503	ចែត	Chaet	160305
16030504	គ្លិ	Kli	160305
16030505	យ៉ែម	Yaem	160305
16030506	ស្មាច់	Smach	160305
16030601	ទូយ	Tuy	160306
16030602	កប	Kab	160306
16030603	លូត	Lut	160306
16030604	ប៉ាណល	Pa Nal	160306
16040101	ស្រែពកធំ	Srae Pok Thum	160401
16040102	ស្រែពកតូច	Srae Pok Touch	160401
16040103	នាងដី	Neang Dei	160401
16040201	ភូមិ ១	Phum Muoy	160402
16040202	ភូមិ ២	Phum Pir	160402
16040203	ភូមិ ៣	Phum Bei	160402
16040301	តាអងកាតេ	Ta Ang Ka Te	160403
16040302	តាអងប៉ុក	Ta Ang Pok	160403
16040303	ទុស	Tus	160403
16040304	សិក	Sec	160403
16040305	តាកាប់	Ta Kab	160403
16040401	តឺន	Teun	160404
16040402	ឡាអិន	La En	160404
16040403	តាហឺយ	Ta Heuy	160404
16040404	កាំបាក់	Kam Bak	160404
16040501	ភូមិ ១	Phum Muoy	160405
16040502	ភូមិ ២	Phum Pir	160405
16040503	ភូមិ ៣	Phum Bei	160405
16040504	ភូមិ ៤	Phum Buon	160405
16040505	ភូមិ ៥	Phum Pram	160405
16040601	ភូមិ ១	Phum Muoy	160406
16040602	ភូមិ ២	Phum Pir	160406
16040603	ភូមិ ៣	Phum Bei	160406
16050101	អូរកាន	Ou Kan	160501
16050102	ស្រែឈូក	Srae Chhuk	160501
16050103	សាមខា	Sam Kha	160501
16050104	ដីឡូតិ៍	Dei Lou	160501
16050105	ថ្មី	Thmei	160501
16050106	លំផាត់	Lumphat	160501
16050201	សាយ៉ស់	Sayas	160502
16050202	កាឡែង	Ka Laeng	160502
16050203	កាណាងកិត	Ka Nang Ket	160502
16050301	កាំផ្លិញ	Kam Phlenh	160503
16050302	កាទឹង	Ka Tueng	160503
16050303	កាទៀង	Ka Tieng	160503
16050304	កាលង	Ka Lorng	160503
16050401	កាទៀង	Ka Tieng	160504
16050402	កាចាញ	Ka Chanh	160504
16050501	អ៊ុល	Ul	160505
16050502	ព្រួក	Pruok	160505
16050503	បាតាង	Ba Tang	160505
16050504	ចាងរ៉ា	Chang Ra	160505
16050601	ថ្មី	Thmei	160506
16050602	ប៉ា តត់	Pa Tat	160506
16050603	កែងសាន់	Kaeng Sann	160506
16050604	សាមុត្រលើ	Samot Leu	160506
16050605	ពម	Pom	160506
16050606	ណងហៃ	Nang Hai	160506
16050607	សាមុត្រក្រោម	Samot Kraom	160506
16060101	ចាអ៊ុងកេត	Cha Ung Ket	160601
16060102	ចាអ៊ុងចាន់	Char Ung Chan	160601
16060103	ធួយអំពិល	Thuoy Ampil	160601
16060104	ធួយទុំ	Thuoy Tum	160601
16060105	ចាអ៊ុងកៅ	Cha Ung Kau	160601
16060201	ម៉ាស	Mas	160602
16060202	កាន់ឈឺង	Kan Chheung	160602
16060203	ក្រេះ	Kreh	160602
16060204	តាង៉ាច	Ta Ngeach	160602
16060205	ស្វាយ	Svay	160602
16060206	ខ្មែង	Khmaeng	160602
16060207	ក្រឡា	Krala	160602
16060208	កងកុយ	Kang Koy	160602
16060301	ប៉ាជន់ធំ	Pa Chon Thum	160603
16060302	ប៉ាអរ	Pa Ar	160603
16060303	អូម	Oum	160603
16060304	ក្រូច	Krouch	160603
16060401	កាឡៃ ១	Kalai Muoy	160604
16060402	កាឡៃ ២	Kalai Pir	160604
16060403	កាឡៃ ៣	Kalai Bei	160604
16060501	អូរជុំ	Ou Chum	160605
16060502	ថារ៉ងជង	Tharang Chong	160605
16060503	ថារ៉ងស្វាយ	Tharang Svay	160605
16060504	ល្អឺនក្រែន	L'eun Kraen	160605
16060505	ល្អឺនជង	L'eun Chong	160605
16060506	តងប្លេង	Tang Pleng	160605
16060507	តាកាម៉ាល់	Ta Kamal	160605
16060508	ល្អឺនកាំងមីស	L'eun Kang Mis	160605
16060601	កាម៉ែន	Ka Meaen	160606
16060603	ប្រាក់	Prak	160606
16060604	បរញ៉ុក	Bar Nhu	160606
16060605	ពីង	Ping	160606
16060701	ល្អក់	L'ak	160607
16060702	ក្រលង	Kralong	160607
16060703	គោក	Kouk	160607
16060704	កាំ	Kam	160607
16060705	ភូមិ ២	Phum Pir	160607
16070101	ទុង	Tung	160701
16070102	ដេះ	Des	160701
16070103	ប្លរ	Plor	160701
16070104	តាកុកព្នង	Ta Kok Pnong	160701
16070105	តាកុកច្រាយ	Ta Kok Chray	160701
16070106	ព្រិល	Pril	160701
16070201	ឡែ	Le	160702
16070202	កាទេ	Ka Te	160702
16070203	ត្រាង	Trang	160702
16070204	អ៊ុន	Un	160702
16070301	ប៉ក់ធំ	Pak Thum	160703
16070302	ប៉់ក់តូច	Pak Touch	160703
16070303	ប៉ក់ពោរ	Pak Por	160703
16070304	ឡុំ	Lom	160703
16070401	ប្លង់	Plang	160704
16070402	គងធំ	Kong Thum	160704
16070403	ប៉ាអរ	Pa Ar	160704
16070404	គងយុ	Kong Yu	160704
16070501	ប៉ាតាង	Pa Tang	160705
16070502	ភិ	Phi	160705
16070503	ប៉ាដល	Pa Dal	160705
16070601	សោមកានិញ	Saom Ka nihn	160706
16070602	សោមត្រក	Saom Trak	160706
16070603	សោមគល់	Saom Kol	160706
16070701	តេនង៉ល	Ten Ngol	160707
16070702	ពាក់	Peak	160707
16070703	ទេនសុស	Ten Soh	160707
16070704	ដរ	Dar	160707
16070705	សំ	Sam	160707
16080102	ចាន់	Chan	160801
16080103	ជួយ	Chuoy	160801
16080104	តាបូក	Ta Bouk	160801
16080105	ប៉ាងគិត	Pangkit	160801
16080106	សញ	Sanh	160801
16080107	កិគួង	Ki Kuong	160801
16080108	រៀងវិញ	Rieng Vinh	160801
16080109	ភ្លឺធំ	Phlueu Thum	160801
16080110	ភ្លឺតូច	Phlueu Touch	160801
16080111	តាវែង	Ta Veaeng	160801
16080201	ទំពួនរឺងធំ	Tumpuon Reung Thum	160802
16080202	ទុន	Tun	160802
16080203	កោះប៉ុង	Kaoh Pong	160802
16080204	សៀងសាយ	Sieng Say	160802
16080205	ផ្យ៉ាង	Phyang	160802
16080206	កិគួង	Ke Kuong	160802
16080207	តាង៉ាច	Ta Ngach	160802
16080208	ផាវ	Phav	160802
16080209	ទំពួនរឺងតូច	Tumpuon Reung Touch	160802
16080210	វៀងចាន់	Vieng Chan	160802
16090101	បានប៉ុង	Ban Pong	160901
16090102	បានហ្វាំង	Ban Phang	160901
16090301	ហាត់ប៉ក់	Hat Pak	160903
16090302	វើនហយ	Veun Hay	160903
16090303	ឡាំប៉ាត់	Lam Pat	160903
16090401	កាចូនលើ	Ka Choun Leu	160904
16090402	កាចូនក្រោម	Ka Choun Kraom	160904
16090403	វ៉ង	Vorng	160904
16090404	វ៉ាយ	Vay	160904
16090405	ទៀមលើ	Tiem Leu	160904
16090406	កាឡឹម	Ka Loem	160904
16090501	ប៉ាតឹង	Pa Toeng	160905
16090502	ឡាំងអាវ	Lang Av	160905
16090503	ប៉ាហយ	Pa Hay	160905
16090601	កោះពាក្យ	Kaoh Peak	160906
16090602	ផាក់ណាម	Phak Nam	160906
16090603	ឃួន	Khuon	160906
16090701	ឡាឡៃ	La Lai	160907
16090702	រ៉ក	Rak	160907
16090703	ឡាម៉ឺយ	La Meuy	160907
16090704	ត្រាក់	Trak	160907
16090801	ប៉ាកាឡាន់	Pa Kalan	160908
16090802	កំពង់ចាម	Kampong Cham	160908
16090901	ភ្នំកុកឡាវ	Phnum Kok Lav	160909
16090902	ភ្នំកុកព្រៅ	Phnum Kok Prov	160909
16090903	កាឡៃតាវ៉ង	Kalai Ta Vorng	160909
16090904	កាឡៃសាពូន	Kalai Sapun	160909
16090905	ទៀមក្រោម	Tiem Kraom	160909
16091001	វើនសៃ	Veun Sai	160910
16091002	បាក់កែ	Bak Kae	160910
16091003	អ៊ីទូប	I Tub	160910
16091004	ថ្មី	Thmei	160910
16091005	កាឡាន់	Ka Lan	160910
16091006	កងណក	Kang Nak	160910
17010101	ប្រាសាទ	Prasat	170101
17010103	អានូក	Anuk	170101
17010104	ព្រៃល្វៃ	Prey Lvey	170101
17010105	ព្រៃចេង	Prey Cheng	170101
17010106	ក្បាលចាម	Kbal Cham	170101
17010107	គោកល្វា	Kouk Lvea	170101
17010108	ចាររកា	Char Roka	170101
17010109	ថ្នល់	Thnal	170101
17010110	ឈូក	Chhuk	170101
17010111	គោកក្បាត់	Kouk Kbat	170101
17010112	តាទយ	Ta Toy	170101
17010113	ព្រៃទទឹង	Prey Totueng	170101
17010114	ដូនស្វា	Doun Sva	170101
17010115	មាជា	Mea Chea	170101
17010116	គោកថ្នល់	Kouk Thnal	170101
17010117	ខ្លុង	Khlong	170101
17010118	ថ្មី	Thmei	170101
17010119	គោកធ្នង់	Kouk Thnong	170101
17010120	កត្រកៀត	Ka Trakiet	170101
17010201	រការ	Rokar	170102
17010202	បត់	Bat	170102
17010203	គោកយាង	Kouk Yeang	170102
17010204	បុស្សល្ហុង	Bos Lhong	170102
17010205	បេង	Beng	170102
17010206	ខ្ចាស់	Khchas	170102
17010207	ដូនពេង	Doun Peng	170102
17010208	រំដួលថ្មី	Rumduol Thmei	170102
17010301	ទំលាប់	Tumloab	170103
17010302	ខ្ចារ	Khchar	170103
17010303	គោកដូងថ្មី	Kouk Doung Thmei	170103
17010304	គោកភ្នៅ	Kouk Pnov	170103
17100605	វាល	Veal	171006
17010305	គោកត្របែក	Kouk Trabaek	170103
17010306	អន្ទិតសុខ	Antit Sokh	170103
17010307	រកា	Roka	170103
17010308	គោកក្រោល	Kouk Kraol	170103
17010309	កប្ដៀក	Ka Bdiek	170103
17010310	ចេកក្បូរ	Chek Kbour	170103
17010311	គោកស្នួល	Kouk Snuol	170103
17010312	ប្រាសាទត្រាវ	Prasat Trav	170103
17010313	កំប្លើប	Kamblaeub	170103
17010314	ដូនអែម	Doun Aem	170103
17010315	គោកដូងចាស់	Kouk Doung Chas	170103
17010316	បុះក្រឡុក	Bos Kralok	170103
17010317	អូរគោល	Ou Koal	170103
17010401	ខ្វាវ	Khvav	170104
17010402	ខាន់សរ	Khan Sa	170104
17010403	គោល	Koul	170104
17010404	អំពិលធ្នង់	Ampil Thnong	170104
17010405	ដូនមៀវ	Doun Miev	170104
17010406	តាគួយ	Ta Kuoy	170104
17010407	ព្រៃអារ	Prey Ar	170104
17010501	រមៀត	Romiet	170105
17010502	ល្បើក	Lbaeuk	170105
17010503	សំបួរ	Sambuor	170105
17010504	គោកថ្មី	Kouk Thmei	170105
17010505	ទន្លេស	Tonle Sa	170105
17010506	កុក	Kok	170105
17010507	ពង្រ	Pongro	170105
17010508	នគរភាស១	Nokor Pheas Muoy	170105
17010509	នគរភាស២	Nokor Pheas Pir	170105
17010510	ជំពូង	Tumpung	170105
17010601	រាជជន្ទល់	Reach Chontol	170106
17010602	រវៀងថ្មី	Rovieng Thmei	170106
17010603	ស្រែខ្វាវ	Srae Khvav	170106
17010604	គោកក្នាំង	Kouk Knang	170106
17010605	គោកចាស់	Kouk Chas	170106
17010606	ជំនុំរាជ្យ	Chumnum Reach	170106
17010607	ស្លាត	Slat	170106
17010608	ស្រែប្រាំង	Srae Prang	170106
17010609	រណ្ដាស	Rundas	170106
17010610	រលំ	Rolum	170106
17010611	ទឹកថ្លា	Tuek Thla	170106
17010701	ថ្នល់	Thnal	170107
17010702	ភ្នៅ	Pnov	170107
17010703	ម្កាក់	Mkak	170107
17010704	គោកចាន់	Kouk Chan	170107
17010705	ក រលំ	Ka Rolum	170107
17010706	ទំពូង	Tumpung	170107
17010707	ប្រាំដំឡឹង	Pram Damloeng	170107
17010708	តាលាវ	Ta Leav	170107
17010709	បាយម៉ាត	Bay Mat	170107
17010710	ត្រពាំងភ្លោះ	Trapeang Phluoh	170107
17010711	តាសោម	Ta Saom	170107
17010712	គោកថ្មី	Kouk Thmei	170107
17010713	ស្វាយជុំ	Svay Chum	170107
17020101	ត្រពាំងទូក	Trapeang Touk	170201
17020102	ជប់	Chub	170201
17020103	ប្រាសាទ	Prasat	170201
17020104	ទ័ពស្វាយ	Toap Svay	170201
17020105	ពងទឹក	Pong Tuek	170201
17020201	លាងដៃ	Leang Dai	170202
17020202	ដូនឪ	Daun Ov	170202
17020203	ភ្លង់	Phlong	170202
17020204	តាប្រុក	Ta Prok	170202
17020205	សំរោង	Samraong	170202
17020206	ត្រពាំងស្វាយ	Trapeang Svay	170202
17020207	បំពេញរាជ្យ	Bampenh Reach	170202
17020208	ស្ពានថ្មី	Spean Thmei	170202
17020301	ពាក់ស្នែងថ្មី	Peak Sneng Thmei	170203
17020302	ពាក់ស្នែងចាស់	Peak Sneng Chas	170203
17020303	លៀប	Leab	170203
17020304	ខ្ទីង	Khting	170203
17020305	សណ្ដាន់	Sandan	170203
17020306	ជប់សោម	Chub Saom	170203
17020401	គោកកក់	Kok Kak	170204
17020402	ស្វាយចេក	Svay Chek	170204
17020403	កណ្តោល	Kandol	170204
17020404	តាត្រាវ	Ta Trav	170204
17020405	បុស្សតាត្រាវ	Bos Ta Trav	170204
17020406	ព្រះគោថ្មី	Preah Ko Thmei	170204
17030101	បន្ទាយស្រី	Banteay Srei	170301
17030102	ខ្នារ	Khnar	170301
17030103	ប្រីយ៍	Prei	170301
17030104	សណ្ដាយ	Sanday	170301
17030105	កកោះជ្រុំ	Karkoh Chrum	170301
17030106	ទួលក្រឡាញ់	Tuol Kralanh	170301
17030201	ខ្នារង្វាស	Khnar Rongveas	170302
17030202	កំព្រហ្ម	Kom Prum	170302
17030203	ឃុនរាម	Khun Ream	170302
17030204	ឈូកស	Chhouk Sar	170302
17030205	ទួលគ្រួស	Toul Krus	170302
17030206	ត្រពាំងថ្ម	Trapeang Thmar	170302
17030207	ពើងឆ័ត្រ	Poeung Chhat	170302
17030301	ព្រះដាក់	Preah Dak	170303
17030302	ថ្នល់បណ្ដោយ	Thnal Bandaoy	170303
17030303	តាត្រៃ	Ta Trai	170303
17030304	ថ្នល់ទទឹង	Thnal Totueng	170303
17030305	តាកុះ	Ta Koh	170303
17030306	អូរទទឹង	Ou Totueng	170303
17030401	រំចេក	Rumchek	170304
17030402	សាលាក្រវ៉ាន់	Sala Kravan	170304
17030403	រវៀងតាទុំ	Rorveang Tatum	170304
17030501	តាឯក	Ta Aek	170305
17120607	ធ្លក	Thlok	171206
17030502	ត្មាតពង	Tmat Pong	170305
17030503	តានី	Ta Ni	170305
17030504	រុន	Run	170305
17030505	ជ័យ	Chey	170305
17030506	ថ្នល់	Thnal	170305
17030507	ស្រែចង្ហូត	Srae Changhout	170305
17030601	ត្បែងកើត	Tbaeng Kaeut	170306
17030602	ត្បែងលិច	Tbaeng Lech	170306
17030603	វត្ដ	Voat	170306
17030604	ស្រះខ្វាវ	Srah Khvav	170306
17030605	គូលែនថ្មី	Kulen Thmey	170306
17030606	ស្គន់	Skon	170306
17030607	ថ្មជល់	Thmar Chul	170306
17040101	ស្ដៅ	Sdau	170401
17040102	អន្លង់ព្រីងក្រោម	Anlong Pring Kraom	170401
17040103	អន្លង់ព្រីងលើ	Anlong Pring Leu	170401
17040104	តាគឹមក្រោម	Ta Kuem Kraom	170401
17040105	តាគឹមលើ	Ta Kuem Leu	170401
17040106	ត្រពាំងត្រស់	Trapeang Tras	170401
17040107	អន្លង់សំណរ	Anlong Samnar	170401
17040108	អន្លង់ឫស្សី	Anlong Ruessei	170401
17040109	ស្វាយតាដោក	Svay Ta Daok	170401
17040110	សំរោងធំ	Samraong Thum	170401
17040111	ចែកខ្សាច់លើ	Chaek Khsach Leu	170401
17040112	ចែកខ្សាច់ក្រោម	Chaek Khsach Kraom	170401
17040113	ល្បើក	Lbaeuk	170401
17040114	ព្រែកអង្គរថ្មី	Preaek Angkor Thmei	170401
17040115	មាត់ខ្លា	Moat Kla	170401
17040116	ស្ទឹងជ្រៅ	Steung Chrov	170401
17040201	កំពង់ស្នោលិច	Kampong Snao Lech	170402
17040202	សណ្ដាន់	Sandan	170402
17040203	ជីក្រែង	Chi Kraeng	170402
17040204	ព្រីង	Pring	170402
17040205	ស្រមរ	Sramar	170402
17040206	កំពង់	Kampong	170402
17040207	អន្លង់ត្នោត	Anlong Tnaot	170402
17040208	អន្លង់ចំបក់	Anlong Chambak	170402
17040209	បេង	Beng	170402
17040210	គរ	Kor	170402
17040211	តារាម	Ta Ream	170402
17040212	ភ្នៀត	Phniet	170402
17040213	បុសពក	Bos Pok	170402
17040214	កំពង់ស្នោកើត	Kampong Snao Kaeut	170402
17040301	រកា	Roka	170403
17040302	សាលា	Sala	170403
17040303	ស្លែង	Slaeng	170403
17040304	ចំបក់ធំ	Chambak Thum	170403
17040305	ច្រាំងខ្ពស់	Chrang Khpos	170403
17040306	អន្សងពង	Ansang Pong	170403
17040307	ត្រាចថ្មី	Trach Thmei	170403
17040308	ប្រាសាទ	Prasat	170403
17040309	រំលោង	Rumloung	170403
17040310	កំពង់ក្ដី១	Kampong Kdei Muoy	170403
17040311	កំពង់ក្ដី២	Kampong Kdei Pir	170403
17040312	ពោធិ៍សេរី	Pou Serei	170403
17040313	ពន្លឺព្រះផុស	Ponlueu Preah Phos	170403
17040314	សង្កែមានជ័យ	Sangkae Mean Chey	170403
17040315	តាពៀម	Ta Piem	170403
17040316	ត្រពាំងជ្រៃ	Trapeang Chrey	170403
17040401	អូរ	Ou	170404
17040402	ខ្វាវ	Khvav	170404
17040403	ព្រះធាតុ	Preah Theat	170404
17040404	ស្រោង	Sraong	170404
17040405	ក្រាំង	Krang	170404
17040406	ពោធិ៍រីង	Pou Ring	170404
17040407	រវៀង	Rovieng	170404
17040408	កំបោអរ	Kambor Or	170404
17040409	ចុងស្ពាន	Chong Spean	170404
17040410	ជ្រៃ	Chrey	170404
17040501	ថ្មី	Thmei	170405
17040502	ក្របីរៀល	Krabei Riel	170405
17040503	ប៉ាតត	Patat	170405
17040504	កកោះ	Kakaoh	170405
17040505	អន្លង់វិល	Anlong Vil	170405
17040506	កំពង់ម្កាក់	Kampong Mkak	170405
17040507	ត្រពាំងត្រាវ	Trapeang Trav	170405
17040508	ដូនរាជ្យ	Doun Reach	170405
17040509	តាទរ	Ta Tor	170405
17040510	ថ្នល់តាសិត	Thnal Ta Set	170405
17040511	ដូនសុខ	Doun Sokh	170405
17040512	គីឡូតាឈឹម	Kilou Ta Chhuem	170405
17040513	បេង	Beng	170405
17040514	បាក់អង្រុត	Bak Angrut	170405
17040515	បុស្សគរ	Bos Kor	170405
17040516	គោករមាស	Kouk Romeas	170405
17040517	បឹងធំ	Boeng Thum	170405
17040518	ទ័ពសៀម	Toap Siem	170405
17040601	ខ្លាឃ្មុំ	Khla khmum	170406
17040602	សាលា	Sala	170406
17040603	ត្រពាំងវែង	Trapeang Veaeng	170406
17040604	សង្កែ	Sangkae	170406
17040605	គោកធ្លក	Kouk Thlok	170406
17040606	ព្រៃធំ	Prey Thum	170406
17040607	ថ្លុកស្មាច់	Thlok Smach	170406
17040608	ស្លែងកោង	Slaeng Kaong	170406
17040609	ស្វាយពក	Svay Pok	170406
17040610	តាភ្ញា	Ta Phnhea	170406
17040611	ថ្នល់	Thnal	170406
17040612	តាលៀន	Ta Lien	170406
17040613	ម្កាក់	Mkak	170406
17040701	តាអុង	Ta Ong	170407
17040702	គោកអំពិល	Kouk Ampil	170407
17040703	រំជៃច្រុះ	Rumchey Chroh	170407
17040704	ថ្នល់	Thnal	170407
17040705	ក្នុង	Knong	170407
17040706	ព្រៃទទឹង	Prey Totueng	170407
17040707	ក្បាលក្ដួច	Kbal Kduoch	170407
17040708	បាឡាំង	Ballangk	170407
17040709	ចំបក់ខ្ពស់	Chambak Khpos	170407
17040710	រូងថ្មី	Rung Thmei	170407
17040711	ល្វែងឫស្សី	Lveaeng Ruessei	170407
17040712	តាងួន	Ta Nguon	170407
17040713	កកោះ	Kakaoh	170407
17040801	ពពេល	Popel	170408
17040802	ពង្រ១	Pongro Muoy	170408
17040803	ពង្រ២	Pongro Pir	170408
17040804	ថ្មី	Thmei	170408
17040805	សំបូរ	Sambour	170408
17040806	អូររូង	Ou Rung	170408
17040807	ពោធិ៍	Pou	170408
17040808	ជ័យបូរ	Chey Bour	170408
17040809	ផ្លុង	Phlong	170408
17040810	តាព័រ១	Ta Poar Muoy	170408
17040811	តាព័រ២	Ta Poar Pir	170408
17040812	អូរខ្លុង	Ou Khlong	170408
17040813	ដងផ្អាវ	Dang Ph'av	170408
17040901	ត្រពាំងភ្លោះ	Trapeang Phluoh	170409
17040902	ចេក	Chek	170409
17040903	គ្រាំង	Kreang	170409
17040904	ក្បាលដំរី	Kbal Damrei	170409
17040905	គំរូ	Kumru	170409
17040906	ស្វាយចេក	Svay Chek	170409
17040907	ដុបត្នោត	Dob Tnaot	170409
17040908	ស្រឡៅស្រោង	Sralau Sraong	170409
17040909	ព្រៃឆ្ការ	Prey Chhkar	170409
17040910	ល្អក់	LaOk	170409
17041001	សំរោងកញ្ចោច	Samraong Kanhchaoch	170410
17041002	បឹង	Boeng	170410
17041003	ស្ពានតូច	Spean Touch	170410
17041004	យាង	Yeang	170410
17041005	ឫស្សីលក	Ruessei Lok	170410
17041006	ទទឹងថ្ងៃ	Totueng Thngai	170410
17041007	ក្រូច	Kroch	170410
17041008	ត្រពាំងរុន	Trapeang Run	170410
17041101	ពាក់ស្ពា	Peak Spea	170411
17041102	អូរ	Ou	170411
17041103	ចក	Chak	170411
17041104	តាព្រុំ	Ta Prum	170411
17041105	ថ្នល់ដាច់	Thnal Dach	170411
17041106	ដំរីឆ្លង	Damrei Chhlang	170411
17041107	កន្សែង	Kansaeng	170411
17041108	ព្រៃប្រស់	Prey Prors	170411
17041109	ក្របៅ	Kra Bao	170411
17041201	ស្ពានត្នោត១	Spean Tnaot Muoy	170412
17041202	ស្ពានត្នោត២	Spean Tnaot Pir	170412
17041203	ចំរេះ	Chamreh	170412
17041204	ថ្នល់កែង	Thnal Kaeng	170412
17041205	ថ្នល់លោក	Thnal Louk	170412
17041206	ក្ងានពង	Kngan Pong	170412
17041207	រំដេង	Rumdeng	170412
17041208	ត្រពាំងវែង	Trapeang Veaeng	170412
17041209	តាយ៉ុន	Ta Yon	170412
17041210	ទទា	Totea	170412
17041211	ល្វា	Lvea	170412
17041212	សំរោង	Samraong	170412
17041213	អូរត្រាច	Ou Trach	170412
17041214	អូរក្រោម	Ou Kraom	170412
17041215	អូរលើ	Ou Leu	170412
17060101	ត្រាំកង់	Tram Kang	170601
17060102	ឈូករ័ត្ន	Chhuk Roat	170601
17060103	រុន	Run	170601
17060104	គោកត្នោត	Kouk Tnaot	170601
17060105	ខ្នាជោ	Khnar Chour	170601
17060106	ដំរីស្លាប់	Damrei Slab	170601
17060107	តាមាឃ	Ta Meakh	170601
17060108	ចន្លាស់ដៃ	Chanlas Dai	170601
17060109	ព្រះលាន	Preah Lean	170601
17060110	រលំស្វាយ	Rolum Svay	170601
17060111	កំបោរ	Kambaor	170601
17060112	ដូនកាយ	Doun Kay	170601
17060201	កំពង់ថ្កូវ១	Kampong Thkov Muoy	170602
17060202	កំពង់ថ្កូវ២	Kampong Thkov Pir	170602
17060203	ខ្សាច់	Khsach	170602
17060204	អូរថ្កូវ	Ou Thkov	170602
17060205	គោកដូង	Kouk Doung	170602
17060206	ដូរ្យដន្ដ្រី	Dour Dantrei	170602
17060207	ចំបក់ហែរ	Chambak Haer	170602
17060208	ភ្នំទ្រង់បាត	Phnum Trong Bat	170602
17060301	តាច្រែង	Ta Chraeng	170603
17060302	ត្រពាំងច្រាំង	Trapeang Chrang	170603
17060303	អូរក្រឡាញ់	Ou Kralanh	170603
17060304	កោះក្របៅ	Kaoh Krabau	170603
17060305	ក្រឡាញ់	Kralanh	170603
17060306	ពេជ្ជោរ	Pechchour	170603
17060307	សំពៅលូន	Sampov Lun	170603
17060401	គោកចំបក់	Kouk Chambak	170604
17060402	ព្រៃខ្យង	Prey Khyang	170604
17060403	រើល	Reul	170604
17060404	គោកថ្មី	Kouk Thmei	170604
17060405	ខ្នារជើង	Khnar Cheung	170604
17060406	ខ្នារត្បូង	Khnar Tboung	170604
17060501	រោងគោ	Roung Kou	170605
17060502	ព្រៃគាប	Prey Keab	170605
17060503	បុស្សធំ	Bos Thum	170605
17060504	តានី	Ta Ni	170605
17060505	កញ្ជន់ជ្រៅ	Kanhchon Chrov	170605
17060506	ខ្ជាយ	Khcheay	170605
17060507	ល្បើកប្រីយ៍	Lbaeuk Prei	170605
17060508	ល្បើក	Lbaeuk	170605
17060509	ឫស្សី	Ruessei	170605
17060601	គោកក្រូច	Kouk Krouch	170606
17060602	អន្លង់សារ	Anlong Sar	170606
17060603	ដំណាក់ខ្ចាស់	Damnak Khchas	170606
17060604	សំបួរ	Sambuor	170606
17060605	ឪម៉ាល់	Ovmal	170606
17060606	គោកចាស់	Kouk Chas	170606
17060607	អំពិល	Ampil	170606
17060608	សន្ថន	Santhan	170606
17060701	ច្រនៀង	Chranieng	170607
17060702	ព្រៃក្រឡាញ់	Prey Kralanh	170607
17060703	គោកកី	Kouk Kei	170607
17060704	គោកភ្ងាស	Kouk Phngeas	170607
17060705	គោកយាង	Kouk Yeang	170607
17060706	ស្មាច់	Smach	170607
17060707	អង្កោល	Angkaol	170607
17060708	ដំរីស្លាប់	Damrei Slab	170607
17060709	តាសុខ	Ta Sokh	170607
17060710	តាស្រី	Ta Srei	170607
17060711	ខ្សី	Khsei	170607
17060712	ស្វាយ	Svay	170607
17060713	ទ្រាស	Treas	170607
17060714	ក្រូច	Krouch	170607
17060715	ព្រៃថ្កូវ	Prey Thkov	170607
17060716	តាប៉ាង	Ta Pang	170607
17060801	ស្នួល	Snuol	170608
17060802	តាឡឹង	Ta Loeng	170608
17060803	សំរោង	Samraong	170608
17060804	តាពេជ	Ta Pech	170608
17060805	សង្កែ	Sangkae	170608
17060806	ព្រៃល្ងៀង	Prey Lngieng	170608
17060807	តាសែង	Ta Saeng	170608
17060808	ធាស្នា	Thea Sna	170608
17060809	តាយិន	Ta Yin	170608
17060901	ល្ហុង	Lhong	170609
17060902	ស្រណាល	Sranal	170609
17060903	គោកត្រុំ	Kouk Trom	170609
17060904	រំដេង	Rumdeng	170609
17060905	គំរូ	Kumru	170609
17060906	តាំងយូ	Tang Yu	170609
17060907	ទន្លាប់	Tonloab	170609
17060908	ស្លែង	Slaeng	170609
17060909	គោកចាស់	Kouk Chas	170609
17060910	ផ្លាំង	Phlang	170609
17060911	មានជ័យ	Mean Chey	170609
17060912	គោកត្នោត	Kouk Tnaot	170609
17060913	រវៀង	Rovieng	170609
17061001	ក្ដុល	Kdol	170610
17061002	ភ្នំតូច	Phnum Touch	170610
17061003	តាអាន	Ta An	170610
17061004	ថ្មី	Thmei	170610
17061005	តាឡឹង	Ta Loeng	170610
17061006	សំរោង	Samraong	170610
17061007	ទឹកជុំ	Tuek Chum	170610
17061008	ត្រពាំងឈូក	Trapeang Chhuk	170610
17061009	អន្លង់	Anlong	170610
17061010	សសៃពង	Sarsai Pong	170610
17070101	ស្វាយ	Svay	170701
17070102	សសរស្ដម្ភ	Sasar Sdam	170701
17070103	គោកកណ្ដាល	Kouk Kandal	170701
17070104	គោករុន	Kouk Run	170701
17070105	គោកចាស់	Kouk Chas	170701
17070106	ពង្រថ្មី	Pongro Thmei	170701
17070107	គោកព្នៅ	Kouk Pnov	170701
17070108	គោកជ្រៃ	Kouk Chrey	170701
17070109	ខ្ជាយ	Khcheay	170701
17070110	គោកត្នាត	Kouk Tnat	170701
17070111	ដំណាក់ស្លាញ	Damnak Slanh	170701
17070112	ប៉ាក់ប៉ាន់	Pak Pan	170701
17070113	ចាន់តាសាយ	Chan Ta Say	170701
17070114	ពង្រចាស់	Pongro Chas	170701
17070201	គោកព្នៅ	Kouk Pnov	170702
17070202	អន្ដង្គន់	Antangkon	170702
17070203	តាកាំ	Ta Kam	170702
17070204	ដូនកែវ	Doun Kaev	170702
17070205	ល្បើក	Lbaeuk	170702
17070206	ត្នោតជ្រុំ	Tnaot Chrum	170702
17070207	ប្រាសាទចារ្យ	Prasat Char	170702
17070208	គោកពោធិ៍	Kouk Pou	170702
17070209	ពាម	Peam	170702
17070210	តាស្នេហ៍	Ta Snae	170702
17070211	គោកថ្មី	Kouk Thmei	170702
17070212	រហាល	Rohal	170702
17070213	ដូនអុន	Doun On	170702
17070301	បង្កោង	Bangkaong	170703
17070302	ត្រពាំងវែង	Trapeang Veaeng	170703
17070303	ព្រៃយាង	Prey Yeang	170703
17070304	តាប៉ាង	Ta Pang	170703
17070305	ល្បើក	Lbaeuk	170703
17070306	គោកពោធិ	Kouk Pou	170703
17070307	ក្ដីរុន	Kdei Run	170703
17070401	កំភេម	Kamphem	170704
17070402	ព្រៃដង្ហើម	Prey Danghaeum	170704
17070403	ថ្មី	Thmei	170704
17070404	រកាយា	Roka Yea	170704
17070405	គោកឫស្សី	Kouk Ruessei	170704
17070406	គោកពោធិ	Kouk Pou	170704
17070407	ស្វាយចេក	Svay Chek	170704
17070408	ពាមតាអួរ	Peam Ta Uor	170704
17070501	ខ្នាត	Khnat	170705
17070502	ប្រឡាយ	Pralay	170705
17070503	គោកស្នួល	Kouk Snuol	170705
17070504	ត្រមេង	Trameng	170705
17070505	ស្វាយ	Svay	170705
17070506	ព្រៃធ្លក	Prey Thlok	170705
17070507	ជ្រលង	Chrolong	170705
17070508	គោកត្រាច	Kouk Trach	170705
17070509	អំពិលពាម	Ampil Peam	170705
17070510	បឹងខ្នារ	Boeng Khnar	170705
17070511	ព្រៃក្មេង	Prey Kmeng	170705
17070512	ទឹកថ្លា	Tuek Thla	170705
17070701	គំរូ	Kumru	170707
17070702	ដូនទ្រ	Doun Tro	170707
17070703	ស្ទឹងព្រះស្រុក	Stueng Preah Srok	170707
17070704	គោកស្រម៉	Kouk Srama	170707
17070705	ទួលរវៀង	Tuol Rovieng	170707
17070706	គោកថ្មី	Kouk Thmei	170707
17070707	ប្រហូត	Prohut	170707
17070708	ជ្រាស់	Chreas	170707
17070709	ល្វា	Lvea	170707
17070710	រកា	Roka	170707
17070711	ព្រះអង្គទ្រង់	Preah Angk Trong	170707
17070712	ស្នោ	Snao	170707
17070801	តាត្រាវ	Ta Trav	170708
17070802	មុខប៉ែន	Mukh Paen	170708
17070803	ត្រកៀត	Trakiet	170708
17070804	គោករាំង	Kouk Reang	170708
17070805	គោករុន	Kouk Run	170708
17070806	ស្វាហួល	Sva Huol	170708
17070901	ពោធិ	Pou	170709
17070902	ទ្រាយ	Treay	170709
17071001	ពួកចាស់	Puok Chas	170710
17071002	ប្រយុទ្ធ	Prayut	170710
17071003	គោកជួន	Kouk Chuon	170710
17071004	កំពង់តាយ៉ង	Kampong Ta Yang	170710
17071005	គោកស្រុក	Kouk Srok	170710
17071006	តាទក	Ta Tok	170710
17071007	គោកដូង	Kouk Doung	170710
17071008	គោកថ្មី	Kouk Thmei	170710
17071009	ពួកថ្មី	Puok Thmei	170710
17071010	ចំបក់ហែរ	Chambak Haer	170710
17071011	អូរតាប្រាក់	Ou Ta Prak	170710
17071101	ព្រៃជ្រូក	Prey Chruk	170711
17071102	កិត្ដិយស	Ketteyos	170711
17071103	ដូនតុក	Doun Tok	170711
17071104	ស្វាយចន្ទរ	Svay Chantor	170711
17071105	ប្រាសាទ	Prasat	170711
17071106	ផ្លាំង	Phlang	170711
17071107	ប្របម៉ៃ	Prab Mai	170711
17071108	ជ្រេស	Chres	170711
17071109	ប្រដាក់	Pradak	170711
17071110	ច្រនៀង	Chranieng	170711
17071111	តាមោក	Ta Mouk	170711
17071112	ពង្រ	Pongro	170711
17071201	គោកវាល	Kouk Veal	170712
17071202	ទំរឹង	Tumrueng	170712
17071203	រើល	Reul	170712
17071204	ត្រពាំងស្វាយ	Trapeang Svay	170712
17071205	ត្រពាំងឫស្សី	Trapeang Ruessei	170712
17071206	ព្រលឹត	Prolit	170712
17071207	ក្អែកទំ	K'aek Tum	170712
17071208	រំដួល	Rumduol	170712
17071209	ក្បាលក្រពើ	Kbal Krapeu	170712
17071210	ត្រពាំងធំ	Trapeang Thum	170712
17071211	គោកខ្នាំង	Kouk Khnang	170712
17071212	គោកត្រាច	Kouk Trach	170712
17071213	ស្រះ	Srah	170712
17071214	សំបួរ	Sambuor	170712
17071301	តាជេត	Ta Chet	170713
17071302	សំរោងយា	Samraong Yea	170713
17071303	អំពិល	Ampil	170713
17071304	ប្រាសាទ	Prasat	170713
17071305	ដូនស្វា	Doun Sva	170713
17071306	ព្រៃវែង	Prey Veaeng	170713
17071501	ចំបក់ស	Chambak Sa	170715
17071502	គោកដូង	Kouk Doung	170715
17071503	ស្វាយ	Svay	170715
17071504	តាហុក	Ta Hok	170715
17071505	ធិបតី	Thipakdei	170715
17071506	ជួយចក្រី	Chuoy Chakkrei	170715
17071507	ឈូក	Chhuk	170715
17071508	ត្រីញ័រ	Trei Nhoar	170715
17071509	ធ្វាស	Thveas	170715
17071510	ត្រពាំងព្រីង	Trapeang Pring	170715
17071601	សួនសា	Suon Sa	170716
17071602	ចុងថ្នល់	Chong Thnal	170716
17071603	យាង	Yeang	170716
17071604	សុខសាន្ដ	Sokh San	170716
17071605	កញ្ចន់គុយ	Kanhchan Kuy	170716
17090201	ថ្នល់ត្រង់	Thnal Trang	170902
17090202	ឱឡោក	Aolaok	170902
17090203	លលៃ	Loley	170902
17090204	ស្ទឹង	Stueng	170902
17090205	គោកត្រាច	Kouk Trach	170902
17090206	តាភោគ	Ta Phouk	170902
17090301	ធ្លកកំបុត	Thlok Kambot	170903
17090302	គោកឫស្សី	Kouk Ruessei	170903
17090303	ស្នារសង្គ្រាម	Snar Sangkream	170903
17090304	ក្រពើ	Krapeu	170903
17090305	តាកុយ	Ta Koy	170903
17090306	ព្រំកុដ្ឋ	Prum Kod	170903
17090307	ត្រាច	Trach	170903
17090308	ពពេល	Popel	170903
17090401	គោកក្ដុល	Kouk Kdol	170904
17090402	ត្នោតកំបុត	Tnaot Kambot	170904
17090403	ដីក្រហម	Dei Kraham	170904
17090501	អង្គ្រង	Angkrong	170905
17090502	កន្ទ្រាំង	Kantreang	170905
17090503	ស្រិតខាងលិច	Sret Khang Lech	170905
17110607	ខ្ចាស់	Khchas	171106
17090504	ស្រិតខាងកើត	Sret Khang Kaeut	170905
17090505	សូភី	Souphi	170905
17090506	ត្រពាំងថ្នល់	Trapeang Thnal	170905
17090507	តាត្រាវ	Ta Trav	170905
17090508	ពង្រ	Pongro	170905
17090601	គោកធ្លក	Kouk Thlok	170906
17090602	ត្រពាំងទឹម	Trapeang Tuem	170906
17090603	ឃុនមោឃ	Khun Moukh	170906
17090604	ច្រេស	Chres	170906
17090605	អូរ	Ou	170906
17090606	ស្ពានក្អែក	Spean K'aek	170906
17090607	ត្រាង	Trang	170906
17090608	ជ្រៃ	Chrey	170906
17090609	គោកត្នោត	Kouk Tnaot	170906
17090610	ល្អក់	L'ak	170906
17090701	ត្រពាំងធំ	Trapeang Thum	170907
17090702	តាប្រាក់	Ta Prak	170907
17090703	ដូននំ	Doun Num	170907
17090704	ជាស្មន់	Chea Sman	170907
17090705	បន្ទាយឫស្សី	Banteay Ruessei	170907
17090706	កំពង់ថ្កូវ	Kampong Thkov	170907
17090801	មមាញ	Momeanh	170908
17090802	គោកស្រុក	Kouk Srok	170908
17090803	កញ្ជរ	Kanhchor	170908
17090804	រលួសខាងកើត	Roluos Khang Kaeut	170908
17090805	ចំបក់	Chambak	170908
17090806	ដូនទាវ	Doun Teav	170908
17090807	រលួសខាងលិច	Roluos Khang Lech	170908
17090901	កូនសត្វ	Koun Satv	170909
17090902	បឹងជុំ	Boeng Chum	170909
17090903	តាអី	Ta Ei	170909
17090904	រកាកំបុត	Roka Kambot	170909
17090905	សួង	Suong	170909
17090906	ភ្នំដី	Phnum Dei	170909
17090907	ល្វា	Lvea	170909
17090908	ស្វាយជ័យ	Svay Chey	170909
17090909	អន្លង់ពីរ	Anlong Pir	170909
17091001	គោកចាន់	Kouk Chan	170910
17091002	ថ្នល់បាក់	Thnal Bak	170910
17091003	ត្នោត	Tnaot	170910
17091004	ត្រពាំងរុន	Trapeang Run	170910
17091005	តាប៉ាង	Ta Pang	170910
17091006	ព្រៃគុយ	Prey Kuy	170910
17091007	បង្កោង	Bangkaong	170910
17091008	គីរីមានន្ទ	Kiri Meanon	170910
17091009	បុស្សធំ	Bos Thum	170910
17091010	ត្រាចជ្រុំ	Trach Chrum	170910
17100101	ស្លក្រាម	Sla Kram	171001
17100102	បឹងដូនប៉ា	Boeng Donpa	171001
17100103	ចុងកៅស៊ូ	Chongkaosou	171001
17100104	ដកពោធិ៍	Dak Pou	171001
17100105	បន្ទាយចាស់	Banteay Chas	171001
17100106	ទ្រាំង	Treang	171001
17100107	មណ្ឌល៣	Mondol Bei	171001
17100108	ធ្លកអណ្តូង	Thlok Angdoung	171001
17100201	ភ្ញាជ័យ	Phnhea Chey	171002
17100202	កន្ដ្រក	Kantrork	171002
17100203	គោកក្រសាំង	Kok Krorsang	171002
17100204	ស្វាយព្រៃ	Svay Preae	171002
17100205	ពោធិ៍បុស្ស	Po Bos	171002
17100206	ថ្មី	Thmei	171002
17100207	ស្វាយដង្គំ	Svay Dangkum	171002
17100208	សាលាកន្សែង	Sala Kanseng	171002
17100209	គ្រួស	Kruos	171002
17100210	វិហារចិន	Vihear Chen	171002
17100211	ស្ទឹងថ្មី	Stueng Thmei	171002
17100212	មណ្ឌល១	Mondol 1	171002
17100213	មណ្ឌល២	Mondol 2	171002
17100214	តាភុល	Ta Phul	171002
17100301	ត្រពាំងសេះ	Trapeang Ses	171003
17100302	វាល	Veal	171003
17100303	ទក្សិណខាងត្បូង	Teaksen Khang Tbong	171003
17100304	គោកតាចាន់	Kok Ta Chan	171003
17100305	ខ្វៀន	Khvien	171003
17100306	គោកបេង	Kok Beng	171003
17100307	គោកត្នោត	Kok Tnot	171003
17100308	នគរក្រៅ	Nokor Krau	171003
17100401	វត្ដបូព៌	Wat Bo	171004
17100402	វត្ដស្វាយ	Wat Svay	171004
17100403	វត្ដដំណាក់	Wat Damnak	171004
17100404	សាលាកំរើក	Sala Kamreuk	171004
17100405	ជន្លង់	Chunlong	171004
17100406	តាវៀន	Ta Vien	171004
17100407	ត្រពាំងត្រែង	Trapeang Treng	171004
17100501	រហាល	Rohal	171005
17100502	ស្រះស្រង់ខាងជើង	Sras Srang Khang Cheung	171005
17100503	ស្រះស្រង់ខាងត្បូង	Sras Srang Khang Tbaung	171005
17100504	ក្រវ៉ាន់	Kravan	171005
17100505	អារក្សស្វាយ	Areaks Svay	171005
17100506	អញ្ចាញ	Anhchanh	171005
17100601	ជ្រាវ	Chreav	171006
17100602	ខ្នារ	Khnar	171006
17100603	បុស្សក្រឡាញ់	Bos Kralanh	171006
17100604	តាចេក	Ta Chek	171006
17100606	ក្រសាំង	Krasang	171006
17100607	បឹង	Boeng	171006
17100701	ភូមិទី១	Phum Ti Muoy	171007
17100702	ភូមិទី២	Phum Ti Pir	171007
17100703	ភូមិទី៣	Phum Ti Bei	171007
17100704	ភូមិទី៤	Phum Ti Buon	171007
17100705	ភូមិទី៥	Phum Ti Pram	171007
17100706	ភូមិទី៦	Phum Ti Prammuoy	171007
17100707	ភូមិទី៧	Phum Ti Prampir	171007
17100801	ព្នៅ	Phnov	171008
17100802	សំបួរ	Sambuor	171008
17100803	វាល	Veal	171008
17100804	ជ្រៃ	Chrey	171008
17100805	តាគង់	Ta Kong	171008
17100901	ពោធិបន្ទាយជ័យ	Pou Banteay Chey	171009
17100902	ភ្នំក្រោម	Phnom Krom	171009
17100903	ប្រឡាយ	Pralay	171009
17100904	កក្រាញ់	Kakranh	171009
17100905	ក្រសាំងរលើង	Krasang Roleung	171009
17100906	ស្ពានជ្រាវ	Spean Chreav	171009
17100907	អារញ្ញ	Aranh	171009
17100908	ត្រៀក	Triek	171009
17101001	កសិកម្ម	Kaksekam	171010
17101002	ថ្នល់់	Thnal	171010
17101003	រការធំ	Roka Thum	171010
17101004	ព្រៃធំ	Prey Thum	171010
17101005	ស្រង៉ែ	Srongae	171010
17101006	ចន្លោង	Chanlaong	171010
17101007	តាចក	Ta Chork	171010
17101201	តារស់	Ta Ros	171012
17101202	រកា	Roka	171012
17101203	ព្រៃពោធិ៍	Prey Pou	171012
17101204	ទទា	Totea	171012
17101205	ក្រសាំង	Krasang	171012
17101206	ពពិស	Popis	171012
17101207	ត្រពាំងវែង	Trapeang Veng	171012
17101208	គោកដូង	Kouk Doung	171012
17101209	បឹង	Boeng	171012
17101210	ប្រម៉ា	Prama	171012
17101211	ខ្នារ	Khnar	171012
17101212	ព្រៃក្រូច	Prey Krouch	171012
17101301	គោកដូង	Kok Dong	171013
17101302	សណ្ដាន់	Sandan	171013
17101303	ជ្រៃ	Chrey	171013
17101304	ប្រយុទ្ធ	Prayut	171013
17101305	បន្ទាយឈើ	Banteay Chheu	171013
17101306	ទឹកវិល	Tuek Vil	171013
17101307	ប្រីយ៍ចាស់	Prei Chas	171013
17101308	ទឹកថ្លា	Tuek Thla	171013
17101309	ប្រីយ៍ថ្មី	Prei Thmei	171013
17101310	ជ័យ	Chey	171013
17110101	ជាំ	Choam	171101
17110102	គោកតឺង	Kouk Toeng	171101
17110103	ស្រែប្រីយ៍	Srae Prei	171101
17110104	ត្រពាំងទូក	Trapeang Tuk	171101
17110105	ជប់	Chub	171101
17110106	តាតោកខាងកើត	Ta Taok Khang Kaeut	171101
17110107	កន្សែងក្រោម	Kansaeng Kraom	171101
17110108	កន្សែងលើ	Kansaeng Leu	171101
17110109	តាតោកខាងលិច	Ta Taok Khang Lech	171101
17110110	តាតោកកណ្ដាល	Ta Taok Kandal	171101
17110111	សន្លោង	Sanlaong	171101
17110112	ស្វាយស	Svay Sa	171101
17110113	ដូនដៀវ	Doun Diev	171101
17110114	ថ្នល់	Thnal	171101
17110115	បែកកាំភ្លើង	Baek Kamphleung	171101
17110116	គោកចិន	Kouk Chen	171101
17110117	ចាន់សខាងជើង	Chan Sa Khang  Cheung	171101
17110118	ចាន់សខាងត្បូង	Chan Sa Khang Tboung	171101
17110119	ច្បារលើ	Chbar Leu	171101
17110201	ដូនហុង	Doun Hong	171102
17110202	ដំដែកលើ	Dam Daek Leu	171102
17110203	ត្របែក	Trabaek	171102
17110204	ព្រះត្រពាំង	Preah Trapeang	171102
17110205	អូររលុះ	Ou Roluh	171102
17110206	គោករលួស	Kouk Roluos	171102
17110207	ក្រសាទុំ	Krasar Tum	171102
17110208	គោកមន	Kouk Mon	171102
17110209	ដំដែកថ្មី	Dam Daek Thmei	171102
17110210	បន្ទាយស្រី	Banteay Srei	171102
17110211	ស្រែធ្នង់	Srae Thnong	171102
17110212	ដំដែកផ្សារ	Dam Daek Phsar	171102
17110213	បុស្ស	Bos	171102
17110301	ថ្នល់ដាច់ខាងលិច	Thnal Dach Khang Lech	171103
17110302	ត្រាវកៀត	Trav Kiet	171103
17110303	គោកឫស្សីខាងត្បូង	Kouk Ruessei Khang Tboung	171103
17110304	គោកឫស្សីខាងជើង	Kouk Ruessei Khang Cheung	171103
17110305	រុនខាងត្បូង	Run Khang Tboung	171103
17110306	រុនខាងជើង	Run Khang Cheung	171103
17110307	ស្រម៉ធំ	Srama Thum	171103
17110308	វាល	Veal	171103
17110309	បន្ទាត់បោះ	Bantoat Baoh	171103
17110310	សន្ទៃ	Santey	171103
17110311	ធ្នង់	Thnong	171103
17110312	គោកចាន់	Kouk Chan	171103
17110313	បេង	Beng	171103
17110401	ព្រែកស្រមោច	Preaek Sramaoch	171104
17110402	ស្ពានវែង	Spean Veaeng	171104
17110403	តាអួរស	Ta Uor Sa	171104
17110404	ផ្សារឃ្លាំង	Phsar Khleang	171104
17110405	ចំការយួន	Chamkar Yuon	171104
17110406	តាច្រនៀង	Ta Chranieng	171104
17110407	អូរតាពុក	Ou Ta Puk	171104
17110408	ជ័យជេត	Chey Chet	171104
17110409	មុខវត្ដ	Mukh Voat	171104
17110410	រទាំង	Roteang	171104
17110501	កំពង់គ២	Kampong Ko Pir	171105
17110502	កំពង់គ១	Kampong Ko Muoy	171105
17110503	សាលាកកោះ	Sala Kakaoh	171105
17110504	គោកដឺ	Kouk Deu	171105
17110505	ជ្រៃខាងជើង	Chrey Khang Cheung	171105
17110506	ជ្រៃខាងត្បូង	Chrey Khang Tboung	171105
17110507	ដូនឡី	Doun Lei	171105
17110508	ត្រពាំងព្រៃ	Trapeang Prey	171105
17110509	ថ្មី	Thmei	171105
17110510	ថ្នល់ដាច់ខាងកើត	Thnal Dach Khang Kaeut	171105
17110511	ថ្នល់ចែក	Thnal Chaek	171105
17110512	ជីគាក	Chikeak	171105
17110601	ថ្លាត	Thlat	171106
17110602	ថ្មី	Thmei	171106
17110603	ក្បូន	Kboun	171106
17110604	គោកសង្កែ	Kouk Sangkae	171106
17110605	ជ្រៃ	Chrey	171106
17110606	យាងទេស	Yeang Tes	171106
17110701	ឈូក	Chhuk	171107
17110702	បុស្ស	Bos	171107
17110703	បុស្សធំ	Bos Thum	171107
17110704	ដំរីឆ្លង	Damrei Chhlang	171107
17110705	សំបាត	Sambat	171107
17110706	សំរោង	Samraong	171107
17110707	រំដេង	Rumdeng	171107
17110708	ជប់	Chob	171107
17110801	ព្រៃលាន	Prey Lean	171108
17110802	ត្រពាំងត្រាវ	Trapeang Trav	171108
17110803	គោល	Koul	171108
17110804	ថ្នល់ត្រង់	Thnal Trang	171108
17110805	ត្រពាំងត្រុំ	Trapeang Trom	171108
17110806	ត្រាចពក	Trach Pok	171108
17110807	ពពេលកណ្ដាល	Popel Kandal	171108
17110808	ពពេលលិច	Popel Lech	171108
17110809	ក្រៀលពង	Kriel Pong	171108
17110810	ដំរីកូន	Damrei Koun	171108
17110811	ត្រពាំងផុង	Trapeang Phong	171108
17110812	ត្រពាំងប្រីយ៍	Trapeang Prei	171108
17110813	គោលថ្មី	Koul Thmei	171108
17110901	សំរោងជើង	Samraong Cheung	171109
17110902	ថ្នល់ចែក	Thnal Chaek	171109
17110903	បិតមាស	Bet Meas	171109
17110904	ស្ទឹង	Stueng	171109
17110905	អង្គុញ	Angkunh	171109
17110906	បត់ដង្កោ	Bat Dangkao	171109
17110907	ស្វាយជ្រុំ	Svay Chrum	171109
17110908	ក្រាំងខ្ជាយ	Krang Khcheay	171109
17110909	សំរោងត្បូង	Samraong Tboung	171109
17111001	បឹងង៉ត	Boeng Ngat	171110
17111002	ដាក់ផ្កា	Dak Phka	171110
17111003	ត្រាវបាក់	Trav Bak	171110
17111004	ផ្ការំចេក	Phka Rumchek	171110
17111005	ចំប៉ី	Champei	171110
17111006	ប៉ោយស្មាច់	Paoy Smach	171110
17111007	ប្រវ៉ាល	Braval	171110
17111008	បឹងវៀន	Boeng Vien	171110
17111009	តាយ៉ែក	Ta Yaek	171110
17120101	ត្រុំខាងជើង	Trom Khang Cheung	171201
17120102	ឫស្សីសាញ់	Ruessei Sanh	171201
17120103	ត្រុំខាងត្បូង	Trom Khang Tboung	171201
17120104	យាយម៉ី	Yeay Mei	171201
17120105	ស្ដៅពក	Sdau Pok	171201
17120106	អំពៅដៀប	Ampov Dieb	171201
17120107	ជ្រោយនាងងួន	Chrouy Neang Nguon	171201
17120201	ស្លែងតាវេត	Slaeng Ta Vet	171202
17120202	ពង្របត់ចាន់	Pongro Bat Chan	171202
17120203	ស្លែងគង់	Slaeng Kong	171202
17120204	ល្បើក	Lbaeuk	171202
17120205	សំរោង	Samraong	171202
17120206	ក្លាំងហាយ	Klang Hay	171202
17120207	គោកថ្កូវ	Kouk Thkov	171202
17120301	នាងស្រោង	Neang Sraong	171203
17120302	រំដេង	Rumdeng	171203
17120303	ធ្លក	Thlok	171203
17120304	ស្មាច់	Smach	171203
17120305	ព្រេច	Prech	171203
17120306	បេង	Beng	171203
17120307	ពង្រ	Pongro	171203
17120401	មោងខាងត្បូង	Moung Khang Tboung	171204
17120402	មោងខាងជើង	Moung Khang Cheung	171204
17120403	ខ្វែក	Khvaek	171204
17120404	កំបោរ	Kambaor	171204
17120405	ល្វា	Lvea	171204
17120501	ប្រីយ៍១	Prei Muoy	171205
17120502	ប្រីយ៍២	Prei Pir	171205
17120503	ត្រាំសសរ	Tram Sasar	171205
17120504	ក្របៅ	Krabau	171205
17120505	ក្រូចចារ	Krouch Char	171205
17120601	ស្លែងស្ពាន	Slaeng Spean	171206
17120602	ច្រនៀង	Chranieng	171206
17120603	ភ្នំដី	Phnum Dei	171206
17120604	ដំណាក់ដំរី	Damnak Damrei	171206
17120605	ចំការចេក	Chamkar Chek	171206
17120606	ព្រះខ្សែត	Preah Khsaet	171206
17120608	ត្រាំកង់	Tram Kang	171206
17130101	បឹងមាលា	Boeng Mealea	171301
17130102	ត្រពាំងឫស្សី	Trapeang Ruessei	171301
17130103	ទឹកលិច	Tuek Lich	171301
17130104	សក្ដា	Sak Kda	171301
17130105	ចាន់ហៀរ	Chan Hear	171301
17130106	ទ័ពជ័យ	Torb Chey	171301
17130107	ស្រែរបង	Srae Robong	171301
17130201	កន្ទ្ទួត	Kantuot	171302
17130202	ខ្នារក្រៅ	Khnar Krau	171302
17130203	អភិវឌ្ឍន៌	Akpiwat	171302
17130204	រុងរឿង	Rong Roeung	171302
17130205	សែនជ័យ	Senchey	171302
17130206	ជប់រំដេង	Chub Rumdeng	171302
17130301	តាពេញ	Ta Penh	171303
17130302	ខ្លាឃ្មុំ	Khla Khmum	171303
17130303	ថ្មជ្រួញ	Thma Chruonh	171303
17130304	សង្កែឡាក់	Sangkae Lak	171303
17130305	អន្លង់ធំ	Anlong Thum	171303
17130401	ជប់លើ	Chob Leu	171304
17130402	ជប់ក្រោម	Chob Kraom	171304
17130403	ត្រពាំងខ្នារ	Trapeang Khnar	171304
17130404	បិតផ្កា	Bet Phka	171304
17130405	ឆេះចាន	Chheh Chan	171304
17130406	ត្រពាំងស្វាយ	Trapeang Svay	171304
17130407	អង្កាញ់	Angkanh	171304
17130408	រំចេក	Rumchek	171304
17130409	អូរមានជ័យ	Ou Meanchey	171304
17130410	ថ្មី	Thmey	171304
17130501	តាសៀម	Ta Siem	171305
17130502	ដំបូកខ្ពស់	Dambouk Khpos	171305
17130503	រហាល	Rohal	171305
17130504	ត្រពាំងទឹម	Trapeang Tuem	171305
17130505	ត្រពាំងពពេល	Trapeang Popel	171305
17130506	ត្រពាំងថ្ម	Trapeang Thmar	171305
17140101	កញ្ចន់រុន	Kanhchan Run	171401
17140102	ទំនាបស្វាយ	Tumneab Svay	171401
17140103	កាប់ដៃ	Kab Dai	171401
17140104	ប្រាសាទ	Prasat	171401
17140105	វៀន	Vien	171401
17140201	គោកចាន់	Kouk Chan	171402
17140202	ឧទ័យ	U Tey	171402
17140203	គោកកណ្ដាល	Kouk Kandal	171402
17140301	ស្រែណូយ	Srae Nouy	171403
17140302	ស្រែពោធិ៍	Srae Pou	171403
17140303	ល្វា	Lvea	171403
17140304	គោកវត្ដ	Kouk Voat	171403
17140305	ស្រែសមុទ្រ	Srae Sakmot	171403
17140306	វត្ដ	Voat	171403
17140401	អូរ	Ou	171404
17140402	ស្វាយស	Svay Sa	171404
17140403	ឫស្សីធំ	Ruessei Thum	171404
17140404	ឫស្សីតូច	Ruessei Touch	171404
17140405	កំបោរ	Kambaor	171404
17140406	ចារ	Char	171404
17140501	នេល	Nel	171405
17140502	រំដួល	Rumduol	171405
17140503	វ៉ារិន	Varin	171405
17140504	គោកភ្នំ	Kouk Phnum	171405
17140505	គោកស្រុក	Kouk Srok	171405
18010101	ភូមិ១	Phum Muoy	180101
18010102	ភូមិ២	Phum Pir	180101
18010103	ភូមិ៣	Phum Bei	180101
18010201	ភូមិ១	Phum Muoy	180102
18010202	ភូមិ២	Phum Pir	180102
18010203	ភូមិ៣	Phum Bei	180102
18010301	ភូមិ១	Phum Muoy	180103
18010302	ភូមិ២	Phum Pir	180103
18010303	ភូមិ៣	Phum Bei	180103
18010401	ភូមិ១	Phum Muoy	180104
18010402	ភូមិ២	Phum Pir	180104
18010403	ភូមិ៣	Phum Bei	180104
18010404	ភូមិ៤	Phum Buon	180104
18010405	ភូមិ៥	Phum Pram	180104
18010406	ភូមិ៦	Phum Prammuoy	180104
18010502	ដើមថ្កូវ	Daem Thkov	180105
18010503	ព្រែកស្វាយ	Preaek Svay	180105
18010601	កោះតូច	Kaoh Touch	180106
18010602	កោះរ៉ុងសន្លឹម	Kaoh Rung Sanloem	180106
18020101	អណ្ដូងថ្ម	Andoung Thma	180201
18020102	បន្ទាយប្រីយ៍	Banteay Prei	180201
18020103	អូរត្រាវ	Ou Trav	180201
18020104	ត្រពាំងស្អុយទី១	Trapeang S'oy Ti Muoy	180201
18020105	ត្រពាំងស្អុយទី២	Trapeang S'oy Ti Pir	180201
18020201	បឹងជុំ	Boeng Chum	180202
18020202	បឹងតាព្រហ្ម	Boeng Ta Prum	180202
18020203	បឹងតាស្រី	Boeng Ta Srei	180202
18020204	ដូនលយ	Doun Loy	180202
18020205	ភ្នំតូច	Phnum Touch	180202
18020206	ទឹកចេញ	Tuek Chenh	180202
18020301	ចំណោតរាម	Chamnaot Ream	180203
18020302	គគីរ	Kokir	180203
18020303	ពូធឿង	Pu Thoeang	180203
18020401	ចំការកៅស៊ូ	Chamkar Kausu	180204
18020402	ជើងគោ	Cheung Kou	180204
18020404	ត្រពាំងគា	Trapeang Kea	180204
18020405	ត្រពាំងមូល	Trapeang Mul	180204
18020501	កោះខ្យង	Kaoh Khyang	180205
18020502	អូរជ្រៅ	Ou Chrov	180205
18020503	ស្រែចាមក្រោម	Srae Cham Kraom	180205
20010304	សែនត	Saenta	200103
18020504	ស្រែចាមលើ	Srae Cham Leu	180205
18020505	ស្រែក្នុង	Srae Knong	180205
18020601	បត់គគីរ	Bat Kokir	180206
18020602	អូរចំណារ	Ou Chamnar	180206
18020603	អូរតាប៉ាង	Ou Ta Pang	180206
18020604	អូរតាសេក	Ou Ta Sek	180206
18020605	អូរឧកញ៉ាហេង	Ou Oknha Heng	180206
18020701	បត់សិរមាន់	Bat Ser Moan	180207
18020702	ព្រៃនប់១	Prey Nob Muoy	180207
18020703	ព្រៃនប់២	Prey Nob Pir	180207
18020704	ព្រៃនប់៣	Prey Nob Bei	180207
18020705	បែកក្រង់	Baek Krang	180207
18020801	អុង	Ong	180208
18020802	រាម	Ream	180208
18020804	ស្មាច់ដែង	Smach Daeng	180208
18020805	ថ្មធំ	Thma Thum	180208
18020901	តាអោងធំ	Ta Aong Thum	180209
18020902	បឹងរាំង	Boeng Reang	180209
18020903	ព្រែកក្រាញ់	Preaek Kranh	180209
18021001	ចុងអូរ	Chong Ou	180210
18021002	សំរុងកណ្ដាល	Samrong Kandal	180210
18021003	សំរុងក្រោម	Samrong Kraom	180210
18021004	សំរុងលើ	Samrong Leu	180210
18021005	អូត្រជាក់ចិត្ដ	Ou Tracheak Chet	180210
18021101	ទួល	Tuol	180211
18021102	ព្រែកផ្អាវ	Preaek Ph'av	180211
18021103	កំពង់ស្មាច់តូច	Kampong Smach Touch	180211
18021104	ជ្រលង	Chrolong	180211
18021201	ព្រែកប្រស់	Preaek Pras	180212
18021202	ព្រែកទាល់	Preaek Toal	180212
18021203	ព្រែកសង្កែ	Preaek Sangkae	180212
18021204	កំពង់ចិន	Kampong Chen	180212
18021301	ទួលទទឹងទី១	Tuol Totueng Ti Muoy	180213
18021302	ទួលទទឹងទី២	Tuol Totueng Ti Pir	180213
18021303	ទួលទទឹងទី៣	Tuol Totueng Ti Bei	180213
18021304	អំពូខ្មៅ	Ampu Khmau	180213
18021401	បឹងវែង	Boeng Veaeng	180214
18021402	វាលមាស	Veal Meas	180214
18021403	វាលធំ	Veal Thum	180214
18021501	តាពៅ	Ta Pov	180215
18021502	តានៃ	Ta Ney	180215
18021503	មនោរម្យ	Monorom	180215
18021504	ស្វាយ	Svay	180215
18021505	អន្លង់ក្រពើ	Anlong Krapeu	180215
18030101	ភូមិ១	Phum Muoy	180301
18030102	ភូមិ២	Phum Pir	180301
18030201	ភូមិ១	Phum Muoy	180302
18030202	ភូមិ២	Phum Pir	180302
18030203	ភូមិ៣	Phum Bei	180302
18030204	ភូមិ៤	Phum Buon	180302
18030301	ភូមិ១	Phum Muoy	180303
18030302	ភូមិ២	Phum Pir	180303
18030303	ភូមិ៣	Phum Bei	180303
18030304	ភូមិ៤	Phum Buon	180303
18030401	កែវផុស	Kaev Phos	180304
18030402	ឫទ្ធី១	Rithy 1	180304
18030403	ឫទ្ធី២	Rithy 2	180304
18040101	ចំការហ្លូង	Chamkar Luong	180401
18040102	បឹងត្រាច	Boeng Trach	180401
18040103	សម្ដេចតា	Samdech Ta	180401
18040201	ចាំស្រី	Cham Srei	180402
18040202	ក្រាំងអាត់	Krang At	180402
18040203	ថ្មី	Thmei	180402
18040204	វាល	Veal	180402
18040301	ព្រៃប្រសិទ្ធ	Prey Praseth	180403
18040302	ស្ទឹងច្រាល	Stueng Chral	180403
18040303	ស្ទឹងសំរោង	Stueng Samraong	180403
18040401	គីរីវន្ដ	Kirivoan	180404
18040402	អូរតាហយ	Ou Ta Hoay	180404
18040403	ស្ទឹងឆាយជើង	Stueng Chhay Cheung	180404
18040404	ស្ទឹងឆាយត្បូង	Stueng Chhay Tbong	180404
19010101	កំភុន	Kamphun	190101
19010102	បានម៉ៃ	Ban Mai	190101
19010103	កាតូត	Katout	190101
19010104	សេសាន	Sesan	190101
19010201	ក្បាលរមាស	Kbal Romeas	190102
19010202	ស្រែស្រណុក	Srae Sranok	190102
19010203	ក្របីជ្រុំ	Krabei Chrum	190102
19010204	ច្រប់	Chrab	190102
19010301	ភ្លុក	Phluk	190103
19010302	បានប៊ុង	Ban Bung	190103
19010401	បាដើម	Ba Daeum	190104
19010402	សាមឃួយ	Samkhuoy	190104
19010403	ស្រែតាប៉ាន	Srae Ta Pan	190104
19010404	ហាងសាវ៉ាត	Hang Savat	190104
19010501	ស្ដៅ១	Sdau Muoy	190105
19010502	ស្ដៅ២	Sdau Pir	190105
19010601	ស្រែគរ១	Srae Kor Muoy	190106
19010602	ស្រែគរ២	Srae Kor Pir	190106
19010701	ស្វាយរៀង	Svay Rieng	190107
19010702	ខ្សាច់ថ្មី	Khsach Thmei	190107
19010703	រំពាត់	Rumpoat	190107
19010704	តាឡាត	Ta Lat	190107
19020101	កោះព្រះ	Kaoh Preah	190201
19020201	កោះសំពាយ	Kaoh Sampeay	190202
19020202	ដំរីផុង	Damrei Phong	190202
19020301	ស្មាកោះ	Sma Kaoh	190203
19020302	ស្វាយ	Svay	190203
19020303	ភ្ជុល	Phchul	190203
19020304	កាំងដែក	Kang Daek	190203
19020401	អូរម្រះ	Ou Mreah	190204
19020402	ត្បូងខ្លា	Tboung Khla	190204
19020403	កោះជ្រឹម	Kaoh Chruem	190204
19020404	អូរច្រឡង់	Ou Chralang	190204
19020501	អូរឫស្សីកណ្ដាល	Ou Ruessei Kandal	190205
19020601	សៀមបូក	Siem Bouk	190206
19020602	អូឡង់	Ou Lang	190206
19020603	ទន្សោង	Tonsang	190206
19020701	ស្រែក្រសាំង	Srae Krasang	190207
19020702	កោះក្រូច	Kaoh Krouch	190207
19030101	ខិះស្វាយ	Khes Svay	190301
19030102	ខិះក្រោម	Khes Kraom	190301
19030103	ពងក្រៀល	Pong Kriel	190301
19030104	ខាំភោគ	Kham Phouk	190301
19030201	សៀមប៉ាង	Siem Pang	190302
19030202	កែងញ៉ៃ	Kaeng Nhai	190302
19030203	ចន្ទុ	Chantu	190302
19030204	សាម៉	Samma	190302
19030205	បានមួង	Ban Muong	190302
19030206	បានហ៊ួយ	Ban Huoy	190302
19030207	ដនឡូង	Dan Loung	190302
19030208	លុន	Lun	190302
19030301	គីរីវង្សាលើ	Kirivongsa Leu	190303
19030302	គីរីវង្សាក្រោម	Kirivongsa Kraom	190303
19030303	អូចាយ	Ou Chay	190303
19030304	ទាក់ទាម	Tak team	190303
19030305	គីរីបាសលើ	Kiri Bas Leu	190303
19030306	គីរីបាសក្រោម	Kiri Bas Kraom	190303
19030401	កញ្ចញគោក	Kanhchanh Kouk	190304
19030402	កញ្ចញទឹក	Kanhchanh Tuek	190304
19030403	ស្រែឫស្សី	Srae Ruessei	190304
19030404	ពាមខិះ	Peam Khes	190304
19030405	កេតមឿង	Ket Moeang	190304
19030406	សំរោង	Samraong	190304
19030407	ណាអូង	Na Oung	190304
19030501	ញ៉ាងស៊ុម	Nhang Sum	190305
19030502	ផាបាំង	Pha Bang	190305
19030503	ឡាកាយ	Lakay	190305
19040101	ភូមិព្រែក	Pum Preaek	190401
19040102	ត្រពាំងព្រីង	Trapeang Pring	190401
19040103	កណ្ដាល	Kandal	190401
19040104	ស្ពានថ្ម	Spean Thma	190401
19040105	រាជានុកូល	Reacheanukoul	190401
19040201	ថ្មលាភ	Thma Leaph	190402
19040202	លើ	Leu	190402
19040203	ស្រែពោធិ	Srae Pou	190402
19040301	បាចុង	Ba Chong	190403
19040302	កាំងម៉េម៉ាយ	Kang Memay	190403
19040303	កាំងដីស	Kang Dei Sa	190403
19040401	ថ្មី	Thmei	190404
19040402	ហាងខូសួន	Hang Khou Suon	190404
19040403	ហាងខូបាន	Hang Khou Ban	190404
19040404	កោះខនឌិន	Kaoh Khan Din	190404
19040405	ខាំផាន់	Kham Phan	190404
19040406	គីឡូប្រាំបី	Kilou  Prambei	190404
19050101	ផ្អាវ	Ph'av	190501
19050102	អន្លង់ភេ	Anlong Phe	190501
19050103	ទាល់	Toal	190501
19050104	វាលពោធិ	Veal Pou	190501
19050105	ស្ពង់	Spong	190501
19050201	រំដេង	Rumdeng	190502
19050202	ចំការលើ	Chamkar Leu	190502
19050203	រុន	Run	190502
19050301	កេះ	Kaes	190503
19050302	ដូង	Doung	190503
19050303	កាំងចាម	Kang Cham	190503
19050304	កាំងក្ងោក	Kang Kngaok	190503
19050305	កំពង់ប៉ាង	Kampong Pang	190503
19050401	កោះស្នែង	Kaoh Snaeng	190504
19050402	កោះស្រឡៅ	Kaoh Sralau	190504
19050403	កោះកី	Kaoh Kei	190504
19050404	ជាំធំ	Choam Thum	190504
19050501	អន្លង់ជ្រៃ	Anlong Chrey	190505
19050502	មន	Mon	190505
19050503	ស្រឡៅ	Sralau	190505
19050601	អូរ៉ៃ	Ou Rai	190506
19050602	ពងទឹក	Pong Tuek	190506
19050603	អន្លង់ស្វាយ	Anlong Svay	190506
19050701	កោះព្នៅ	Kaoh Pnov	190507
19050702	អូរស្វាយ	Ou Svay	190507
19050703	អូររុន	Ou Run	190507
19050704	វើនសៀន	Veun Sien	190507
19050705	កោះហិប	Kaoh Hib	190507
19050801	លើ	Leu	190508
19050802	កណ្ដាល	Kandal	190508
19050803	កោះឈើទាលតូច	Kaoh Chheu Teal Touch	190508
19050804	កោះឈើទាលធំ	Kaoh Chheu Teal Thum	190508
19050805	កោះល្ង	Kaoh Lngo	190508
19050806	ក្រឡាពាស	Krala Peas	190508
19050807	ក្រោម	Kraom	190508
19050808	អន្លង់ស្វាយ	Anlong Svay	190508
19050901	សំអាង	Sam Ang	190509
19050902	ឆ្វាំង	Chhvang	190509
19051001	ស្រែឫស្សី	Srae Ruessei	190510
19051002	អន្លង់ក្រមួន	Anlong Kramuon	190510
19051101	ថាឡាបរិវ៉ាត់	Thala Barivat	190511
19051102	អូរត្រែល	Ou Trael	190511
19051103	កាំងតេជោ	Kang Dechou	190511
19051104	វាលខ្សាច់	Veal Khsach	190511
20010301	ចន្ទ្រា	Chantrea	200103
20010302	គោកតែក	Kouk Taek	200103
20010303	តែងម៉ៅ	Taeng Mau	200103
20010401	ត្រពាំងរុន	Trapeang Run	200104
20010402	ត្រពាំងធ្លក	Trapeang Thlok	200104
20010403	ដូនណូយ	Doun Nouy	200104
20010404	ត្រពាំងដៀលើ	Trapeang Die Leu	200104
20010405	បន្លាស្អិត	Banla S'et	200104
20010406	ទួលស្ពាន	Tuol Spean	200104
20010407	ត្រពាំងដៀក្រោម	Trapeang Die Kraom	200104
20010408	ទួលអំពិល	Tuol Ampil	200104
20010501	ស្វាយគុយ	Svay Kuy	200105
20010502	ដីក្រហម	Dei Kraham	200105
20010503	តាដេវ	Ta Dev	200105
20010504	បុស្ស	Bos	200105
20010505	បារាយណ៍	Baray	200105
20010506	ពោធិ៍	Pou	200105
20010801	អង្គក្ដួច	Angk Kduoch	200108
20010802	ត្រពាំងបុណ្យ	Trapeang Bon	200108
20010803	ចំការលាវ	Chamkar Leav	200108
20010804	ព្រៃគគីរ	Prey Kokir	200108
20010805	កោះគោ	Kaoh Kou	200108
20010901	កោះក្បានខាងជើង	Kaoh Kban Khang Cheung	200109
20010902	កោះក្បានកណ្ដាល	Kaoh Kban Kandal	200109
20010903	ចេក	Chek	200109
20011001	ទួលស្ដី	Tuol Sdei	200110
20011002	ដូនទៃ	Doun Tey	200110
20011003	កោះឫស្សី	Kaoh Ruessei	200110
20020101	ពោធិក្រូច	Pou Krouch	200201
20020102	កែវជះ	Kaev Cheah	200201
20020103	ប្រចន្ទ្រា	Pra Chantrea	200201
20020104	បន្ទាយក្រាំង	Banteay Krang	200201
20020105	ធំ	Thum	200201
20020201	រោទិ៍	Rou	200202
20020202	ត្រពាំងឆ្លូញ	Trapeang Chhlounh	200202
20020203	ត្រពាំងត្រាវ	Trapeang Trav	200202
20020204	ញរ	Nhor	200202
20020205	ព្រៃត្រុំ	Prey Trom	200202
20020206	ស្វាយអាណាត	Svay Anat	200202
20020301	ពោធិ	Pou	200203
20020302	ខ្សែត្រ	Khsaetr	200203
20020303	កណ្ដាល	Kandal	200203
20020304	ត្រោក	Traok	200203
20020305	ព្រៃតាញ៉យ	Prey Ta Nhoy	200203
20020306	ព្រៃសង្កែ	Prey Sangkae	200203
20020307	ថ្មី	Thmei	200203
20020308	សាម៉	Sama	200203
20020309	ត្រពាំងកំពិស	Trapeang Kampis	200203
20020310	ព្រៃចារ	Prey Char	200203
20020311	ត្រពាំងឈូក	Trapeang Chhuk	200203
20020312	ត្រពាំងស្មាច់	Trapeang Smach	200203
20020313	ព្រៃចំណារ	Prey Chamnar	200203
20020314	ឫស្សីអម	Ruessei Am	200203
20020401	ត្រដែត	Tradaet	200204
20020402	ព្រះពន្លា	Preah Ponlea	200204
20020403	ត្រោក	Traok	200204
20020404	អូរដូនអាម	Ou Doun Am	200204
20020405	ត្រពាំងលាជ	Trapeang Leach	200204
20020406	ត្រពាំងរុន	Trapeang Run	200204
20020407	អង្គក្ដួច	Angk Kduoch	200204
20020408	ព្រីងជ្រុំ	Pring Chrum	200204
20020501	ព្រៃធំ	Prey Thum	200205
20020502	គគ្រួស	Kakruos	200205
20020503	តាកឹង	Ta Koeng	200205
20020504	ព្រះបាក់ក	Preah Bak Ka	200205
20020505	ព្រៃសាគុំ	Prey Sakum	200205
20020601	ត្រពាំងថ្នា	Trapeang Thna	200206
20020602	ដែកភ្លើង	Daek Phleung	200206
20020603	ឫស្សីដោច	Ruessei Daoch	200206
20020604	ភ្នំស្រូវ	Phnum Srov	200206
20020701	ស្វាយ	Svay	200207
20020702	ព្រៃម្នាស់	Prey Mnoas	200207
20020703	សំឡីខាងត្បូង	Samlei Khang Tboung	200207
20020704	សំឡីខាងជើង	Samlei Khang Cheung	200207
20020705	តាប៉ោ	Ta Pao	200207
20020706	ស្វាយចេក	Svay Chek	200207
20020707	ព្រៃភ្នៀត	Prey Phniet	200207
20020708	ព្រៃផ្អាវ	Prey Ph'av	200207
20020801	ឫស្សីលៀប	Ruessei Lieb	200208
20020802	ស្វាយគន្ធ្រែ	Svay Kuntrae	200208
20020803	សំយ៉ោង	Samyaong	200208
20020901	ព្រៃស្ទៀង	Prey Stieng	200209
20020902	ត្រពាំងត្រាច	Trapeang Trach	200209
20020903	សេកជ្រុំ	Sek Chrum	200209
20020904	រាមជោរ	Ream Chour	200209
20020905	ព្រៃប្រើស	Prey Praeus	200209
20020906	ព្រៃធ្លក	Prey Thlok	200209
20020907	ភូមិបុស្ស	Phum Bos	200209
20020908	ពោធិ៍ថ្មី	Pou Thmei	200209
20020909	ដើមពោធិ៍	Daeum Pou	200209
20020910	ស្វាយតាយាន	Svay Ta Yean	200209
20021101	ព្រៃវល្លិ៍	Prey Voa	200211
20021102	អូរ	Ou	200211
20021103	កោះត្រាច	Kaoh Trach	200211
20021104	ថ្មី	Thmei	200211
20021105	វាលម្អម	Veal M'am	200211
20021106	ជប់ព្រីង	Chob Pring	200211
20021201	ខាងកើតវត្ដ	Khang Kaeut Voat	200212
20021202	ខាងលិចវត្ដ	Khang Lech Voat	200212
20021203	បុណ្យ	Bon	200212
20021204	ពោធិ៍	Pou	200212
20021205	ធ្លកថ្មី	Thlok Thmei	200212
20021206	ធំ	Thum	200212
20021207	ព្រៃរបឹស	Prey Roboes	200212
20021208	ក្បាលថ្នល់	Kbal Thnal	200212
20021209	ពោធិ៍ម្អម	Pou M'am	200212
20021210	កណ្ដាល	Kandal	200212
20021211	ត្រោក	Traok	200212
20030101	បុសមនលើ	Bos Mon Leu	200301
20030102	បុសមនក្រោម	Bos Mon Kraom	200301
20030103	វាល	Veal	200301
20030104	បុសស្វាយ	Bos Svay	200301
20030105	បុសផ្លាំង	Bos Phlang	200301
20030106	ថ្មី	Thmei	200301
20030107	ស្រម៉	Srama	200301
20030201	ធ្មា	Thmea	200302
20030202	ក្រសាំង	Krasang	200302
20030203	ព្រៃត្នោត	Prey Tnaot	200302
20030204	បឹងកែក	Boeng Kaek	200302
20030205	ត្រពាំងពោន	Trapeang Poun	200302
20030206	ព្រៃពោធិ៍	Prey Pou	200302
20030207	ពង្រ	Pongro	200302
20030208	ព្រៃចំការ	Prey Chamkar	200302
20030301	ចក	Chak	200303
20030302	ស្វាយរូង	Svay Rung	200303
20030303	ព្រៃគាវ	Prey Keav	200303
20030304	ឆ្អឹងពស់	Chh'oeng Pos	200303
20030305	លាក់រាជា	Leak Reach Chea	200303
20030306	ចំបក់កោង	Chambak Kaong	200303
20030401	ទួលសាលា	Tuol Sala	200304
20030402	ទួលទ្រា	Tuol Trea	200304
20030403	នាងចាន់	Neang Chan	200304
20030404	ក្រូច	Krouch	200304
20030405	ព្រះអង្គកែវ	Preah Angk Kaev	200304
20030406	ត្រពាំងគ្រួស	Trapeang Kruos	200304
20030407	ត្រពាំងក្រែត	Trapeang Kraet	200304
20030501	ត្រពាំងដំរី	Trapeang Damrei	200305
20030502	ត្រសក់	Trasak	200305
20030503	កំពង់អំពិល	Kampong Ampil	200305
20030504	បឹង	Boeng	200305
20030505	ទួលច្រេស	Tuol Chres	200305
20030506	ស្វាយរលំ	Svay Rolum	200305
20030507	តាតែ	Ta Tae	200305
20030601	អំពិល	Ampil	200306
20030602	អង្គពក	Angk Pok	200306
20030603	ចុងព្រែក	Chong Preaek	200306
20030604	ហែកសំណាញ់	Haek Samnanh	200306
20030605	ម៉ឺនជ័យ	Meun Chey	200306
20030606	ព្រៃបឹង	Prey Boeng	200306
20030607	តាខេង	Ta Kheng	200306
20030608	ត្រាចទទឹង	Trach Totueng	200306
20030609	ត្រពាំងកណ្តាល	Trapeang Kandaol	200306
20030610	វាល	Veal	200306
20030701	អណ្ដូងក្រសាំង	Andoung Krasang	200307
20030702	បុសតូច	Bos Touch	200307
20030703	ព្រៃស្រគុំ	Prey Srakum	200307
20030704	ព្រៃតាយ័ន្ដ	Prey Ta Yoan	200307
20030705	ត្រពាំងផ្អាវ	Trapeang Ph'av	200307
20030706	ត្រពាំងថ្កូវ	Trapeang Thkov	200307
20030707	សេកយំ	Sek Yum	200307
20030708	ទួលតាកែវ	Tuol Ta Kaev	200307
20030709	ទួលតាឃន	Tuol Ta Khoan	200307
20030801	ស្វាយរំពារ	Svay Rumpea	200308
20030802	ពោន	Poun	200308
20030803	តាជោរ	Ta Chou	200308
20030804	ទួលចំបក់	Tuol Chambak	200308
20030805	ត្រពាំងរុន	Trapeang Run	200308
20030806	តាប៉ោង	Ta Paong	200308
20030807	គោកស្រម៉	Kouk Srama	200308
20030808	តាណែង	Ta Naeng	200308
20030901	អន្លង់ស្ពាន	Anlong Spean	200309
20030902	បាក្រុង	Ba Krong	200309
20030903	ច្រកស្គរ	Chrak Skor	200309
20030904	កណ្ដាល	Kandal	200309
20030905	ពពូល	Popul	200309
20030906	រោងដំរី	Roung Damrei	200309
20030907	ស្វាយចេក	Svay Chek	200309
20030908	ត្រពាំងចំបក់	Trapeang Chambak	200309
20030909	ថ្មី	Thmei	200309
20031001	ត្រពាំងក្នុង	Trapeang Knong	200310
20031002	ចំណតត្រាច	Chamnat Trach	200310
20031003	ថ្នា	Thna	200310
20031004	ធ្នង់	Thnong	200310
20031005	ព្រែកពក	Preaek Pok	200310
20031006	ត្រពាំងថ្ម	Trapeang Thma	200310
20031007	ថ្មី	Thmei	200310
20040101	ទឹកវិល	Tuek Vil	200401
20040102	ត្បែង	Tbaeng	200401
20040103	តាម៉ៅ	Ta Mau	200401
20040104	ត្រពាំងប្រីយ៍	Trapeang Prei	200401
20040105	ត្រពាំងពពេល	Trapeang Popel	200401
20040106	ត្រពាំងពិការ	Trapeang Pikar	200401
20040107	អំពិល	Ampil	200401
20040108	រមាសហែក	Romeas Haek	200401
20040109	ស្រែឫស្សី	Srae Ruessei	200401
20040110	ត្រោក	Traok	200401
20040201	អារក្សស្វាយ	Areaks Svay	200402
20040202	ថ្មី	Thmei	200402
20040203	ត្រពាំងជ័រ	Trapeang Choar	200402
20040204	ត្រពាំងត្បាល់	Trapeang Tbal	200402
20040205	បុស្សគគីរ	Bos Kokir	200402
20040206	ត្រពាំងបន្ទាយ	Trapeang Banteay	200402
20040207	ត្រពាំងបុស្ស	Trapeang Bos	200402
20040208	ចុងព្រែក	Chong Preaek	200402
20040209	រាមសេនា	Ream Sena	200402
20040210	រោងស្នោ	Roung Snao	200402
20040301	ទួលច្រេស	Tuol Chres	200403
20040302	កំរ៉ែង	Kamraeng	200403
20040303	ទួល	Tuol	200403
20040304	ជីកដី	Chik Dei	200403
20040305	អណ្ដូងត្របែក	Andoung Trabaek	200403
20040306	ត្រពាំងស្មាច់	Trapeang Smach	200403
20040401	ត្រពាំងរាំង	Trapeang Reang	200404
20040402	ក្បាលក្រពើ	Kbal Krapeu	200404
20040403	ត្រពាំងរំដេញ	Trapeang Rumdenh	200404
20040404	សំរោង	Samraong	200404
20040405	ត្រពាំងព្រីង	Trapeang Pring	200404
20040406	ក្អាម	K'am	200404
20040407	អង្គប្រស្រែ	Angk Prasrae	200404
20040408	អង្គក្នុង	Angk Knong	200404
20040409	ច្រកម្រាក់	Chrak Mreak	200404
20040410	បែកចាន	Baek Chan	200404
20040411	ថ្នល់ពាម	Thnal Peam	200404
20040412	ត្រពាំងធំ	Trapeang Thum	200404
20040501	បល្ល័ង្គជា	Ballangk Chea	200405
20040502	សម្លរឆៅ	Samlar Chhau	200405
20040503	ត្រពាំងធ្លកខាងជើង	Trapeang Thlok Khang Cheung	200405
20040504	ត្រពាំងធ្លកខាងត្បូង	Trapeang Thlok Khang Tboung	200405
20040505	ព្រៃកប្បាស	Prey Kabbas	200405
20040506	ត្រពាំងពោន	Trapeang Poun	200405
20040507	តាភរ	Ta Phor	200405
20040508	ចន្ដ្រី	Chantrei	200405
20040509	តាខិន	Ta Khen	200405
20040510	ក្រហមក	Kraham Ka	200405
20040511	ត្រពាំងតុំ	Trapeang Tom	200405
20040512	ព្រៃទទឹង	Prey Totueng	200405
20040513	ត្រពាំងរុនទី ១	Trapeang Run Ti Muoy	200405
20040514	ត្រពាំងរុនទី ២	Trapeang Run Ti Pir	200405
20040515	ត្រពាំងរុនទី ៣	Trapeang Run Ti Bei	200405
20040516	ចុងព្រែក	Chong Preaek	200405
20040517	ព្រៃរលួស	Prey Roluos	200405
20040518	គរ	Kor	200405
20040601	ត្រពាំងតាកែវ	Trapeang Ta Kaev	200406
20040602	ត្រពាំងភ្លោះ	Trapeang Phluoh	200406
20040603	ស្រះ	Srah	200406
20040604	អន្សោង	Ansaong	200406
20040605	ថ្មី	Thmei	200406
20040606	ព្រៃរំដេង	Prey Rumdeng	200406
20040607	ព្រៃឈើទាល	Prey Chheu Teal	200406
20040608	ចុងព្រៃ	Chong Prey	200406
20040609	ដងក្ដារ	Dang Kdar	200406
20040610	សណ្ដោ	Sandao	200406
20040611	ត្រពាំងស្មាច់	Trapeang Smach	200406
20040612	ដក់ពរ	Dak Por	200406
20040613	ព្រែករមៀត	Preaek Romiet	200406
20040614	ខ្ពបត្រាច	Khpob Trach	200406
20040701	តាសួស	Ta Suos	200407
20040702	ពោន	Poun	200407
20040703	ត្រពាំងស្លា	Trapeang Sla	200407
20040704	បុស្សសង្ឃ័រ	Bos Sangkhor	200407
20040705	កំពង់ថ្នា	Kampong Thna	200407
20040706	ព្រិច	Prich	200407
20040707	ត្រពាំងធ្លក	Trapeang Thlok	200407
20040708	ឈើទាល	Chheu Teal	200407
20040709	ត្រពាំងធំ	Trapeang Thum	200407
20040710	ព្រៃទួល	Prey Tuol	200407
20040711	ថ្មី	Thmei	200407
20040712	ត្រពាំងស្វាយ	Trapeang Svay	200407
20040713	ត្រពាំងក្រឡាញ់	Trapeang Kralanh	200407
20040714	អង្គញ់	Angkunh	200407
20040715	គរ	Kor	200407
20040716	ដូង	Doung	200407
20040717	ត្រពាំងផ្លុង	Trapeang Phlong	200407
20040718	ក្រញូង	Kranhung	200407
20040719	ជាធាជ	Chea Theach	200407
20040720	ត្រពាំងរំពាក់	Trapeang Rumpeak	200407
20040721	ស្វាយពក	Svay Pok	200407
20040722	ថ្លុកព្រីង	Thlok Pring	200407
20040801	ខ្លាលោត	Khla Lout	200408
20040802	ព្រៃខ្ជាយ	Prey Khcheay	200408
20040803	កំពង់ត្រាច	Kampong Trach	200408
20040804	ចុងអូរ	Chong Ou	200408
20040805	ឈើភ្លើង	Chheu Phleung	200408
20040806	តាហង់	Ta Hang	200408
20040807	ប្រមាត់ប្រាំ	Pramat Pram	200408
20040808	ព្រៃក្រឡាញ់	Prey Kralanh	200408
20040809	តាត្រាវ	Ta Trav	200408
20040810	តាខុប	Ta Khob	200408
20040901	តាសេក	Ta Sek	200409
20040902	ព្រៃក្ដី	Prey Kdei	200409
20040903	តាវាំង	Ta Veang	200409
20040904	ត្រពាំងស្គន់	Trapeang Skon	200409
20040905	គគីរ	Kokir	200409
20041001	ព្រៃផ្ដៀក	Prey Phdiek	200410
20041002	ថ្មី	Thmei	200410
20041003	ក្រសាំង	Krasang	200410
20041004	ស្មាច់	Smach	200410
20041005	ធ្នង់	Thnong	200410
20041006	តាម៉ិញ	Ta Menh	200410
20041007	ថ្លុកវាយទី ១	Thlok Veay Ti Muoy	200410
20041008	ថ្លុកវាយទី ២	Thlok Veay Ti Pir	200410
20041009	ឈូក	Chhuk	200410
20041010	ត្រពាំងជ្រៃ	Trapeang Chrey	200410
20041101	មុខដា	Mukh Da	200411
20041102	សំរោង	Samraong	200411
20041103	ក្រញូង	Kranhung	200411
20041104	ព្រៃផ្ដៅទី ១	Prey Phdau Ti Muoy	200411
20041105	ព្រៃផ្ដៅទី ២	Prey Phdau Ti Pir	200411
20041106	ត្រពាំងត្បាល់	Trapeang Tbal	200411
20041107	រមៀត	Romiet	200411
20041108	ថ្នល់ទទឹង	Thnal Totueng	200411
20041109	ថ្នល់គ្រួស	Thnal Kruos	200411
20041110	បុស្សកប្បាស	Bos Kabbas	200411
20041201	អកមួល	Ak Muol	200412
20041202	បឹងភេ	Boeng Phe	200412
20041203	ម្រាមខាងត្បូង	Mream Khang Tboung	200412
20041204	បឹងម្នង	Boeng Mnong	200412
20041205	ទួលស្រង៉ាំ	Tuol Srangam	200412
20041206	វាល	Veal	200412
20041207	អំពិល	Ampil	200412
20041208	ព្រៃព្រែក	Prey Preaek	200412
20041209	ព្រៃជ័រ	Prey Choar	200412
20041210	ឆ្មា	Chhma	200412
20041211	ត្រឡាច	Tralach	200412
20041212	ត្បែង	Tbaeng	200412
20041213	ត្រពាំងត្រសក់	Trapeang Trasak	200412
20041214	ពពាយ	Popeay	200412
20041215	ជ្រងពពេល	Chrong Popel	200412
20041216	ត្រពាំងជ័រ	Trapeang Choar	200412
20041217	ម្រាមខាងជើង	Mream Khang Cheung	200412
20041218	តាទ្រូ	Ta Tru	200412
20041219	ល្បើក	Lbaeuk	200412
20041220	តាប៉ាង	Ta Pang	200412
20041301	ព្រែកត្នោត	Preaek Tnaot	200413
20041302	បិទមាស	Bet Meas	200413
20041303	រមាំងទ្រេត	Romeang Tret	200413
20041304	ប្រសាទ	Prasat	200413
20041305	ត្មាតពង	Tmat Pong	200413
20041306	សំបួរ	Sambuor	200413
20041307	សូភី	Souphi	200413
20041308	ត្រោក	Traok	200413
20041309	ព្រៃគូរ	Prey Kur	200413
20041310	អណ្ដូងខ្មត់	Andoung Khmat	200413
20041311	ព្រិច	Prich	200413
20041401	ព្រៃស្រះ	Prey Srah	200414
20041402	ចំការកោះ	Chamkar Kaoh	200414
20041403	ទួលស្រម៉	Tuol Srama	200414
20041404	បិតទឹង	Bet Tueng	200414
20041405	ល្បើក	Lbaeuk	200414
20041406	ត្រពាំងឫស្សី	Trapeang Ruessei	200414
20041407	ទួលជ័យ	Tuol Chey	200414
20041408	ព្រៃតាមូ	Prey Ta Mu	200414
20041409	ត្រពាំងស្គន់	Trapeang Skon	200414
20041410	ក្រឡាញ់ទី ១	Kralanh Ti Muoy	200414
20041411	ក្រឡាញ់ទី ២	Kralanh Ti Pir	200414
20041412	ព្រៃក្រញូង	Prey Kranhung	200414
20041413	ថ្នល់	Thnal	200414
20041501	ទួលជ័រ	Tuol Choar	200415
20041502	វត្ដចាស់	Voat Chas	200415
20041503	ត្រពាំងស្គន់ថ្មី	Trapeang Skon Thmei	200415
20041504	ស្វាយប៉ោ	Svay Pao	200415
20041505	តាកុត	Ta Kot	200415
20041506	ស្វាយទន្ទឹម	Svay Tontuem	200415
20041507	ទួលក្រូច	Toul  Krouch	200415
20041508	ម្រះព្រៅ	Mreah Prov	200415
20041509	ថ្មី	Thmei	200415
20041510	ត្រពាំងស្គន់ចាស់	Trapeang Skon Chas	200415
20041511	ត្រពាំងស្ដៅ	Trapeang Sdau	200415
20041512	បន្លាស្អិត	Banla S'et	200415
20041513	ខ្នងជ្រូកខាងកើត	Khnang Chruk Khang Kaeut	200415
20041514	ទួលសុក្រំ	Tuol Sokram	200415
20041515	ខ្នងជ្រូកខាងលិច	Khnang Chruk Khang Lech	200415
20041516	ត្រពាំងឈ្នាង	Trapeang Chhneang	200415
20041517	ត្រពាំងរំដេញ	Trapeang Rumdenh	200415
20041518	អង្គ	Angk	200415
20041519	ទួលរមៀត	Tuol Romiet	200415
20041520	ត្រកៀបក្ដាម	Trakieb Kdam	200415
20041601	បុស្ស	Bos	200416
20041602	វត្ដ	Voat	200416
20041603	មុន្នីប្រឹក្សា	Muni Proeksa	200416
20041604	ម្រាក់ទាប	Mreak Teab	200416
20041605	ត្រស់	Tras	200416
20041606	តាសួស	Ta Suos	200416
20041607	ពពេល	Popel	200416
20041608	ពពូល	Popul	200416
20041609	វាលវែង	Veal Veaeng	200416
20041610	វាលត្មាត	Veal Tmat	200416
20041611	សេរីអោ	Serei Ao	200416
20041612	បឹង	Boeng	200416
20041613	ត្រពាំងបន្ទាយ	Trapeang Banteay	200416
20050101	ចែងម៉ែង	Chaeng Maeng	200501
20050102	ត្រពាំងឈូក	Trapeang Chhuk	200501
20050103	បឹង	Boeng	200501
20050104	ម្អម	M'am	200501
20050105	ត្រពាំងថ្ម	Trapeang Thma	200501
20050106	ស្វាយមីង	Svay Ming	200501
20050107	សណ្ដោត	Sandaot	200501
20050108	ថ្មពាន	Thma Pean	200501
20050109	ព្រៃឈើទាល	Prey Chheu Teal	200501
20050110	រកា	Roka	200501
20050111	បឹងក្រៀល	Boeng Kriel	200501
20050112	ម៉ឺនសាយ	Meun Say	200501
20050201	សាលារៀន	Sala Rien	200502
20050202	ស្វាយតាភ្ល	Svay Ta Phlo	200502
20050203	ប៉ាយ៉ាប	Payab	200502
20050204	ពោធិ៍តារស់	Pou Ta Ros	200502
20050205	បាសាក់	Basak	200502
20050301	ថ្មី	Thmei	200503
20050302	តានូ	Ta Nu	200503
20050303	ទួលខ្ពស់	Tuol Khpos	200503
20050304	អំពៅព្រៃ	Ampov Prey	200503
20050305	ព្រៃតាពៅ	Prey Ta Pov	200503
20050306	ទួលច្រេស	Tuol Chres	200503
20050307	អង្គសាលា	Angk Sala	200503
20050401	ជៀសឫស្សី	Chies Ruessei	200504
20050402	ត្រោក	Traok	200504
20050403	ចំបក់គុយ	Chambak Kuy	200504
20050404	តាជៃ	Ta Chey	200504
20050405	វាលល្ងើត	Veal Lngeut	200504
20050406	ឫស្សីព្រៃ	Ruessei Prey	200504
20050407	តាស្អាង	Ta S'ang	200504
20050501	ព្នៅ	Pnov	200505
20050502	អង្គាសដី	Angkeas Dei	200505
20050503	ស្វាយក្អែ	Svay K'ae	200505
20050504	ចំបក់កោង	Chambak Kaong	200505
20050505	បឹងអណ្ដែង	Boeng Andaeng	200505
20050506	ត្រោក	Traok	200505
20050507	ត្របែកប្រហោង	Trabaek Prahaong	200505
20050508	តាប៉	Ta Pa	200505
20050701	រំដេញ	Rumdenh	200507
20050702	ត្រោក	Traok	200507
20050703	សំរោង	Samraong	200507
20050704	ពោនកក	Poun Kak	200507
20050705	ចេក	Chek	200507
20050706	សង្កែ	Sangkae	200507
20050707	តារាក់	Ta Reak	200507
20050708	ព្រៃរកា	Prey Roka	200507
20050709	ឈូកស	Chhuk Sa	200507
20050710	ឈើទាល	Chheu Teal	200507
20050711	ព្រៃចំបក់	Prey Chambak	200507
20050712	នារាទេន	Nearea Ten	200507
20050801	បឹងកែក	Boeng Kaek	200508
20050802	ព្រៃរកា	Prey Roka	200508
20050803	រំពាត់ជ្រូក	Rumpoat Chruk	200508
20050804	ព្រៃពោធិ	Prey Pou	200508
20050805	អូរស្រងាំ	Ou Srangam	200508
20050806	ចំន្យា	Chamsa	200508
20050807	ដូនស	Doun Sa	200508
20050808	ត្រាច	Trach	200508
20050809	ដូងព្រះ	Doung Preah	200508
20050810	សូ	Sou	200508
20050811	គួយ	Kuoy	200508
20050901	ក្ដុម្ពី	Kdompi	200509
20050902	កន្ទួតប្រោង	Kantuot Praong	200509
20050903	ថ្នា	Thna	200509
20050904	កណ្ដាល	Kandal	200509
20050905	អង្គកប្បាស់	Angk Kabbas	200509
20050906	ស្វាយព្រហូត	Svay Prahut	200509
20050907	លាចឈូក	Leach Chhuk	200509
20050908	ចំបក់ថ្លឹង	Chambak Thloeng	200509
20050909	ត្បែង	Tbaeng	200509
20050910	ដូនលែប	Doun Leaeb	200509
20051001	ធ្លក	Thlok	200510
20051002	ព្រៃញ៉យ	Prey Nhay	200510
20051003	ក្រោលគោ	Kraol Kou	200510
20051004	គោកកណ្ដោល	Kouk Kandaol	200510
20051005	បន្លាស្អិត	Banla S'et	200510
20051006	ឃួច	Khuoch	200510
20051007	បឹងរ៉ៃខាងត្បូង	Boeng Rai Khang Tboung	200510
20051008	បឹងរ៉ៃខាងជើង	Boeng Rai Khang Cheung	200510
20051009	ឫស្សីជួរខាងជីង	Ruessei Chuor Khang Cheung	200510
20051010	ឫស្សីជួរខាងត្បូង	Ruessei Chuor Khang Tboung	200510
20051011	ព្រៃខ្លា	Prey Khla	200510
20051012	ព្រៃធ្នង់	Prey Thnong	200510
20051013	ឫស្សីទទឹង	Ruessei Totueng	200510
20051101	ចំបក់	Chambak	200511
20051102	ថ្នា	Thna	200511
20051103	គ្រួស	Kruos	200511
20051104	ក្រៅ	Krau	200511
20051105	រវៀង	Rovieng	200511
20051106	សំរោង	Samraong	200511
20051107	ក្រសាំងជ្រំ	Krasang Chrum	200511
20051108	ភ្លោះ	Phluoh	200511
20051109	កណ្ដាល	Kandal	200511
20051110	ល្វា	Lvea	200511
20051111	ត្រោក	Traok	200511
20051201	ចិន្សា	Chensa	200512
20051202	ត្បែង	Tbaeng	200512
20051203	អញ្ចាញ	Anhchanh	200512
20051204	ឃ្លាំង	Khleang	200512
20051205	តាមុំ	Ta Mom	200512
20051206	ព្រៃខ្លា	Prey Khla	200512
20051207	ពោធិ៍រាជ	Pouthi Reach	200512
20051208	ព្រៃដំឡូង	Prey Damloung	200512
20051209	ប្រាសាទ	Prasat	200512
20051210	អូរសំដី	Ou Samdei	200512
20051211	ត្រពាំងធ្លក	Trapeang Thlok	200512
20051301	អណ្ដូង	Andoung	200513
20051302	កណ្ដាល	Kandal	200513
20051303	សំព័រ	Sampoar	200513
20051304	ស្វាយអង្គ	Svay Angk	200513
20051305	គោល	Koul	200513
20051306	ធ្នង់	Thnong	200513
20051307	ខ្នុរខាងជើង	Khnor Khang Cheung	200513
20051308	ខ្នុរខាងត្បូង	Khnor Khang Tbpoung	200513
20051309	ស្វាយផ្អែម	Svay Ph'aem	200513
20051401	ថ្មស	Thma Sa	200514
20051402	ត្របែក	Trabaek	200514
20051403	ឃ្មត់	Khmot	200514
20051404	ស្វាយជ្រំ	Svay Chrum	200514
20051405	បឹងវែង	Boeng Veaeng	200514
20051406	ស្វាយក្ងោ	Svay Kngao	200514
20051407	ព្រែកទប់	Preaek Tob	200514
20051501	ស្វាយចេក	Svay Chek	200515
20051502	ធ្នង់	Thnong	200515
20051503	អង្គឫស្សី	Angk Ruessei	200515
20051504	ត្រោកធំ	Traok Thum	200515
20051505	ដក់ព	Dak Por	200515
20051506	ទួលទ្រា	Tuol Trea	200515
20051507	ស្វាយដូនអី	Svay Doun Ei	200515
20051508	ចំរេះ	Chamreh	200515
20051509	ត្រោកតូច	Traok Touch	200515
20051510	ស្វាយ	Svay	200515
20051511	ពពារ	Popear	200515
20051512	ក្រាំងលាវ	Krang Leav	200515
20051601	មហាសួន	Moha Suon	200516
20051602	ស្វាយជំរៅ	Svay Chumrov	200516
20051603	ព្រៃបន្ទាយ	Prey Banteay	200516
20051604	របោះព្រីង	Robaoh Pring	200516
20051605	ដំណាក់កន្ទួត	Damnak Kantuot	200516
20051606	ក្បាលដំរី	Kbal Damrei	200516
20051607	ទួលវិហារ	Tuol Vihear	200516
20051608	ក្ដីស្លា	Kdei Sla	200516
20051609	ប្រម៉ា	Prama	200516
20051610	ស៊ីការ	Sikar	200516
20051611	កៀនតាស៊ីវ	Kien Ta Siv	200516
20051612	ចំការចេក	Chamkar Chek	200516
20051613	ស្វាយយា	Svay Yea	200516
20051614	ព្រៃផ្អុង	Prey Ph'ong	200516
20051615	តាកោ	Ta Kao	200516
20051701	ដូនទង	Doun Tong	200517
20051702	ស្នាយគ្រាង	Snay Kreang	200517
20051703	អំពៅព្រៃ	Ampov Prey	200517
20051704	ធ្លក	Thlok	200517
20051705	កណ្ដាល	Kandal	200517
20051706	ធំ	Thum	200517
20051707	ទៃយា	Tey Yea	200517
20051708	សំដី	Samdei	200517
20060101	ស្វាយរៀង	Svay Rieng	200601
20060102	វាលយន្ដ	Veal Yon	200601
20060103	រោងបន្លែ	Roung Banlae	200601
20060104	មេភ្លើង	Me Phleung	200601
20060105	ស្រះវង់	Srah Vong	200601
20060106	កៀនសាំង	Kien Sang	200601
20060107	ចុងព្រែក	Chong Preaek	200601
20060201	សួនថ្មី	Suon Thmei	200602
20060202	រូបគោ	Rub Kou	200602
20060203	សាលាស្រុកចាស់	Sala Srok Chas	200602
20060204	ព្រៃឆ្លាក់	Prey Chhlak	200602
20060205	អណ្ដូងតាសី	Andoung Ta Sei	200602
20060301	គយត្របែក	Koy Trabaek	200603
20060302	តារាងបាល់	Tarang Bal	200603
20060401	ក្បាលស្ពាន	Kbal Spean	200604
20060403	ថ្នល់កែង	Thnal Kaeng	200604
20060404	ពោធិតាហោ	Pou Ta Hao	200604
20060501	ស្វាយ	Svay	200605
20060502	ធ្មល់	Thmol	200605
20060503	ស្វាត	Svat	200605
20060504	ទទា	Totea	200605
20060505	ចេក	Chek	200605
20060506	ចំបក់	Chambak	200605
20060507	កណ្ដាល	Kandal	200605
20060508	មេលោង	Meloung	200605
20060509	ឃ្លាំង	Khleang	200605
20060510	គក់ប៉ែ	Kok Pae	200605
20060601	តាជោរ	Ta Chour	200606
20060602	តាណរ	Ta Nar	200606
20060603	ឃោសាង	Khousang	200606
20060604	ទាហានក្រោម	Teahean Kraom	200606
20060605	ទាហានលើ	Teahean Leu	200606
20060606	សាមគ្គី	Sameakki	200606
20060607	ស្វាយតឿ	Svay Toea	200606
20060701	ថ្មី	Thmei	200607
20060702	បាក់រនាស់	Bak Ronoas	200607
20060703	ធ្លក	Thlok	200607
20060704	ស្រម៉ជ្រុំ	Srama Chrum	200607
20060705	ចំបក់ពាម	Chambak Peam	200607
20060706	ព្រះទន្លេ	Preah Tonle	200607
20060707	ពភ្លា	Pophlea	200607
20060708	អកនាគ	Ak Neak	200607
20070201	សង្គម	Sangkum	200702
20070202	កំពោតទូក	Kampot Tuk	200702
20070203	ត្បែង	Tbaeng	200702
20070204	ឈើទាល	Chheu Teal	200702
20070205	ព្រៃតាធឹក	Prey Ta Thuek	200702
20070206	ទួលអង្គ	Tuol Angk	200702
20070207	វាយ	Veay	200702
20070208	បាត់ថង់	Bat Thang	200702
20070301	ប្រសូតិ ទី ១	Prasout Ti Muoy	200703
20070302	ប្រសូតិ ទី ២	Prasout Ti Pir	200703
20070303	បន្ទាយ	Banteay	200703
20070304	ថ្នល់កែង	Thnal Kaeng	200703
20070305	លៀប	Lieb	200703
20070306	ក្បាលថ្នល់	Kbal Thnal	200703
20070307	ដើមពោធិ៍	Daeum Pou	200703
20070308	កណ្ដៀងរាយ	Kandieng Reay	200703
20070309	ជប់	Chob	200703
20070401	អូរតាមោ	Ou Tamou	200704
20070402	មនោរម្យ	Monourom	200704
20070501	ថ្លុកព្រីង	Thlok Pring	200705
20070502	ថ្នល់កែង	Thnal Kaeng	200705
20070503	កំពង់រទេះ	Kompong Roteh	200705
20070504	ទួលច្រេស	Tuol Chres	200705
20070505	កំពោតម្រាក់	kampout Mreak	200705
20070506	ស្វាយគយ	Svay Koy	200705
20070601	តាប៉ោញ	Ta Paonh	200706
20070602	ត្រពាំងតាអី	Trapeang Ta Ei	200706
20070603	ត្រពាំងផ្លាំង	Trapeang Phlang	200706
20070604	ស្វាយផ្អែម	Svay Ph'aem	200706
20070605	ត្រពាំងចក	Trapeang Chak	200706
20070606	ត្រពាំងស្បូវ	Trapeang Sbov	200706
20070701	ព្រៃរំដួល	Prey Rumduol	200707
20070702	ពោធិវង្ស	Pou Vong	200707
20070703	អង្គស្វាយ	Angk Svay	200707
20070704	ទួលត្របែក	Tuol Trabaek	200707
20070705	ព្រៃឈើទាល	Prey Chheu Teal	200707
20070706	ព្រៃទទឹង	Prey Totueng	200707
20070707	ព្រៃតាយឹង	Prey Ta Yueng	200707
20070708	ព្រៃទួល	Prey Tuol	200707
20070709	អង្គតាមោក	Angk Ta Mouk	200707
20070801	ទន្លៀង	Tonlieng	200708
20070802	ស្វាយ	Svay	200708
20070803	ខ្នុរ	Khnor	200708
20070804	ខ្ជាយ	Khcheay	200708
20070805	ឫស្សីជង្រុក	Ruessei Chongruk	200708
20070806	ក្រញូង	Kranhung	200708
20070807	ព្រៃធ្នង់	Prey Thnong	200708
20070808	បែកចាន	Baek Chan	200708
20070809	រមាំងថ្កោល	Romeang Thkaol	200708
20070901	ទួលអង្គប់	Tuol Angkob	200709
20070902	ថ្មី	Thmei	200709
20070903	ត្រពាំងអំពិល	Trapeang Ampil	200709
20070904	ព្រៃទទឹង	Prey Totueng	200709
20070905	អូរក្អាម	O Kaam	200709
20070906	សង្គ្រោះ	Sangkruoh	200709
20070907	សំបួរ	Sambuor	200709
20070908	ព្រៃសម្ភ័រ	Prey Samphoar	200709
20071101	អង្ក្រង	Angkrong	200711
20071102	ទួលអំពិល	Tuol Ampil	200711
20071103	ស្រម៉	Srama	200711
20071104	កញ្ឆែត	Kanhchhaet	200711
20071105	កក់	Kak	200711
20071106	ស្វាយធំ	Svay Thum	200711
20080101	ត្រពាំងផ្លុង	Trapeang Phlong	200801
20080102	ថ្នាញ	Thnanh	200801
20080103	ប្រសប់លាក់	Prasab Leak	200801
20080104	ច្រកឫស្សី	Chrak Ruessei	200801
20080105	ថ្នល់កែង	Thnal Kaeng	200801
20080201	តាបឹប	Ta Boeb	200802
20080202	តាពៅ	Ta Pov	200802
20080203	បាវិតលើ	Bavet Leu	200802
20080204	បាវិតកណ្ដាល	Bavet Kandal	200802
20080205	ច្រកលាវ	Chrak Leav	200802
20080301	កំពោតស្គារ	Kampout Skear	200803
20080302	ថ្នល់ជាតិ	Thnal Cheat	200803
20080303	ច្រកម្ទេស	Chrak Mtes	200803
20080304	ព្រៃផ្ដៅ	Prey Phdau	200803
20080305	សាមគ្គី	Sameakki	200803
20080306	ថ្នល់ទទឹង	Thnal Totueng	200803
20080307	ដំបូកជួរ	Dambouk Chuor	200803
20080308	ទួលអំពិល	Tuol Ampil	200803
20080309	វាល	Veal	200803
20080310	កំពោតប្រស់	Kampout Pras	200803
20080311	សាលាទាន	Sala Tean	200803
20080312	ព្រៃទប់	Prey Tob	200803
20080313	បត់ស្លឹក	Bat Sloek	200803
20080314	ថ្មី	Thmei	200803
20080315	ធ្លក	Thlok	200803
20080401	ប្រាសាទ	Prasat	200804
20080402	កណ្ដាល	Kandal	200804
20080501	គោកល្វៀង	Kouk Lvieng	200805
20080502	កំពោតជ្រូក	Kampout Chruk	200805
20080503	ជ្រៃធំ	Chrey Thum	200805
20080504	ព្រៃទប់	Prey Tob	200805
20080505	អង្គ្កសាលា	Angk Sala	200805
20080506	កំពោតលៀប	Kampout Liep	200805
20080507	ព្រៃអង្គុញ	Prey Angkunh	200805
20080508	បុស្សក្រសាំង	Bos Krasang	200805
21010101	កំពង់ហ្លួង	Kampong Luong	210101
21010102	ស្ទឹងកំបុត	Stueng Kambot	210101
21010103	ព្រៃសំបួរ	Prey Sambuor	210101
21010104	ទួលសាំង ក	Tuol Sang Ka	210101
21010105	ទួលសាំង ខ	Tuol Sang Kha	210101
21010106	សាមគ្គី	Sameakki	210101
21010201	ស្វាយខាងត្បូង	Svay Khang Tboung	210102
21010202	ស្វាយខាងជើង	Svay Khang Cheung	210102
21010203	បាស្រែ	Ba Srae	210102
21010204	រំលក	Rumlok	210102
21010205	ព្រៃបាសឹង	Prey Ba Soeng	210102
21010206	តាអី	Ta Ei	210102
21010207	រកា	Roka	210102
21010208	ពួនកក	Puon Kak	210102
21010301	ព្រែកតាផ	Preaek Ta Pha	210103
21010302	ព្រែកដា	Preaek Da	210103
21010303	ទួលពុទ្រា	Tuol Puttrea	210103
21010304	បាក់ដៃ	Bak Dai	210103
21010401	អំពិល	Ampil	210104
21010402	ស្រម៉ុក	Sramok	210104
21010403	ពន្លៃខាងជើង	Ponley Khang Cheung	210104
21010404	ពន្លៃខាងត្បូង	Ponley Khang Tboung	210104
21010405	សំរោង	Samraong	210104
21010406	ធ្លកយុល	Thlok Yul	210104
21010501	អង្គរ	Angkor	210105
21010502	កំពង់ពោធិ៍	Kampong Pou	210105
21010503	ភ្នំបូរី	Phnum Bourei	210105
21010504	ភ្នំបាទេព	Phnum Ba Tep	210105
21010601	ព្រៃផ្គាំ ក	Prey Phkoam Ka	210106
21010602	ព្រៃផ្គាំ ខ	Prey Phkoam Kha	210106
21010603	ព្រៃផ្គាំ គ	Prey Phkoam Ko	210106
21010604	ទ្រង់់ភូមិ	Trong Phum	210106
21010605	យាផ្អើ	Yea Ph'aeur	210106
21010606	តាមូង	Ta Mung	210106
21020101	តានប់	Ta Nob	210201
21020102	បចាម	Bacham	210201
21020103	ម្រះព្រៅ	Mreah Prov	210201
21020104	ត្រពាំងលាន	Trapeang Lean	210201
21020105	រុន	Run	210201
21020106	ស្ដៅឯម	Sdau Aem	210201
21020107	កន្លែងខ្លា	Kanlaeng Khla	210201
21020108	សីហា	Seiha	210201
21020109	បឹងលាច	Boeng Leach	210201
21020110	វាលប្រីយ៍	Veal Prei	210201
21020111	ស្រមោចហែ	Sramaoch Hae	210201
21020112	ត្រពាំងត្រយឹង	Trapeang Trayueng	210201
21020201	ដើមដូង	Daeum Doung	210202
21020202	ម្កាក់	Mkak	210202
21020203	ត្រកៀត	Trakiet	210202
21020204	ព្រែក	Preaek	210202
21020205	មឿងប្រចិន	Moeang Prachen	210202
21020206	ព្រៃមូល	Prey Mul	210202
21020207	ជើងលោង	Cheung Loung	210202
21020301	ប្រមូលសុខ	Pramoul Sokh	210203
21020302	ក្រាំងប្រទាល	Krang Prateal	210203
21020303	ស្វាយខម	Svay Kham	210203
21020304	យុថ្កា	Yuthka	210203
21020305	ចេក	Chek	210203
21020306	ដូង	Doung	210203
21020307	កណ្ដាល	Kandal	210203
21020308	តានន	Ta Non	210203
21020401	ក្រសាំង	Krasang	210204
21020402	ក្រាំងអំពិល	Krang Ampil	210204
21020403	ឱភាសាំង	Aopheasang	210204
21020404	ព្រះម្លប់	Preah Mlob	210204
21020405	ត្រពាំងលើក	Trapeang Leuk	210204
21020406	កណ្ដឹងធំ	Kandoeng Thum	210204
21020407	ហនុមាន	Haknuman	210204
21020408	កណ្ដឹងតូច	Kandoeng Touch	210204
21020501	ព្រៃខ្លា	Prey Khla	210205
21020502	ត្រពាំងផ្លុង	Trapeang Phlong	210205
21020503	សិរីមានជោគ	Serei Mean Chouk	210205
21020504	ត្រមូងជ្រុំ	Tramung Chrum	210205
21020505	ក្រាំងពង្រ	Krang Pongro	210205
21020506	រយ៉ក	Royak	210205
21020507	ស្ដុក	Sdok	210205
21020508	ច្បារមន	Chbar Mon	210205
21020509	ថ្មី	Thmei	210205
21020510	ខ្នារទង់	Khnar Tong	210205
21020511	ព្រៃស្លែង	Prey Slaeng	210205
21020512	កញ្ចាង	Kanhchang	210205
21020513	កញ្ជុំ	Kanhchum	210205
21020601	ត្រពាំងពោធិ	Trapeang Pou	210206
21020602	ស្រីគ្រងរាជ្យ	Srei Krong Reach	210206
21020603	ព្រៃត្រាច	Prey Trach	210206
21020604	សាមគ្គី	Sameakki	210206
21020605	តាប៉ែន	Ta Paen	210206
21020606	មានជ័យ	Mean Chey	210206
21020607	មានជោគ	Mean Chouk	210206
21020608	ប្រាសាទ	Prasat	210206
21020609	ត្រាចកុះ	Trach Koh	210206
21020610	ត្រាំក្បាល់	Tram Kbal	210206
21020611	រូង	Rung	210206
21020612	ត្រពាំងអង្គ	Trapeang Angk	210206
21020613	ដើមស្វាយ	Daeum Svay	210206
21020614	ព្រហូត	Prohut	210206
21020615	ត្រពាំងឈូក	Trapeang Chhuk	210206
21020616	ទួលស្លែង	Tuol Slaeng	210206
21020617	ឈើទាលជ្រុំ	Chheu Teal Chrum	210206
21020618	ក្រាំងលាវ	Krang Leav	210206
21020619	សៀមដេក	Siem Dek	210206
21020620	ព្រៃជន្លួញ	Prey Chonluonh	210206
21020621	ត្រាំសសរ	Tram Sasar	210206
21020622	ថ្នល់ដាច់	Thnal Dach	210206
21020623	បាញ់ខ្លា	Banh Khla	210206
21020701	ហនុមាន	Haknuman	210207
21020702	ត្បែង	Tbaeng	210207
21020703	ខ្នារ	Khnar	210207
21020704	ថ្នល់ទក្សិណ	Thnal Teaksen	210207
21020705	ជ្រោងស្ដៅ	Chroung Sdau	210207
21020706	ត្បូងដំរី	Tboung Damrei	210207
21020707	ក្រាំងធ្នង់	Krang Thnong	210207
21020708	ទន្លេបាទី	Tonle Bati	210207
21020801	ក្រាំងធំ	Krang Thum	210208
21020802	ត្រយឹងខ្ពស់	Trayueng Khpos	210208
21020803	បាក់រនាស់	Bak Ronoas	210208
21020804	ត្រពាំងក្រឡាញ់	Trapeang Kralanh	210208
21020805	ថ្មី	Thmei	210208
21020806	ពូនភ្នំ	Pun Phnum	210208
21020807	កណ្ដាល	Kandal	210208
21020808	ពានមាសខាងកើត	Pean Meas Khang Kaeut	210208
21020809	ថ្មស	Thma Sa	210208
21020810	ត្រពាំងគ្រួស	Trapeang Kruos	210208
21020811	ត្រពាំងក្រឡោង	Trapeang Kralaong	210208
21020812	ពានមាសខាងលិច	Pean Meas Khang Lech	210208
21020901	តាំងញាតិ	Tang Nheat	210209
21020902	ពារាម	Pea Ream	210209
21020903	ខ្នារធំ	Khnar Thum	210209
21020904	ខ្នាររោង	Khnar Roung	210209
21020905	ត្រពាំងយោង	Trapeang Young	210209
21020906	ជំរៅ	Chumrov	210209
21020907	ក្រាំងក្រចាង	Krang Krachang	210209
21020908	គ្រួស	Kruos	210209
21021001	ព្រៃស្វា	Prey Sva	210210
21021002	ក្រូច	Krouch	210210
21021003	ក្រាំងពោធិ៍	Krang Pou	210210
21021004	ត្រពាំងត្រាវ	Trapeang Trav	210210
21021005	ចំបក់	Chambak	210210
21021006	ពត់សរ	Pot Sar	210210
21021007	តាំងឫស្សី	Tang Ruessei	210210
21021008	ឃ្លាំងសម្បត្ដិ	Kleang Sambatt	210210
21021009	កណ្ដោល	Kandaol	210210
21021010	ខ្វាន់មាស	Khvan Meas	210210
21021011	ខ្លាកូន	Khla Koun	210210
21021101	ចំប៉ា	Champa	210211
21021102	ត្រាំខ្នារ	Tram Khnar	210211
21021103	ត្រពាំងឫស្សី	Trapeang Ruessei	210211
21021104	សំរោង	Samraong	210211
21021105	ព្រហែក	Prohaek	210211
21021106	ត្រពាំងឈូក	Trapeang Chhuk	210211
21021107	ជើងកូត	Cheung Kout	210211
21021108	ភ្នំតូច	Phnum Touch	210211
21021201	ព្រៃក្ដី	Prey Kdei	210212
21021202	អង្គក្រឡាញ់	Angk Kralanh	210212
21021203	អំពែទុំ	Ampeae Tum	210212
21021204	រវៀង	Rovieng	210212
21021205	ព្រៃក្រាយ	Prey Kray	210212
21021206	ផ្សារគុម្ពឫស្សី	Phsar Kump Ruessei	210212
21021207	សំរោងជ្រៃ	Samraong Chrey	210212
21021208	ទួលល្ហុង	Tuol Lhong	210212
21021209	នាល	Neal	210212
21021210	តាំងដូង	Tang Doung	210212
21021301	ត្នោត	Tnaot	210213
21021302	រំចេក	Rumchek	210213
21021303	តានប់	Ta Nob	210213
21021304	តានន	Ta Non	210213
21021305	ថ្មី	Thmei	210213
21021306	ពៃ	Pey	210213
21021307	ព្រៃជប់	Prey Chob	210213
21021308	ឈើទាល	Chheu Teal	210213
21021401	ត្រពាំងក្រសាំង	Trapeang Krasang	210214
21021402	ធ្លក	Thlok	210214
21021403	រលាំង	Roleang	210214
21021404	ត្រពាំងព្រិច	Trapeang Prich	210214
21021405	កណ្ដាល	Kandal	210214
21021406	ត្រពាំងគៀប	Trapeang Kieb	210214
21021407	ត្នោតជ្រុំ	Tnaot Chrum	210214
21021408	គោដួល	Kou Duol	210214
21021409	រំដួល	Rumduol	210214
21021410	ម្រះព្រៅ	Mreah Prov	210214
21021411	ត្រពាំងធំ	Trapeang Thum	210214
21021412	យាមខៅ	Yeam Khau	210214
21021413	ទឹកថ្លា	Tuek Thla	210214
21021414	រកាពក	Roka Pok	210214
21021415	ត្រាំសសរ	Tram Sasar	210214
21021416	បឹងពញ្ញាគុក	Boeng Ponhea Kuk	210214
21021417	ត្រពាំងចំការ	Trapeang Chamkar	210214
21021501	ពូនភ្នំ	Pun Phnum	210215
21021503	ត្រពាំងទឹម	Trapeang Tuem	210215
21021504	រកាខ្ពស់	Roka Khpos	210215
21021505	ខ្សាច់លប់	Khsach Lob	210215
21021506	រលាំងគ្រើល	Roleang Kreul	210215
21021507	ចក	Chak	210215
21021508	ត្រពាំងសាប	Trapeang Sab	210215
21021509	តាស៊ូ	Ta Su	210215
21021510	សង្កែ	Sangkae	210215
21021511	ស្មៅខ្ញី	Smau Khnhei	210215
21021512	អាជាំង	A Cheang	210215
21021513	ព្រេច	Prech	210215
21021514	ស្ដុកប្រីយ៍	Sdok Prei	210215
21021515	ដើមក្រាយ	Daeum Kray	210215
21021516	ត្រកៀត	Trakiet	210215
21030101	អង្គក្រូច	Angk Krouch	210301
21030102	ស្នាយដួច	Snay Duoch	210301
21030103	កំពង់អំពិល	Kampong Ampil	210301
21030104	អន្លង់នៀន	Anlong Nien	210301
21030105	ក្អែកយំ	k'aek yum	210301
21030106	ដើមគរ	Daeum Kor	210301
21030107	ព្រែកខ្សាច់	Preaek Khsach	210301
21030201	សង្កែជួរ	Sangkae Chuor	210302
21030202	ជ័យជោគ	Chey Chouk	210302
21030203	គោកបញ្ចា	Kouk Panhcha	210302
21030204	អញ្ចាញ	Anhchanh	210302
21030205	ដីលើក	Dei Leuk	210302
21030206	តារាគមន៍	Tara Kom	210302
21030207	បន្ទាយស្លឹក	Banteay Sloek	210302
21030301	តាសៃ	Ta Sai	210303
21030302	សូភី	Souphi	210303
21030303	រទេះភ្លូក	Roteh Phluk	210303
21030304	ត្រពាំងទន្លេ	Trapeang Tonle	210303
21030305	អាចម៍ទន្សាយ	Ach Tonsay	210303
21030306	ដូងខ្ពស់	Doung Khpos	210303
21030307	តារស់	Ta Ros	210303
21030308	តាយឹង	Ta Yueng	210303
21030309	ត្រើយឃ្លោក	Traeuy Khlouk	210303
21030310	អង្កាញ់	Angkanh	210303
21030311	ជ្រៃងោក	Chrey Ngouk	210303
21030312	ព្រៃម្លប់	Prey Mlob	210303
21030401	បូរីជលសារ	Borei Cholsar	210304
21030402	កំពង់ក្រសាំង	Kampong Krasang	210304
21030403	ក្ដុលជ្រុំ	Kdol Chrum	210304
21030404	សង្គមមានជ័យ	Sangkom Mean chey	210304
21030405	ថ្មបីដុំ	Thma Bei Dom	210304
21030501	កណ្ដោល	Kandaol	210305
21030502	ពងទឹក	Pong Tuek	210305
21030503	ជ្រៃគោកពោធិ៍	Chrey Kouk Pou	210305
21030504	ព្រៃមូល	Prey Mul	210305
21030505	ព្រៃហៀវ	Prey Hiev	210305
21030506	អ្នកតាត្បាល់	Neak Ta Tbal	210305
21030507	កំពង់យោល	Kampong Youl	210305
21030508	ថ្មស	Thma Sa	210305
21040101	ពោធិ៍តាម៉ុក	Pou Ta Mok	210401
21040102	រនាមត្នោត	Roneam Tnaot	210401
21040103	ប្រជ្រាយ	Prachreay	210401
21040104	អង្គប្រាសាទ	Angk Prasat	210401
21040105	ភ្ងាស	Phngeas	210401
21040106	វត្ដស្វាយ	Voat Svay	210401
21040107	ភ្នំលន្ទះ	Phnum Lonteah	210401
21040108	ទួលស្វាយ	Tuol Svay	210401
21040109	ស្វាយធំ	Svay Thum	210401
21040110	ក្របាក់	Kra Bak	210401
21040201	ពោធិ៍ខ្វិត	Pou Khvet	210402
21040202	កំពង់	Kampong	210402
21040203	ត្រពាំងស្រង់	Trapeang Srang	210402
21040204	ត្រើយទន្លាប់	Traeuy Tonloab	210402
21040205	ព្រៃធំ	Prey Thum	210402
21040206	ពោធិ៍រោង	Pou Roung	210402
21040207	ជ្រោយ	Chrouy	210402
21040208	ពោធិ៍	Pou	210402
21040209	កំពង់ថ្មី	Kampong Thmey	210402
21040301	កំណប់	Kamnab	210403
21040302	ក្រងុល	Krangol	210403
21040303	ដើមស្លែង	Daeum Slaeng	210403
21040304	ខ្មល់	Khmal	210403
21040305	ពោធិ៍សង្កែ	Pou Sangkae	210403
21040306	ចំការទៀប	Chamkar Tieb	210403
21040401	តាពៅ	Ta Pov	210404
21040402	ធំ	Thum	210404
21040403	វត្ដភ្នំ	Voat Phnum	210404
21040404	អាងខ្ចៅ	Ang Khchau	210404
21040405	ជីម្រាក់	Chi Mreak	210404
21040406	ហាន់ទា	Han Tea	210404
21040407	អណ្ដូងជ្រុង	Andoung Chrung	210404
21040408	ពន្លៃ	Ponley	210404
21040409	តាមែង	Ta Meaeng	210404
21040410	ស្វាយវល្លិ	Svay Voa	210404
21040411	ប្រាសាទ	Prasat	210404
21040412	ពោធិ៍បាយ	Pou Bay	210404
21040413	ច្រកជើគាំ	Chrak Cheu Koam	210404
21040501	ចំបក់ទឹម	Chambak Tuem	210405
21040502	ព្រៃតាម៉ៅ	Prey Ta Mau	210405
21040503	ដើមបេង	Daeum Beng	210405
21040504	ព្រាល	Preal	210405
21040505	ចេក	Chek	210405
21040506	ជ្រោយស្លែង	Chrouy Slaeng	210405
21040601	ត្រពាំងព្រីង	Trapeang Pring	210406
21040602	ក្បាលដំរី	Kbal Damrei	210406
21040603	គោកព្រេច	Kouk Prech	210406
21040604	ជីឃ្មល់	Chi Khmol	210406
21040605	ឈើនៀងខ្ពស់	Chheu Nieng Khpos	210406
21040606	ស្លែង	Slaeng	210406
21040607	សំរោងខាងកើត	Samraong Khang Kaeut	210406
21040608	សំរោងខាងលិច	Samraong Khang Lech	210406
21040609	ចំបក់	Chambak	210406
21040610	អណ្ដូងធំ	Andoung Thum	210406
21040611	គោកគ្រួស	Kouk Kruos	210406
21040612	ព្រៃជើង	Prey Cheung	210406
21040613	បាម	Bam	210406
21040701	ផ្សារ	Phsar	210407
21040702	តាឡឹង	Ta Loeng	210407
21040703	កណ្ដាល	Kandal	210407
21040704	តារុង	Ta Rung	210407
21040705	ជ្វា	Chvea	210407
21040706	អណ្ដូងគៀន	Andoung Kien	210407
21040707	ធំ	Thum	210407
21040708	ទទឹង	Totueng	210407
21040709	ថ្មី	Thmei	210407
21040801	ព្រៃលៀប	Prey Lieb	210408
21040802	ខ្វាវ	Khvav	210408
21040803	ត្រពាំងព្រីង	Trapeang Pring	210408
21040804	អំរ៉ែ	Amrae	210408
21040805	សុបិណ	Soben	210408
21040806	ព្រៃអំពក	Prey Ampok	210408
21040807	ថ្នល់លោក	Thnal Louk	210408
21040808	ពុម្ពអិដ្ឋ	Pump Edth	210408
21040809	ឈើទាលភ្លោះ	Chheu Teal Phluoh	210408
21040901	ភ្នំក្រពើ	Phnum Krapeu	210409
21040902	បួរ	Buor	210409
21040903	ចំរេះ	Chamreh	210409
21040904	ដំណាក់ថ្ងាន់	Damnak Thngan	210409
21040905	បពល	Bapol	210409
21040906	ត្រពាំងជ័យ	Trapeang Chey	210409
21040907	ដីក្រហម	Dei Kraham	210409
21040908	ត្រពាំងវែង	Trapeang Veaeng	210409
21040909	ត្រពាំងពិដោរ	Trapeang Pidaor	210409
21040910	ព្រៃរំដេង	Prey Rumdeng	210409
21040911	បឹងទំនប់	Boeng Tumnob	210409
21041001	ស្វាយស	Svay Sa	210410
21041002	ត្រយឹង	Trayueng	210410
21041003	ត្រពាំងរុន	Trapeang Run	210410
21041004	រាមអណ្ដើក	Ream Andaeuk	210410
21041005	ត្រពាំងខ្ចៅ	Trapeang Khchau	210410
21041006	កោះកុសល	Kaoh Kosal	210410
21041007	គោករកា	Kouk Roka	210410
21041008	ពង្រ	Pongro	210410
21041101	ទួលពង្រ	Tuol Pongro	210411
21041102	ស្រែឃ្មួញ	Srae Khmuonh	210411
21041103	ស្រែកែស	Srae Kaes	210411
21041104	ព្រាល	Preal	210411
21041105	ថ្មី	Thmei	210411
21041106	ពីងពង់	Ping Pong	210411
21041107	សោម	Saom	210411
21041108	ដើមរំដែល	Daeum Rumdael	210411
21041109	ដើមអង្កោល	Daeum Angkaol	210411
21041110	នាសារគិរី	Neasar Kiri	210411
21041111	ទន្លាប់	Tonloab	210411
21041112	ត្រពាំងពងទឹក	Trapeang Pong Tuek	210411
21041201	ក្រសាំងពុល	Krasang Pul	210412
21041202	រលៀក	Roliek	210412
21041203	ស្លា	Sla	210412
21041204	ដោម	Daom	210412
21041205	ជាវប្ដីខាងកើត	Cheav Bdei Khang Kaeut	210412
21041206	ជាវប្ដីខាងលិច	Cheav Bdei Khang Lech	210412
21041207	គ្រាំងទ្រមូង	Krang Tro Mung	210412
21041208	តាអូរខាងជើង	Ta Ou Khang Cheung	210412
21041209	តាអូរខាងត្បូង	Ta Ou Khang Tboung	210412
21050101	ដើមដូង	Daeum Doung	210501
21050102	បេង	Beng	210501
21050103	ក្រពុំឈូក	Krapum Chhuk	210501
21050104	ព្រៃម្លូ	Prey Mlu	210501
21050105	ពាន្នី	Peani	210501
21050106	តាពរ	Ta Por	210501
21050107	ត្រពាំងតាអ៊ុយ	Trapeang Ta Uy	210501
21050108	កោះមាន់	Kaoh Moan	210501
21050109	វត្ដស្លា	Voat Sla	210501
21050110	ជ្រោយពោន	Chrouy Poun	210501
21050111	ខ្លាគ្រហឹម ក	Khla Krohuem Ka	210501
21050112	ខ្លាគ្រហឹម ខ	Khla Krohuem Kha	210501
21050113	ត្រពាំងទន្លេ	Trapeang Tonle	210501
21050201	តាបួ	Ta Buo	210502
21050202	ជន្ទល់មេឃ	Chontol Mekh	210502
21050203	ព្រៃធំ	Prey Thum	210502
21050204	ដំណាក់	Damnak	210502
21050205	ព្រៃបាយ	Prey Bay	210502
21050206	គោកដូង	Kouk Doung	210502
21050207	ត្រពាំងក្រសាំង	Trapeang Krasang	210502
21050208	តាមោក	Ta Mouk	210502
21050209	ពោធិ	Pou	210502
21050210	ពោន	Poun	210502
21050211	ពេជសារ	Pech Sar	210502
21050212	ស្លែង	Slaeng	210502
21050213	ស្ដៅ	Sdau	210502
21050214	ចុងអង្ករ	Chong Angkar	210502
21050215	អង្គុញ	Angkunh	210502
21050216	តាបស	Ta Baoh	210502
21050217	គោកខ្ពស់	Kouk Khpos	210502
21050301	ស្រម៉	Srama	210503
21050302	ស្រែបឹង	Srae Boeng	210503
21050303	ព្រៃមេលងខាងត្បូង	Prey Melong Khang Tboung	210503
21050304	ព្រៃមេលងខាងជើង	Prey Melong Khang Cheung	210503
21050305	កន្សោមអក	Kansaom Ak	210503
21050306	ចំបក់	Chambak	210503
21050307	សំភ្លី	Samphli	210503
21050308	គរ	Kor	210503
21050309	តាំងរាសី	Tang Reasei	210503
21050310	ព្រៃខ្លាខាងជើង	Prey Khla Khang Cheung	210503
21050311	ព្រៃខ្លាខាងត្បូង	Prey Khla Khang Tboung	210503
21050312	បន្ទាយធ្លាយ	Banteay Thleay	210503
21050313	កែវកាំភ្លើង	Kaev Kamphleung	210503
21050314	ទួលកណ្ដាល	Tuol Kandal	210503
21050315	ជំរំ	Chumrum	210503
21050401	តាញឹម	Ta Nhuem	210504
21050402	ព្រៃបាយ	Prey Bay	210504
21050403	តាភិន	Ta Phin	210504
21050404	តាផាន់	Ta Phan	210504
21050405	តាហៀន	Ta Hien	210504
21050406	ពងអណ្ដើក	Pong Andaeuk	210504
21050501	រមេញខាងត្បូង	Romenh Khang Tboung	210505
21050502	រមេញខាងជើង	Romenh Khang Cheung	210505
21050503	ដើមចាន់	Daeum Chan	210505
21050504	មានាគ	Mea Neak	210505
21050505	ដើមក្រូច	Daeum Krouch	210505
21050506	ប្រឡាយមាស	Pralay Meas	210505
21050507	ចំបក់ឯម	Chambak Aem	210505
21050508	សំរោង	Samraong	210505
21050509	ប្រាសាទ	Prasat	210505
21050510	ដើមពោធិ	Daeum Pou	210505
21050601	រលួស	Roluos	210506
21050602	លៀប	Lieb	210506
21050603	ត្រពាំងកក់	Trapeang Kak	210506
21050604	អណ្ដូងសំរិទ្ធិ	Andoung Samretth	210506
21050605	រូង	Rung	210506
21050606	ព្នៅ	Pnov	210506
21050607	ស៊ីស្លា	Si Sla	210506
21060101	ត្រពាំងរកា	Trapeang Roka	210601
21060102	បា នយ	Ba Noy	210601
21060103	ផ្សារជ្រែ	Phsar Chreae	210601
21060104	ព្រីង	Pring	210601
21060105	ស្វាយពារ	Svay Pear	210601
21060106	អង្កាញ់	Angkanh	210601
21060201	សំរោងម្រះ	Samraong Mreah	210602
21060202	ដូងខ្ពស់	Doung Khpos	210602
21060203	ថ្លុកដូនទុំ	Thlok Doun Tum	210602
21060204	ថ្នល់បត់	Thnal Bat	210602
21060205	សេដ្ឋី	Sedthei	210602
21060206	ពន្ទង	Pontong	210602
21060207	តាវង់	Ta Vong	210602
21060301	ពន្សាំង	Ponsang	210603
21060302	ឫស្សីថ្មី	Ruessei Thmei	210603
21060303	ជ្រយ	Chroy	210603
21060304	ជំពូព្រឹក្ស	Chumpu Proeks	210603
21060305	ចំប៉ា	Champa	210603
21060306	សំរោង	Samraong	210603
21060307	ដង្ហឹត	Danghoet	210603
21060308	ចេក	Chek	210603
21060309	រនាមពេជ្រ	Roneam Pechr	210603
21060401	អំពិលលិច	Ampil Lech	210604
21060402	អំពិលកើត	Ampil Kaeut	210604
21060403	ស្រែពោធិ	Srae Pou	210604
21060404	ចារ	Char	210604
21060405	ច័ន្ទមង្គល	Chant Mongkol	210604
21060406	ស្លា	Sla	210604
21060407	បាំងបាត់	Bang Bat	210604
21060408	ស្វាយចាល់	Svay Chal	210604
21060409	អង្គស្វាយចេក	Angk Svay Chek	210604
21060501	តាមូង	Ta Mung	210605
21060502	ចង្កើប	Changkaeub	210605
21060503	តាឡូង	Ta Loung	210605
21060504	ថ្មី	Thmei	210605
21060505	កំពែងធំ	Kampeaeng Thum	210605
21060506	កំពែងត្បូង	Kampeaeng Tboung	210605
21060507	អង្គជ្រូក	Angk Chruk	210605
21060508	ចំណោម	Chamnaom	210605
21060509	ត្រពាំងអង្គ	Trapeang Angk	210605
21060601	ពាម	Peam	210606
21060602	ជំនីក	Chumnik	210606
21060603	កញ្ចិល	Kanhchel	210606
21060604	កំពង់លាវ	Kampong Leav	210606
21060605	កំពង់រាប	Kampong Reab	210606
21060606	កំពង់សាម៉	Kampong Sama	210606
21060607	ក្លែងគង់	Klaeng Kong	210606
21060701	ត្រពាំងស្វាយ	Trapeang Svay	210607
21060702	សម្ដេចពាន់	Samdach Poan	210607
21060703	ក្ដាញ់	Kdanh	210607
21060704	ក្ប៉ម	Kpam	210607
21060705	វាល	Veal	210607
21060706	ក្រាំងវិច	Krang Vich	210607
21060707	អង្គ	Angk	210607
21060801	ក្ដីតាហុក	Kdei Ta Hok	210608
21060802	ថ្នល់បត់	Thnal Bat	210608
21060803	ស្វាយសំរោង	Svay Samraong	210608
21060804	អង្គសង្កែ	Angk Sangkae	210608
21060805	ក្រសាំង	Krasang	210608
21060806	ព្រៃតាពង	Prey Ta Pong	210608
21060807	គោកអង្គង់	Kouk Angkong	210608
21060808	សម៉លាវ	Sama Leav	210608
21060809	សម៉ខ្មែរ	Sama Khmer	210608
21060810	គរ	Kor	210608
21060811	គោកកញ្ចាប	Kouk Kanhchab	210608
21060901	ពេជចង្វា	Pech Changva	210609
21060902	ត្រពាំងក្រូច	Trapeang Krouch	210609
21060903	ព្រៃកប្បាស ក	Prey Kabbas Ka	210609
21060904	ព្រៃកប្បាស ខ	Prey Kabbas Kha	210609
21060905	ព្រៃកប្បាស គ	Prey Kabbas Ko	210609
21060906	សំចត	Samchat	210609
21060907	ព្រៃព្រុំ	Prey Prum	210609
21060908	ដើមពោធិ	Daeum Pou	210609
21060909	អំពិលរៀង	Ampil Rieng	210609
21060910	អូរ	Ou	210609
21061001	ព្រៃល្វាកើត	Prey Lvea Kaeut	210610
21061002	ព្រៃល្វាលិច	Prey Lvea Lech	210610
21061003	អន្លុងមាស	Anlong Meas	210610
21061004	តាខុន	Ta Khon	210610
21061005	អង្គក្រសាំង	Angk Krasang	210610
21061006	ល្វាត្នោត	Lvea Tnaot	210610
21061101	ព្រៃរបង	Prey Robang	210611
21061102	គោកទ្រា	Kouk Trea	210611
21061103	ព្រៃផ្ដៅត្បូង	Prey Phdau Tboung	210611
21061104	ព្រៃផ្ដៅជើង	Prey Phdau Cheung	210611
21061105	ត្រពាំងធំ	Trapeang Thum	210611
21061106	ជុំរំ	Chumrum	210611
21061107	សៃវ៉ា	Saiva	210611
21061108	ព្រៃភ្ញី	Prey Phnhi	210611
21061109	ព្រៃឈើទាល	Prey Chheu Teal	210611
21061110	ដុង	Dong	210611
21061111	ស្មន់មុនី	Sman Muni	210611
21061201	ក្រាំង	Krang	210612
21061202	ទង្គែ	Tongkeae	210612
21061203	ស្នោ	Snao	210612
21061204	រកា	Roka	210612
21061205	ធម្មវិន័យ	Thomm Viney	210612
21061206	ត្រពាំងរាំង	Trapeang Reang	210612
21061301	ត្រពាំងទា	Trapeang Tea	210613
21061302	ព្រៃចំបក់	Prey Chambak	210613
21061303	ត្រពាំងស្ដុក	Trapeang Sdok	210613
21061304	ស្នូលខ្ពស់	Snoul Khpos	210613
21061305	ក្រាំងអំពិល	Krang Ampil	210613
21061306	ក្រាំងចំរើន	Krang Chamraeun	210613
21061307	ជំរៅ	Chumrov	210613
21061308	កែវចំរើន	Kaev Chamraeun	210613
21061309	រលួស	Roluos	210613
21061310	ច្រនៀងខ្ពស់	Chranieng Khpos	210613
21061311	អង្គ រវាយ	Angk Roveay	210613
21061312	សំបូរ	Sambour	210613
21070101	ខ្នាចខាងជើង	Khnach Khang Cheung	210701
21070102	ខ្នាចខាងត្បូង	Khnach Khang Tboung	210701
21070103	ឈើទាល	Chheu Teal	210701
21070104	ពេជឥន្ទ្រា	Pech Entrea	210701
21070105	រមន់	Romon	210701
21070106	បីពៃ	Bei Pey	210701
21070107	ពេជចង្វា	Pech Changva	210701
21070108	អង្គរាំង	Angk Reang	210701
21070109	កូនរមាស	Koun Romeas	210701
21070201	ដក់ពរ	Dak Por	210702
21070202	ស្រីជ័យ	Srei Chey	210702
21070203	ខ្នាររុង	Khnar Rung	210702
21070204	បឹងត្រាញ់	Boeng Tranh	210702
21070205	តាសំ	Ta Sam	210702
21070206	មហារាជ	Moha Reach	210702
21070207	ហង់ហេង	Hang Heng	210702
21070208	កំប៉ោរ	Kampaor	210702
21070209	ត្រពាំងវែង	Trapeang Veaeng	210702
21070210	តាដក់ពង	Tadak Pong	210702
21070301	ត្រពាំងវែង	Trapeang Veaeng	210703
21070302	តាមៅ	Ta Mau	210703
21070303	ត្រពាំងវិហារ	Trapeang Vihear	210703
21070304	ត្បាច	Tbach	210703
21070305	តាខូយ	Ta Khouy	210703
21070306	ជើងគួន	Cheung Kuon	210703
21070307	ពន្សាំង	Ponsang	210703
21070308	អញ្ចាញ	Anhchanh	210703
21070309	ថ្កូវ	Thkov	210703
21070310	ក្រាំងឡង	Krang Lang	210703
21070311	ស្វាយចេក	Svay Chek	210703
21070401	ស្រែតាសុខ	Srae Ta Sokh	210704
21070402	ស្វាយរន្ធ	Svay Ron	210704
21070403	ធ្លកដំណាក់ហ្លួង	Thlok Damnak Luong	210704
21070404	ត្រមែង	Tramaeng	210704
21070405	ដំណាក់ត្រយឹង	Damnak Trayueng	210704
21070406	តាយឹង	Ta Yueng	210704
21070407	ព្រៃខ្លា	Prey Khla	210704
21070408	ពន្លឺ	Ponlueu	210704
21070409	កន្សោមក្លែង	Kansaom Khlaeng	210704
21070410	ត្រពាំងខ្នារ	Trapeang Khnar	210704
21070411	អង្គរផ្ដៀក	Angkor Phdiek	210704
21070412	ជំរះពេន	Chumreah Pen	210704
21070413	ស្លែង	Slaeng	210704
21070414	ត្រពាំងរំដួល	Trapeang Rumduol	210704
21070415	បឹង	Boeng	210704
21070416	ត្រពាំងចំបក់	Trapeang Chambak	210704
21070417	ព្រៃនាងពួន	Prey Neang Puon	210704
21070418	ស្នែងរមាំង	Snaeng Romeang	210704
21070419	ព្រៃស្នួល	Prey Snuol	210704
21070501	លាក់រទេះ	Leak Roteh	210705
21070502	ត្រពាំងរាំង	Trapeang Reang	210705
21070503	ព្រៃជ័រ	Prey Choar	210705
21070504	វះពោះ	Veah Puoh	210705
21070505	ត្រពាំងឃ្លោក	Trapeang Khlouk	210705
21070506	អង្គុញ	Angkunh	210705
21070507	ត្រាំគល់	Tram Kol	210705
21070508	កាប់នឹម	Kab Nuem	210705
21070509	ពោធិ៍	Pou	210705
21070510	ខ្វាវ	Khvav	210705
21070511	បឹង	Boeng	210705
21070512	អូរ	Ou	210705
21070513	ត្រពាំងធ្នុង	Trapeang Thnong	210705
21070514	ត្រពាំងពួន	Trapeang Puon	210705
21070515	ព្រៃញឹក	Prey Nhuek	210705
21070516	ស្វាយទង	Svay Tong	210705
21070517	ទួលតាចិន	Tuol Ta Chen	210705
21070518	ត្រពាំងត្របែក	Trapeang Trabaek	210705
21070601	លំចង់	Lumchang	210706
21070602	ស្វាយព្រៃ	Svay Prey	210706
21070603	ពងទឹក	Pong Tuek	210706
21070604	ក្ដុល	Kdol	210706
21070605	ធម្មន័យ	Thommoney	210706
21070606	ទួលទ្រា	Tuol Trea	210706
21070607	តាមូង	Ta Muong	210706
21070608	រូង	Rung	210706
21070609	ខ្វាវ	Khvav	210706
21070610	ប្រសៀត	Prasiet	210706
21070701	ត្រពាំងខ្នារ	Trapeang Khnar	210707
21070702	កុកតារៀ	Kok Ta Rie	210707
21070703	ត្រពាំងទ្រា	Trapeang Trea	210707
21070704	ទឹកអំបិល	Tuek Ambel	210707
21070705	ព្រៃខ្ជាយ	Prey Khcheay	210707
21070706	តោល	Taol	210707
21070707	ថ្មី	Thmei	210707
21070708	រវៀង	Rovieng	210707
21070709	ក្រាំងលាវ	Krang Leav	210707
21070710	ត្រពាំងឈូក	Trapeang Chhuk	210707
21070711	ត្រពាំងស្ទង	Trapeang Storng	210707
21070712	ត្រពាំងវែង	Trapeang Veaeng	210707
21070713	ចន្លាត់ដៃ	Chanloat Dai	210707
21070714	ស្រមោចហែរ	Sramaoch Haer	210707
21070715	ត្រពាំងស្ដុក	Trapeang Sdok	210707
21070716	គ្រួស	Kruos	210707
21070717	ដក់ពរ	Dak Por	210707
21070718	កណ្ដាល	Kandal	210707
21070719	ក្រាំងធ្នង់	Krang Thnong	210707
21070720	ព្រៃស្នួល	Prey Snuol	210707
21070721	វាយឈ្នះ	Veay Chhneah	210707
21070722	ចារ	Char	210707
21070723	ដើមធ្លក	Daeum Thlok	210707
21070801	កន្សោមអក	Kansaom Ak	210708
21070802	ដីក្រហម	Dei Kraham	210708
21070803	ព្រៃទទឹង	Prey Totueng	210708
21070804	សំរោង	Samraong	210708
21070805	ទួលចារ	Tuol Char	210708
21070806	តាពោនខាងកើត	Ta Poun Khang Kaeut	210708
21070807	តាពោនខាងលិច	Ta Poun Khang Lech	210708
21070808	ក្រាំងរអូត	Krang Roout	210708
21070809	ស្វាយ	Svay	210708
21070901	ឈូកសខាងជើង	Chhuk Sa Khang Cheung	210709
21070902	ឈូកសខាងត្បូង	Chhuk Sa Khang Tboung	210709
21070903	ក្ដី	Kdei	210709
21070904	ព្រៃខ្លា	Prey Khla	210709
21070905	ត្រពាំងកី	Trapeang Kei	210709
21070906	វែង	Veaeng	210709
21070907	ទន្លាប់	Tonloab	210709
21070908	ប៉ាណា	Pa Na	210709
21070909	កាយបាំង	Kay Bang	210709
21070910	ក្រាំងត្រែង	Krang Traeng	210709
21070911	សឹង្ហ	Soengh	210709
21070912	ត្រពាំងប្រីយ៍	Trapeang Prei	210709
21070913	អង្គក្ដី	Angk Kdei	210709
21070914	ក្រាំងស្ដៅ	Krang Sdau	210709
21071001	ស្លាខាងលិច	Sla Khang Lech	210710
21071002	ស្លាខាងកើត	Sla Khang Kaeut	210710
21071003	អង្គចង្អេរ	Angk Chang'er	210710
21071004	ត្រពាំងត្រាវ	Trapeang Trav	210710
21071005	កន្ទ្រង់ព្រិច	Kantrong Prech	210710
21071006	បឹងកន្ទ្រន់	Boeng Kantron	210710
21071007	ត្រពាំងស្រង់	Trapeang Srang	210710
21071008	ពោធិ	Pou	210710
21071009	អំពិល	Ampil	210710
21071010	កញ្ចាង	Kanhchang	210710
21071011	ស្រីបណ្ឌិត	Srei Bandit	210710
21071012	ស្រីប្រសើរ	Srei Prasaeur	210710
21071013	អារោង	A Roung	210710
21071101	វែង	Veaeng	210711
21071102	ក្បាលសំរោង	Kbal Samraong	210711
21071103	ឫស្សីជុំ	Ruessei Chum	210711
21071104	សែនភាស	Saen Pheas	210711
21071105	ត្នោតទេរ	Tnaot Ter	210711
21071106	ដូនតី	Dountei	210711
21071107	សំបួរ	Sambuor	210711
21071108	ទ្រាលើ	Trea Leu	210711
21071109	កំពង់ទ្រា	Kampong Trea	210711
21071110	ធ្មា	Thmea	210711
21071111	ដូង	Doung	210711
21080101	ធន់មន់ខាងជើង	Thon Mon Khang Cheung	210801
21080102	ធន់មន់ខាងត្បូង	Thon Mon Khang Tboung	210801
21080103	ឫស្សី	Ruessei	210801
21080104	ជ្រោយប្រឃរ	Chrouy Prakhor	210801
21080105	ស្វាយជ្រុំ	Svay Chrum	210801
21080106	ដូនពែង	Doun Peaeng	210801
21080107	ស្វាយឫស្សី	Svay Ruessei	210801
21080108	ខាន់ខាវ	Khan Khav	210801
21080109	ត្រពាំងឫស្សី	Trapeang Ruessei	210801
21080110	ក្រចាប់	Krachab	210801
21080111	ត្រពាំងលាក់	Trapeang Leak	210801
21080112	ចុងថ្នល់	Chong Thnal	210801
21080113	ក្រាំងតាពូង	Krang Ta Pung	210801
21080114	ជ្រោយសំរោង	Chrouy Samraong	210801
21080201	ចក	Chak	210802
21080202	ផ្សារតាកោ	Phsar Ta Kao	210802
21080203	សំបួរ	Sambuor	210802
21080204	ខ្សឹង	Khsoeng	210802
21080205	អូរស្វាយចេក	Ou Svay Chek	210802
21080206	ច្រេស	Chres	210802
21080207	ព្រៃព្រហ្ម	Prey Prum	210802
21080208	ឡូរី	Louri	210802
21080209	ភូមិ១	Phum Muoy	210802
21080210	ភូមិ២	Phum Pir	210802
21080211	ភូមិ៣	Phum Bei	210802
21080212	ស្នោរ	Snaor	210802
21080301	ទំនប់	Tumnob	210803
21080302	ត្រាំ	Tram	210803
21080303	ព្រហូត	Prohut	210803
21080304	តាឌូ	Ta Du	210803
21080305	ថ្នល់បែក	Thnal Baek	210803
21080306	ថ្មី	Thmei	210803
21080307	ត្រពាំងសាលា	Trapeang Sala	210803
21080308	បិនម៉ៅ	Ben Mau	210803
21080309	សូរ្យច័ន្ទ	Souchan	210803
21080310	ត្រពាំងផ្លុង	Trapeang Phlong	210803
21080311	ព្រេច	Prech	210803
21080312	តុំ	Tom	210803
21080313	ធ្នង់	Thnong	210803
21080314	ត្រពាំងអង្គ	Trapeang Angk	210803
21090101	ស្រុកចេក	Srok Chek	210901
21090102	ព្រៃដំរី	Prey Damrei	210901
21090103	ព្រៃស្រោង	Prey Sraong	210901
21090104	ព្រៃឈើទាលលើ	Prey Chheu Teal Leu	210901
21090105	ឈើទាលប្រគាប	Chheu Teal Prakeab	210901
21090106	ព្រៃឈើទាលក្រោម	Prey Chheu Teal Kraom	210901
21090107	អង្គតាសោម	Angk Ta Saom	210901
21090108	ត្រពាំងខ្នារ	Trapeang Khnar	210901
21090109	សេកយា	Sek Yea	210901
21090110	អូរផុត	Ou Phot	210901
21090111	ខ្នាទៃ	Khna Tey	210901
21090112	ព្រៃរំដេង	Prey Rumdeng	210901
21090113	ត្រពាំងចែង	Trapeang Chaeng	210901
21090114	អង្គត្នោតលិច	Angk Tnaot Khang Lech	210901
21090115	ត្រពាំងស្រងែ	Trapeang Srangae	210901
21090116	អង្គត្នោតកើត	Angk Tnaot Khang Kaeut	210901
21090117	ចំការដៀប	Chamkar Dieb	210901
21090118	ស្មន់ព្រាម	Sman Pream	210901
21090119	ត្រពាំងត្របែក	Trapeang Trabaek	210901
21090120	ព្រៃព្រាយ	Prey Peay	210901
21090121	ត្រពាំងខ្លូត	Trapeang Khlout	210901
21090122	អង្គរមឿង	Angkor Moeang	210901
21090201	ស្រែខ្វាវ	Srae Khvav	210902
21090202	តារាប	Ta Reab	210902
21090203	អង្គក្រឡាញ់	Angk Kralanh	210902
21090204	អង្គបក្សី	Angk Baksei	210902
21090205	ទួលរកា	Tuol Roka	210902
21090206	ត្រពាំងស្រង៉ែ	Trapeang Srangae	210902
21090207	ទទឹងថ្ងៃ	Totueng Thngai	210902
21090208	ត្រពាំងទឹក	Trapeang Tuek	210902
21090209	តាតឹម	Ta Toem	210902
21090210	មឿងចារ	Moeang Char	210902
21090211	ត្រពាំងពោធិ៍	Trapeang Pou	210902
21090212	សណ្ដោ	Sandao	210902
21090213	ទីប៉ាត់	Ti Pat	210902
21090214	ស្រែគ្រួ	Srae Kruo	210902
21090215	ទួលត្បែង	Tuol Tbaeng	210902
21090216	នមោ	Nomou	210902
21090301	គុសថ្មី	Kus Thmei	210903
21090302	ទឹកថ្លា	Tuek Thla	210903
21090303	ទំនប់ជ្រៃ	Tumnob Chrey	210903
21090304	ខ្នាចចោរ	Khnach Chaor	210903
21090305	អកពង	Ak Pong	210903
21090306	មានជ័យ	Mean Chey	210903
21090307	អង្គក្រឡាញ់	Angk Kralanh	210903
21090308	អង្គតាង៉ិល	Angk Ta Ngel	210903
21090309	ឈើទាលថ្គោល	Chheu Teal Thkoul	210903
21090310	ពងទឹកជើង	Pong Tuek Khang Cheung	210903
21090311	ក្រាំងតាចាន់	Krang Ta Chan	210903
21090312	នៀល	Niel	210903
21090313	ត្រពាំងលាន	Trapeang Lean	210903
21090314	ត្មាតពង	Tmat Pong	210903
21090315	ត្រពាំងព្រីង	Trapeang Pring	210903
21090316	ត្រពាំងថ្ម	Trapeang Thma	210903
21090317	តាលាក់ខាងជើង	Ta Leak Khang Cheung	210903
21091007	ពងទឹក	Pong Tuek	210910
21090318	តាលាក់ខាងត្បូង	Ta Leak Khang Tboung	210903
21090319	ត្រពាំងតាសុខ	Trapeang Ta Sokh	210903
21090320	ត្រពាំងអំពិល	Trapeang Ampil	210903
21090321	ចំការទៀង	Chamkar Tieng	210903
21090322	សែនអោក	Saen Aok	210903
21090323	ទន្សោងរោទ៍	Tonsaong Rou	210903
21090324	ត្រពាំងឈើទាល	Trapeang Chheu Teal	210903
21090325	ព្រៃស្នួល	Prey Snuol	210903
21090326	ចំការអង្គខាងជើង	Chamkar Angk Khang Cheung	210903
21090327	ចំការអង្គខាងត្បូង	Chamkar Angk Khang Tboung	210903
21090328	ពងទឹកខាងត្បូង	Pong Tuek Khang Tboung	210903
21090329	អណ្ដូងថ្ម	Andoung Thma	210903
21090330	ព្រៃតាខាប	Prey Ta Khab	210903
21090401	ជ្រែ	Chreae	210904
21090402	ខ្នារ	Khnar	210904
21090403	ព្រៃធាតុ	Prey Theat	210904
21090404	ត្រពាំងគូរ	Trapeang Kur	210904
21090405	ទួលត្បែង	Tuol Tbaeng	210904
21101211	ស្នួល	Snuol	211012
21090406	អង្គគគីរ	Angk Kokir	210904
21090407	ត្រពាំងឈូក	Trapeang Chhuk	210904
21090408	ព្រៃគុយ	Prey Kuy	210904
21090409	អំពិល	Ampil	210904
21090410	អង្គតាកុប	Angk Ta Kob	210904
21090412	កាច់ត្រក	Kach Trak	210904
21090413	ត្រពាំងត្រាច	Trapeang Trach	210904
21090414	ធ្យា	Thyea	210904
21090415	ធ្នង់រលើង	Thnong Roleung	210904
21090416	ត្រពាំងព្រីង	Trapeang Pring	210904
21090417	អង្គតាចាន់	Angk Ta Chan	210904
21090418	ប្រាសាទ	Prasat	210904
21090419	អង្គតានូ	Angk Ta Nu	210904
21090420	បាក់កូត	Bak Kout	210904
21090421	ត្រពាំងកក់	Trapeang Kak	210904
21090422	អង្គនារាយណ៍	Angk Neareay	210904
21090423	ស្លា	Sla	210904
21090424	សីមា	Seima	210904
21090425	សែនបន	Saen Ban	210904
21090501	ដូនទួត	Doun Tuot	210905
21090502	សូទៃ	Soutey	210905
21090503	ក្រញូង	Kranhung	210905
21090504	ត្រពាំងស្នោ	Trapeang Snao	210905
21090505	គុស	Kus	210905
21090506	ស្លែងកោង	Slaeng Kaong	210905
21090507	តាតៃ	Ta Tai	210905
21090508	ឫស្សីស្រុក	Ruessei Srok	210905
21090509	អង្គតាសោម	Angk Ta Saom	210905
21090510	អូរស្ងើន	Ou Sngaeun	210905
21090511	កំសី	Kamsei	210905
21090601	ត្រពាំងដងទឹក	Trapeang Dang Tuek	210906
21090602	ទួលខ្លុង	Tuol Khlong	210906
21090603	សុក្រំ	Sokram	210906
21090604	ត្រពាំងក្រសាំង	Trapeang Krasang	210906
21090605	ត្រពាំងក្រឡាញ់	Trapeang Kralanh	210906
21090606	បឹងសាទង	Boeng Satong	210906
21090607	ត្រពាំងភ្លូ	Trapeang Phlu	210906
21090608	ត្រពាំងខ្ចៅ	Trapeang Khchau	210906
21090609	ដំណាក់ខ្លុង	Damnak Khlong	210906
21090610	ស្ទឹង	Stueng	210906
21090611	ឫស្សីមួយគុម្ព	Ruessei Muoy Kump	210906
21090615	ត្នោតជុំ	Tnaot Chum	210906
21090701	ខ្ពបស្វាយ	Khpob Svay	210907
21090702	ត្រពាំងចក	Trapeang Chak	210907
21090703	ត្រពាំងស្គា	Trapeang Skea	210907
21090704	ត្រពាំងរបង	Trapeang Robang	210907
21090705	ត្រពាំងក្រញូង	Trapeang Kranhoung	210907
21090706	ព្រៃក្ដួច	Prey Kduoch	210907
21090707	ផ្លូវលោក	Phlov Louk	210907
21090708	ព្រៃតាឡូយ	Prey Talouy	210907
21090709	បុស្សតាផង់	Boss Taphong	210907
21090801	ត្រពាំងរុន	Trapeang Run	210908
21090802	ចុងអាង	Chong Ang	210908
21090803	ត្រពាំងត្រកៀត	Trapeang Trakiet	210908
21090804	អង្គរំពាក់	Angk Rumpeak	210908
21090805	ដកវ៉ាន	Dak Van	210908
21090806	តាសូរ	Ta Sour	210908
21090807	តាលឿ	Ta Loea	210908
21090808	រំពាក់ពេន	Rumpeak Pen	210908
21090809	ត្រពាំងថ្លាន់	Trapeang Thlan	210908
21090810	ប្របសៀម	Prab Siem	210908
21090811	រំលេចស្វាយ	Rumlich Svay	210908
21090812	ស្រង៉ែ	Srangae	210908
21090813	ព្រៃឈើទាល	Prey Chheu Teal	210908
21090814	ត្រពាំងឈូក	Trapeang Chhuk	210908
21090901	អង្គគគីរ	Angk Kokir	210909
21090902	ត្រាវអែម	Trav Aem	210909
21090903	តាសិត	Ta Set	210909
21090904	ព្រៃជួរ	Prey Chuor	210909
21090905	ត្រពាំងកក់	Trapeang Kak	210909
21090906	ក្ងោកពង	Kngaok Pong	210909
21090907	ដំណាក់រវាង	Damnak Roveang	210909
21090908	ចមពល	Cham Pol	210909
21090909	ត្រពាំងព្រីង	Trapeang Pring	210909
21090910	រមៀត	Romiet	210909
21090911	ព្រៃមាន	Prey Mean	210909
21090912	ព្រៃឈើទាល	Prey Chheu Teal	210909
21091001	ត្រពាំងចែង	Trapeang Chaeng	210910
21091002	កោះញ៉ៃ	Kaoh Nhai	210910
21091003	ក្របីព្រៃ	Krabei Prey	210910
21091004	ចានទាប	Chan Teab	210910
21091005	ត្រពាំងឈូក	Trapeang Chhuk	210910
21091006	ក្រាំងបន្ទាយ	Krang Banteay	210910
21091008	ប៉ែនមាស	Paen Meas	210910
21091009	តាស្មន់	Ta Sman	210910
21091010	ព្រៃតាដុក	Prey Ta Dok	210910
21091011	ប្រសូត្រថ្មី	Prasoutr Thmei	210910
21091012	ត្រពាំងថ្ម	Trapeang Thma	210910
21091013	តាសោម	Ta Saom	210910
21091014	ព្រៃគគីរ	Prey Kokir	210910
21091015	តាប៉ែន	Ta Paen	210910
21091016	សំបួរ	Sambuor	210910
21091101	ប្រវន័យ	Pravoney	210911
21091102	ត្រពាំងថ្នល់	Trapeang Thnal	210911
21091103	ជ្រៃវែង	Chrey Veaeng	210911
21091104	សាមគ្គី	Sameakki	210911
21091105	ត្រពាំងរនោង	Trapeang Ronoung	210911
21091106	ត្រាច	Trach	210911
21091107	គោករវៀង	Kouk Rovieng	210911
21091108	ធំ	Thum	210911
21091109	តាកែវ	Ta Kaev	210911
21091110	ក្រាំងស្វាយ	Krang Svay	210911
21091111	ត្រពាំងរបើម	Trapeang Robaeum	210911
21091112	ថ្មី	Thmei	210911
21091113	ប្រជុំ	Prachum	210911
21091114	ស្រែឈើនៀង	Srae Chheu Nieng	210911
21091115	ព្រៃមោក	Prey Mouk	210911
21091116	ស្រែថ្លុក	Srae Thlok	210911
21091117	ត្រពាំងទម្លាប់	Trapeang Tomloab	210911
21091201	ម្រុំ	Mrum	210912
21091202	ត្រពាំងអំពិល	Trapeang Ampil	210912
21091203	តាម៉ុច	Ta Moch	210912
21091204	អង្គគគីរ	Angk Kokir	210912
21091205	តាភេម	Ta Phem	210912
21091206	តាសូ	Ta Sou	210912
21091207	ខ្លាគ្រហឹម	Khla Krohuem	210912
21091208	លីញ៉ា	Li Nha	210912
21091209	ប្រស៊ុង	Prasung	210912
21091210	ត្បែងទទឹង	Tbaeng Totueng	210912
21091211	អូរផុត	Ou Phot	210912
21091212	មហាសេនា	Moha Sena	210912
21091213	លាងស្រាយ	Leang Sray	210912
21091214	តាគាំ	Ta Koam	210912
21091215	ពោធិ៍ព្រះសង្ឃ	Pou Preah Sang	210912
21091216	ត្រពាំងកប្បាស	Trapeang Kabbas	210912
21091217	ត្រពាំងស្វាយ	Trapeang Svay	210912
21091218	បាខុងខាងកើត	Ba Khong Khang Kaeut	210912
21091219	បាខុងខាងលិច	Ba Khong Khang Lech	210912
21091220	តាមុំ	Ta Mom	210912
21091221	ប្រវង់	Pravong	210912
21091222	ព្រៃឈើទាល	Prey Chheu Teal	210912
21091223	តាកឹម	Ta Koem	210912
21091301	យាយឡ	Yeay La	210913
21091302	ជ្រៃត្នោត	Chrey Tnaot	210913
21091303	ត្រពាំងរំពាក់	Trapeang Rumpeak	210913
21091304	នៀល	Niel	210913
21091305	ត្រពាំងកែស	Trapeang Kaes	210913
21091306	ត្រពាំងចក	Trapeang Chak	210913
21091307	កល់គម	Kol Kom	210913
21091308	អង្គរនាប	Angk Roneab	210913
21091309	ត្រពាំងឫស្សី	Trapeang Ruessei	210913
21091310	ត្រពាំងខ្លូត	Trapeang Khlout	210913
21091311	បឹងម្កាក់	Boeng Mkak	210913
21091312	ក្រាំងគរ	Krang Kor	210913
21091313	ថ្មកែវ	Thma Kaev	210913
21091401	ពាក់បង្អោង	Peak Bang'aong	210914
21091402	ព្រៃខ្វាវ	Prey Khvav	210914
21091403	ត្រពាំងស្វាយ	Trapeang Svay	210914
21091404	តាសួន	Ta Suon	210914
21091405	ព្រៃក្ដួច	Prey Kduoch	210914
21091406	ព្រៃតាឡី	Prey Ta Lei	210914
21091407	សំរ៉ង	Samrang	210914
21091408	អង្គត្រាវ	Angk Trav	210914
21091409	ពោធិដុះ	Pou Doh	210914
21091410	ព្រៃស្បាត	Prey Sbat	210914
21091411	ព្រៃដក់ពរ	Prey Dak Por	210914
21091501	ត្រពាំងកោះ	Trapeang Kaoh	210915
21091502	ព្រៃក្ដី	Prey Kdei	210915
21091503	ព្រៃរំដួល	Prey Rumduol	210915
21091504	ប្រគៀប	Prakieb	210915
21091505	ត្រពាំងជ្រៃ	Trapeang Chrey	210915
21091506	សំរោង	Samraong	210915
21091507	គោចិនលែង	Kou Chen Leaeng	210915
21091508	ត្រពាំងតាសោម	Trapeang Ta Saom	210915
21091509	ត្រពាំងឈូក	Trapeang Chhuk	210915
21091510	ត្រពាំងត្នោត	Trapeang Tnaot	210915
21091511	ត្រពាំងប្រីយ៍	Trapeang Prei	210915
21091512	ត្រពាំងខន	Trapeang Khan	210915
21091513	ព្រៃព្រាល	Prey Preal	210915
21100101	ព្រៃទូក	Prey Tuk	211001
21100102	រលួស	Roluos	211001
21100103	ត្រពាំងខ្លូត	Trapeang Khlout	211001
21100104	ត្រពាំងឈូក	Trapeang Chhuk	211001
21100105	តារេនជោ	Ta Ren Chou	211001
21100106	ក្រាំងឈើនៀង	Krang Chheu Nieng	211001
21100107	ដឹកម៉ៃ	Doek Mai	211001
21100108	អង្គរការ	Angk Rokar	211001
21100201	ស្ពឺ	Spueu	211002
21100202	គ	Kor	211002
21100203	ត្រពាំងប្រី	Trapeang Prei	211002
21100204	ត្រពាំងរកា	Trapeang Roka	211002
21100205	ព្រៃមាស	Prey Meas	211002
21100206	ស្រែវង្ស	Srae Vong	211002
21100207	តាភាគ	Ta Pheak	211002
21100301	ថ្កូវ	Thkov	211003
21100302	ជួស	Chuos	211003
21100303	ឆ្កែស្លាប់	Chhkae Slab	211003
21100304	អណ្ដែងសាំងជ្វា	Andaeng Sang Chvea	211003
21101302	រវៀង	Rovieng	211013
21100305	អណ្ដែងសាំងខ្មែរ	Andaeng Sang Khmer	211003
21100306	ជ្រែ	Chreae	211003
21100307	រកា	Roka	211003
21100308	យុលចេក	Yul Chek	211003
21100309	បន្ទាយ	Banteay	211003
21100310	ជីខ្មា	Chi Khma	211003
21100401	ពង្រ	Pongro	211004
21100402	តាសឹង	Ta Soeng	211004
21100403	ក្ដី្ករុន	Kdei Run	211004
21100404	កកោះ	Kakaoh	211004
21100405	ស្រម៉លើ	Srama Leu	211004
21100406	ធម្មតា	Thommoda	211004
21100407	ស្រម៉ក្រោម	Srama Kraom	211004
21100408	តាស្រែន	Ta Sraen	211004
21100409	ដូនភើ	Doun Pheu	211004
21100410	ព្រឹសលើ	Prues Leu	211004
21100411	ព្រឹសក្រោម	Prues Kraom	211004
21100501	ត្រពាំងវែង	Trapeang Veaeng	211005
21100502	ដំណាក់រាជា	Damnak Reachea	211005
21100503	ដង្កោ	Dangkao	211005
21100504	ឈើទាលភ្លោះ	Chheu Teal Phluoh	211005
21100505	ប្រាំបីមុំ	Prambei Mum	211005
21100506	ក្រាំងកណ្ដាល	Krang Kandal	211005
21100507	ត្រពាំងលើក	Trapeang Leuk	211005
21100508	ក្រាំងស្បែក	Krang Sbaek	211005
21100509	ពញ្ញាឮ	Ponhea Lueu	211005
21100510	ព្រៃឈើទាល	Prey Chheu Teal	211005
21100511	រវៀង	Rovieng	211005
21100512	ល្វេថ្មី	Lve Thmei	211005
21100601	អូរក្រឡង់ដួល	Ou Kralang Duol	211006
21100602	ត្រពាំងកក់	Trapeang Kak	211006
21100603	អង្គកែវ	Angk Kaev	211006
21100604	ព្រៃរំពាក់	Prey Rumpeak	211006
21100605	ធ្នោះ	Thnuoh	211006
21100606	ត្រពាំងស្នោ	Trapeang Snao	211006
21100607	សេរីដួច	Serei Duoch	211006
21100608	អូរតាសេក	Ou Ta Sek	211006
21100701	ព្រៃសណ្ដែក	Prey Sandaek	211007
21100702	ស្រែច្រក	Srae Chrak	211007
21100703	គោកញ័រ	Kouk Nhoar	211007
21100704	នៀល	Niel	211007
21100705	ព្រៃមៀន	Prey Mien	211007
21100706	ព្រៃស្លឹក	Prey Sloek	211007
21100707	ភ្នំថ្នក់	Phnum Thnak	211007
21100708	ដើមផ្ដៀក	Daeum Phdiek	211007
21100709	ត្រពាំងតាមូង	Trapeang Ta Moung	211007
21100710	បារាយណ៍	Baray	211007
21100711	ត្រពាំងវែង	Trapeang Veaeng	211007
21100712	ស្វាយរំដេង	Svay Rumdeng	211007
21100713	ភ្នំខ្លែង	Phnum Khlaeng	211007
21100714	ត្រពាំងអង្គ	Trapeang Angk	211007
21100715	សង្ហា	Sangha	211007
21100716	សំរោងមានជ័យ	Samraong Mean Chey	211007
21100717	សូរ្យច័ន្ទ	Sour Chant	211007
21100801	ត្រពាំងជ្រៃ	Trapeang Chrey	211008
21100802	ត្រពាំងរំពាក់	Trapeang Rumpeak	211008
21100803	ត្រពាំងធំ	Trapeang Thum	211008
21100804	ធម្មតា	Thommoda	211008
21100805	ថ្មី	Thmei	211008
21100806	ព្រៃផ្អាវ	Prey Ph'av	211008
21100807	ខ្លោងទ្វារ	Khlaong Tvear	211008
21100808	ត្រពាំងខ្នុរ	Trapeang Khnor	211008
21100809	ព្រៃផ្អេរ	Prey Ph'er	211008
21100810	គោកឃ្មោង	Kouk Khmoung	211008
21100811	សូភី	Souphi	211008
21100901	ព្រៃផ្ដៅ	Prey Phdau	211009
21100902	រវៀង	Rovieng	211009
21100903	ព្រៃដកពរ	Prey Dak Por	211009
21100904	ព្រៃភ្លង	Prey Phlong	211009
21100905	ពោធិ៍	Pou	211009
21100906	តាប្រឹម	Ta Proem	211009
21100907	ត្រពាំងពន្លុះ	Trapeang Ponluh	211009
21100908	ក្បាលពោធិ៍	Kbal Pou	211009
21100909	ត្នោតជុំ	Tnaot Chum	211009
21100910	អូរពោធិ៍	Ou Pou	211009
21101001	អង្គតាភោគ	Angk Ta Phouk	211010
21101002	អង្គប្រាង្គរ	Angk Prangkor	211010
21101003	ជ្រៃ	Chrey	211010
21101004	តាព្រះ	Ta Preah	211010
21101005	ក្រាំងត្នោត	Krang Tnaot	211010
21101006	ក្រសាំង	Krasang	211010
21101007	ចិន	Chen	211010
21101008	ពន្លៃ	Ponley	211010
21101009	ស្រះតាកួន	Srah Ta Kuon	211010
21101010	ជីច្រាប	Chi Chrab	211010
21101011	លោក	Louk	211010
21101012	ក្រោម	Kraom	211010
21101101	ស្មោង	Smaong	211011
21101102	ត្រពាំងជ្រៃ	Trapeang Chrey	211011
21101103	កំពង់ជ្រៃ	Kampong Chrey	211011
21101104	ស្គុល	Skul	211011
21101105	ត្រពាំងលើក	Trapeang Leuk	211011
21101201	ត្នោត	Tnaot	211012
21101202	ព្រៃនប់	Prey Nob	211012
21101203	ច្រាំង	Chrang	211012
21101204	ត្រពាំងបបុស្ស	Trapeang Babos	211012
21101205	ត្របែក	Trabaek	211012
21101206	ម៉ឺនទំរង់	Meun Tumrong	211012
21101207	គក	Kok	211012
21101208	ស្វាយអំពារ	Svay Ampear	211012
21101209	កន្ទួត	Kantuot	211012
21101210	ព្រៃរុន្ធ	Prey Run	211012
21101212	ព្រៃឈើទាល	Prey Chheu Teal	211012
21101213	ព្រៃចង្រៀក	Prey Changriek	211012
21101214	គោកអំពៅ	Kouk Ampov	211012
21101215	ពុទ្ធសាំ	Putth Sam	211012
21101301	ត្រពាំងស្លា	Trapeang Sla	211013
21101303	ស្វាយ	Svay	211013
21101304	ក្រាំងធំ	Krang Thum	211013
21101305	ក្រាំងដៃ	Krang Dai	211013
21101306	ចិន	Chen	211013
21101307	ព្រៃវែង	Prey Veaeng	211013
21101308	ឈើទាលបាក់	Chheu Teal Bak	211013
21101309	ព្រៃឈើទាល	Prey Chheu Teal	211013
21101310	ក្រាំងតូច	Krang Touch	211013
21101311	ក្ដីត្នោត	Kdei Tnaot	211013
21101312	សំរោង	Samraong	211013
21101313	សំណខ្មៅ	Samna Khmau	211013
21101314	ក្រាំងធ្នង់	Krang Thnong	211013
21101315	ក្រាំងរោង	Krang Roung	211013
21101316	ពន្លៃ	Ponley	211013
21101317	ល្វេ	Lve	211013
21101318	ជ្រុងគ្រីស	Chrung Kris	211013
21101401	ទន្លេ	Tonle	211014
21101402	ឆឹស	Choes	211014
21101403	ត្រឡាច	Tralach	211014
21101404	សំរោង	Samraong	211014
21101405	ជីងោ	Chingou	211014
21101406	អង្គុញ	Angkunh	211014
21101407	កន្ទួតធំ	Kantuot Thum	211014
21101408	កន្ទួតតូច	Kantuot Touch	211014
21101409	ពោន	Poun	211014
21101410	ត្រពាំងឈូក	Trapeang Chhuk	211014
22010101	កោះថ្មី	Kaoh Thmei	220101
22010102	អូរជញ្ជៀន	Ou Chenhchien	220101
22010103	ប្រលាន	Prolean	220101
22010104	យាងខាងត្បូង	Yeang Khang Tbong	220101
22010105	កណ្ដាលក្រោម	Thnal Kandal Kraom	220101
22010106	កណ្ដាលលើ	Thnal Kandal Leu	220101
22010107	ថ្នល់ទទឹង	Thnal Totueng	220101
22010108	ថ្នល់បំបែក	Thnal Bambaek	220101
22010109	ថ្នល់កែង	Thnal Kaeng	220101
22010110	អភិវឌ្ឍន៏	Akphivoad	220101
22010111	រំចេក	Rumchek	220101
22010112	យាងខាងជើង	Yeang Khang Chheung	220101
22010113	ថ្នល់ថ្មី	Thnal Thmey	220101
22010114	រំចេកខាងកើត	Rumchek Khang Kert	220101
22010115	អូរតាមែង	Ou Ta Meng	220101
22010116	រំចេកខាងលិច	Rumchek Khang Lech	220101
22010301	ត្រពាំងតាវ	Trapeang Tav	220103
22010302	តាដេវ	Ta Dev	220103
22010303	អូរអង្រែ	Ou Angrae	220103
22010304	ស្លែងពណ៌	Slaeng Por	220103
22010305	ទួលប្រាសាទ	Tuol Prasat	220103
22010306	ទួលស្វាយ	Tuol Svay	220103
22010307	ថ្មី	Thmei	220103
22010308	ទំនប់	Tumnob	220103
22010309	អូរស្រម៉	Ou SrorMor	220103
22010310	ទួលស្វាយសែនជ័យ	Tuol Svay Saen Chey	220103
22010401	ទួលកណ្ដាល	Tuol Kandal	220104
22010402	ទួលសាលា	Tuol Sala	220104
22010403	ឯកភាព	Aekakpheap	220104
22010404	បឹង	Boeng	220104
22010405	ជើងភ្នំ	Cheung Phnum	220104
22010406	ឃ្លាំងកណ្ដាល	Khleang Kandal	220104
22010407	ប្រាសាទ	Prasat	220104
22010408	សន្ដិភាព	Santepheap	220104
22010409	ស្រះឈូក	Srah Chhuk	220104
22010410	ទួលត្បែង	Tuol Tbaeng	220104
22010411	ទំនប់លើ	Tumnob Leu	220104
22010412	ទឹកជប់	Tuek Chob	220104
22010413	ទឹកជុំ	Tuek Chum	220104
22010501	ឈើទាលជ្រុំ	Chheu Teal Chrum	220105
22010502	អូររុន	Ou Run	220105
22010503	ស្វាយចេក	Svay Chek	220105
22010504	ថ្លាត	Thlat	220105
22010505	ទួលគ្រួស	Tuol Kruos	220105
22010506	ទួលក្រឡាញ់	Tuol Kralanh	220105
22010507	ទួលពេ្រច	Tuol Prich	220105
22010508	ថ្មី	Thmei	220105
22010601	លំទង	Lumtong	220106
22010602	ទ្រាស	Treas	220106
22010603	អូរគគីរកណ្ដាល	Ou Kokir Kandal	220106
22010604	អូរគគីរក្រោម	Ou Kokir Kraom	220106
22010605	អូរគគរីលើ	Ou Kokir Leu	220106
22010606	លំទងថ្មី	Lumtong Thmei	220106
22010607	ស្រឡៅស្រោង	Sror LaoSroang	220106
22010608	ត្រពាំងធំ	Trapaeng Thom	220106
22010609	ជប់តាមោក	Chub Ta Mok	220106
22010610	គោកសំព័រ	Kork Samphor	220106
22010611	ចារ	Char	220106
22020101	ពងទឹក	Pong Tuek	220201
22020102	អំពិលចាស់	Ampil Chas	220201
22020103	ត្រុំ	Trom	220201
22020104	រុងរឿង	Rung Roeang	220201
22020105	រំដួលចាស់	Rumduol Chas	220201
22020106	ក្ដុល	Kdol	220201
22020107	បារាយណ៍	Baray	220201
22020108	យ៉ក	Yak	220201
22020109	ពង្រ	Pongro	220201
22020110	ព្រៃវល្លិ	Prey Voa	220201
22020111	គោករិទ្ធ	Kouk Ritth	220201
22020112	អំពិលថ្មី	Ampil Thmei	220201
22020113	ជប់គគីរខាងកើត	Chob Kokir Khang Kaeut	220201
22020114	ជប់គគីរខាងលិច	Chob Kokir Khang Lech	220201
22020115	គោកធំ	Kouk Thum	220201
22020116	ល្បើករិទ្ធ	Lbaeuk Rith	220201
22020117	រំដួលថ្មី	Rumduol Thmei	220201
22020118	ប្រាសាទរំដួល	Prasat Rumduol	220201
22020119	ឪឡោក	Ovlaok	220201
22020120	ត្បែងចាស់	Tbaeng Chas	220201
22020121	ត្បែងថ្មី	Tbaeng Thmei	220201
22020122	គោកព្រិច	Kouk Prech	220201
22020123	ដូនទា	Doun Tea	220201
22020124	ចារ	Char	220201
22020125	ត្រប់	Trab	220201
22020126	សុភាព	Sopheap	220201
22020127	ពង្រតាឡី	Pongro Ta Lei	220201
22020128	ហាលៀមសែនជ័យ	Ha Leam Saenchey	220201
22020129	ច័ន្ទក្រហមសែនជ័យ	Chan Krohorm Saenchey	220201
22020130	តេជោអូរដា	Decho Ou Da	220201
22020131	រំដួលសែនជ័យ	Rumdul Saenchey	220201
22020201	បេង	Beng	220202
22020202	ទទឹងថ្ងៃ	Totueng Thngai	220202
22020203	ទំនប់ថ្មី	Tumnob Thmei	220202
22020204	ប្រាសាទល្បើក	Prasat Lbaeuk	220202
22020205	ពោធិថ្មី	Pou Thmei	220202
22020206	ប្រាសាទបី	Prasat Bei	220202
22020207	វល្លិយាវ	Voa Yeav	220202
22020208	ពោធិចាស់	Pou Chas	220202
22020210	រង្សី	Reangsei	220202
22020211	គោកកី	Kouk Kei	220202
22020212	គោកកំប៉ុល	Kouk Kampol	220202
22020213	គោកកប្បាស	Kouk Kabbas	220202
22020214	កន្ទុយជូន	Kantuy Chun	220202
22020215	អូររំដួល	Ou Rumduol	220202
22020216	រស្មីសូភី	Reaksmei Souphi	220202
22020217	សំរោងទាប	Samraong Teab	220202
22020218	តាម៉ា	Ta Ma	220202
22020219	ទំនប់ចាស់	Tumnob Chas	220202
22020220	យាយទេព	Yeay Tep	220202
22020221	ត្រពាំងស្វាយ	Trapaeng Svay	220202
22020222	ពោធិ៍សែនជ័យ	Pur Sen Chey	220202
22020223	ម៉ាលីស្រោង	Maly Stroang	220202
22020224	ក្រឡសែនជ័យ	Kralor Sen Chey	220202
22020301	គោកខ្ពស់	Kouk Khpos	220203
22020302	ប្រីយ៍	Prei	220203
22020303	គាប	Keab	220203
22020304	ឈើស្លាប់	Chheu Slab	220203
22020305	ទន្លេស	Tonle Sa	220203
22020306	ថ្នល់	Thnal	220203
22020307	មនោរម្យ	Monorum	220203
22020308	ប្រាសាទអូរទង	Prasat Ou Tong	220203
22020309	ព្រៃទទឹង	Prey Totueng	220203
22020310	ស្រះស្រង់	Srah Srang	220203
22020311	បុស្សធំ	Bos Thom	220203
22020312	សែនមនោរម្យ១	Saen Monorom 1	220203
22020313	សែនមនោរម្យ២	Saen Monorom 2	220203
22020401	សឹង្ហ	Soengh	220204
22020402	ស៊ីលៀម	Siliem	220204
22020403	គោកមន	Kouk Mon	220204
22020404	រនាមធំ	Roneam Thum	220204
22020405	សាលារ៉ាង	Sala Rang	220204
22020406	កញ្រ្ជៀប	Kanhchrieb	220204
22020407	គោកស្វាយ	Kouk Svay	220204
22020408	គូរ	Kur	220204
22020409	ព្រៃវែង	Prey Veaeng	220204
22020410	សិទ្ធិសេរី	Sith Serei	220204
22020411	តានេស	Ta Nes	220204
22020412	ត្រពាំងអំពិល	Trapeang Ampil	220204
22020413	ថ្នល់បត់	Thnal Bat	220204
22020414	ថ្នល់ដាច់	Thnal Dach	220204
22020415	គោកសង្គើច	Kouk Sangkaeuch	220204
22020416	តាហាំ	Ta Ham	220204
22020417	រំចេក	Rumchek	220204
22020418	ថ្មដូន	Thma Doun	220204
22020419	តាមាន់សែនជ័យ	Tamoan Saenchey	220204
22030101	ជើងទៀន	Cheung Tien	220301
22030102	ស្រែប្រាំង	Srae Prang	220301
22030103	គោកពង្រ	Kouk Pongro	220301
22030104	តាណូក	Ta Nouk	220301
22030105	គោកត្រាង	Kouk Trang	220301
22030106	ឆ្កែស្រែង	Chhkae Sraeng	220301
22030107	គោករាំង	Kouk Reang	220301
22030201	ចុងកាល់	Chong Kal	220302
22030202	គោកវត្ដ	Kouk Voat	220302
22030203	ក	Ka	220302
22030204	ព្រៃធំ	Prey Thum	220302
22030205	ឈក	Chhork	220302
22030206	ស្រម៉	Srama	220302
22030207	បន្ទាយចាស់	Banteay Chas	220302
22030208	អាតោ	Ah Toa	220302
22030209	បាត់ថ្កៅ	Bat Thkao	220302
22030210	បន្ទាយថ្មី	Banteay Thmey	220302
22030301	ខ្នារ	Khnar	220303
22030302	ឈូក	Chhuk	220303
22030304	គោកស្ពាន	Kouk Spean	220303
22030305	គោល	Koul	220303
22030306	ចេកក្បូរ	Chek Kbour	220303
22030307	គោកសំរេច	Kouk Samrech	220303
22030308	គោកធ្នង់	Kouk Thnong	220303
22030309	រលំវែង	Rolum Veaeng	220303
22030310	គោកបន្ទាត់បោះ	Kouk Bantoat Baoh	220303
22030311	គោកធំ	Kouk Thom	220303
22030401	ពង្រ	Pongro	220304
22030402	អំពិល	Ampil	220304
22030403	តាប៉ែន	Ta Paen	220304
22030404	កណ្តោលដុំ	Kandaol Dom	220304
22030405	បន្ទាយជ័រ	Banteay Choar	220304
22030406	ស្រះកែវ	Srah Kaev	220304
22030407	គោកសង្កែ	Kouk Sangkae	220304
22030408	ព្រៃនគរ	Prey Nokor	220304
22040101	បន្សាយរាក់	Bansay Reak	220401
22040102	កំណប់	Kamnab	220401
22040103	រំដួលវាសនា	Rumduol Veasna	220401
22040104	សំបួរមាស	Sambuor Meas	220401
22040105	ត្នោត	Tnaot	220401
22040106	កសិ-ទេពពោធិវង្ស	Kakse-Tepporthivong	220401
22040107	ខ្នាចឫស្សី	Khnach  Ruessei	220401
22040108	ត្រពាំងម្អមសែនជ័យ	Trapeang Maom Saen Chey	220401
22040201	បុស្បូវ	Bos Sbov	220402
22040202	ក្រសាំង	Krasang	220402
22040203	ភ្លង់ចាស់	Phlong Chas	220402
22040204	អូរព្រាល	Ou Preal	220402
22040205	ត្របែក	Trabaek	220402
22040206	ប្រាសាទ	Prasat	220402
22040207	ពងទឹក	Pong Tuek	220402
22040208	ភ្លង់ថ្មី	Phlong Thmei	220402
22040301	ខ្ទុំ	Khtum	220403
22040302	តាម៉ាន	Ta Man	220403
22040303	ថ្នល់បត់	Thnal Bat	220403
22040304	អន្លង់វែង	Anlong Veaeng	220403
22040305	ត្រពាំងវែង	Trapeang Veaeng	220403
22040306	ថ្មី	Thmei	220403
22040307	ត្រពាំងស្លែង	Trapeang Slaeng	220403
22040308	គោកប្រាសាទ	Kouk Prasat	220403
22040309	ក្ដុល	Kdol	220403
22040310	គីរីវ័័ន្ដ	Kirivoant	220403
22040311	ចំប៉ាសុខ	Champa Sokh	220403
22040312	ផ្អុង	Ph'ong	220403
22040314	កូនក្រៀល	Koun Kriel	220403
22040315	ឈើក្រំ	Chheu Kram	220403
22040316	អូរពក	Ou Pok	220403
22040317	ដងទង់	Dorng Tong	220403
22040318	រំដួលជើងភ្នំ	Romdoul Cheungphnom	220403
22040319	ឈូកមាស	Chhouk meas	220403
22040320	គោកឈូក	Kouk Chhuk	220403
22040321	គោកភ្លុក	Kouk Phluk	220403
22040322	ត្រពាំងទូង	Trapeang Toung	220403
22040323	គោកអម្ពិល	Kouk Ampil	220403
22040324	អូរឫស្សី	Ou Ruessei	220403
22040325	ស្រះព្រិច	Sras Prich	220403
22040326	ជ្រឹងខាងកើត	Chrueng Khang Kaeut	220403
22040327	ជ្រឹងខាងលិច	Chrueng Khang Lech	220403
22040328	បុស្ស	Boss	220403
22040329	គោកចាន់រី	Kouk Chanry	220403
22040330	សំរោងសែនជ័យ១	Samroang Saenchey 1	220403
22040331	សំរោងសែនជ័យ២	Samroang Saenchey 2	220403
22040401	ដូនកែន	Doun Kaen	220404
22040402	អូរឫស្សី	Ou Ruessei	220404
22040403	ពុល	Pul	220404
22040404	ឈូក	Chhuk	220404
22040405	អូរក្រវ៉ាន់	Ou Kravan	220404
22040406	ភ្នៀត	Phniet	220404
22040407	សំរោង	Samraong	220404
22040408	កណ្ដែក	Kandaek	220404
22040409	គោកចំបក់	Kouk Chambak	220404
22040410	គោកច្រេស	Kouk Chres	220404
22040411	គោកគរ	Kouk Kor	220404
22040412	គោករំដួល	Kouk Rumduol	220404
22040413	ឆ្អើប	Chh'aeub	220404
22040414	អូរកន្សែង	Ou Kansaeng	220404
22040415	កូនដំរី	Koun Damrei	220404
22040416	បាក់នឹម	Bak Nuem	220404
22040417	បុរីរដ្ឋបាល	Borei Rothbal	220404
22040418	ដូនកែវសែនជ័យ	Doun Keosenchey 	220404
22040501	អភិវឌ្ឍន៍	Akphivodth	220405
22040502	ចំការចេក	Chamkar Chek	220405
22040503	ដើមជ្រៃ	Derm Chrey	220405
22040504	គីរីមង្គល	Kiri Mongkol	220405
22040505	រួតចំប៉ី	Ruot Champei	220405
22040506	អូរស្មាច់	Ou Smach	220405
22040507	ស្រះទឹក	Sras Teuk	220405
22040508	អូរខ្លាឃ្មុំ	Ou Khla khmum	220405
22050101	មានជ័យ	Mean Chey	220501
22050102	សុខសិរី	Sokh Serei	220501
22050103	សំបូរ	Sambour	220501
22050104	ស្រែល្អ	Srae L'a	220501
22050105	ទួលប្រសើរ	Tuol Prasaeur	220501
22050106	ត្រពាំងប្រិយ៍	Trapeang Prey	220501
22050201	ច្រោក	Chraok	220502
22050202	អូរជីក	Ou Chik	220502
22050203	ផ្អាវ	Ph'av	220502
22050204	ឫស្សី	Ruessei	220502
22050206	ថ្កូវ	Thkov	220502
22050207	ផ្តៀកជ្រុំ	Phdeak Chrum	220502
22050208	អូរបេង	Ou Beng	220502
22050209	ថ្នល់កែង	Thnol Keng	220502
22050210	ពពេល	Por Pel	220502
22050211	ខ្នងទួលមានជ័យ	Knong Tuol Mean Chey	220502
22050212	តាម៉ូតមានជ័យ	Ta Mod Mean Chey	220502
22050213	ពពេលសែនជ័យ	Popel Saenchey	220502
22050301	ឈើទាលជ្រុំ	Chheu Teal Chrum	220503
22050302	អូរល្ហុង	Ou Lhong	220503
22050303	អូរស្វាយ	Ou svay	220503
22050304	ពាមក្នុង	Peam Knong	220503
22050306	តាសំ	Ta Sam	220503
22050307	សែនសំ	Sen Sam	220503
22050308	ទំនប់អភិវឌ្ឍន៍	Toumnoub Akphivorth	220503
22050402	បន្ទាយចាស់	Banteay Chas	220504
22050404	អូររំដួល	Ou Rumduol	220504
22050405	ព្រះប្រឡាយ	Preah Pralay	220504
22050406	ត្រាំប៉ោង	Tram Paong	220504
22050407	ត្រាំចាន	Tram Chan	220504
22050408	ត្រាំប៉ោងខាងត្បូង	Tram Paong Khang Tboung	220504
22050409	ប្រាសាទក្រហមសែនជ័យ	Prasat Krohom Saenchey	220504
22050504	សែនសុខ	Saen Sokh	220505
22050505	ទំនប់ដាច់	Tumnob Dach	220505
22050506	ទួលពង្រ	Tuol Pongro	220505
22050507	ទួលចារ	Tuol Char	220505
22050508	ទួលប្រាសាទ	Tuol Prasat	220505
22050509	ជ័យនិវត្ដន៍	Chey Nivoat	220505
22050601	ឈូកស	Chhuk Sa	220506
22050602	អូរក្រូច	Ou Krouch	220506
22050603	ព្រៃស្អាក	Prey S'ak	220506
22050604	ស្រះជ្រៃ	Srah Chrey	220506
22050605	ទំនប់ថ្មី	Tumnob Thmei	220506
22050606	ទួលតាសេក	Tuol Ta Sek	220506
22050607	ត្រពាំងប្រាសាទ	Trapeang Prasat	220506
22050608	ថ្នល់កែង	Thnal Kaeng	220506
22050609	អូរសោម	O Saom	220506
22050610	ស្រែកណ្តាល	Sre Korndal	220506
22050611	ពានមាស	Pean Meas	220506
22050612	អូរត្រាច	Ou Trach	220506
22050613	ស្រែក្រសាំង	Sre Krorsang	220506
22050614	អូររំដេង	Ou Romdeng	220506
22050615	តេជោអភិវឌ្ឍន៌	De Chor Akpiwat	220506
23010101	អំពេង	Ampeng	230101
23010102	ទួលសាងាំ	Tuol Sangam	230101
23010103	កោះសោម	Kaoh Saom	230101
23010104	អង្កោល	Angkaol	230101
23010301	អូរដូង	Ou Doung	230103
23010302	ព្រៃតាកុយ	Prey Ta Koy	230103
23010303	ភ្នំលាវ	Phnum Leav	230103
23010304	រនេស	Rones	230103
23010305	ចំការបី	Chamkar Bei	230103
23010306	ចំការចេក	Chamka Chek	230103
23010307	អន្ទង់ស	Antung Sar	230103
23020101	កែប	Kaeb	230201
23020102	កែវក្រសាំង	Kaev Krasang	230201
23020201	ដំណាក់ចង្អើរ	Damnak Chang'aeur	230202
23020202	កំពង់ត្រឡាច	Kampong Tralach	230202
23020203	ថ្មី	Thmei	230202
23020301	អូរក្រសា	Ou Krasar	230203
23020302	ដំណាក់ចំបក់	Damnak Chambak	230203
24010101	ប៉ាហ៊ីត្បូង	Pahi Tboung	240101
24010102	អូរតាពុកលើ	Ou Ta Puk Leu	240101
24010103	អូរតាប្រាង	Ou Ta Prang	240101
24010104	សួនអំពៅលិច	Suon Ampov Lech	240101
24010105	សួនអំំពៅកើត	Suon Ampov kaeut	240101
24010106	វត្ដ	Voat	240101
24010107	ទឹកថ្លា	Tuek Thla	240101
24010108	តាង៉ែនលើ	Ta Ngaen Leu	240101
24010109	បឌិននៀវ	Badin Niev	240101
24010110	ទួលខៀវ	Tuol Khiev	240101
24010111	ប៉ាហ៊ីជើង	Pahi Cheung	240101
24010112	ពេជ្យគិរី	Pech Kiri	240101
24010113	ទឹកផុស	Teok Phos	240101
24010201	ខ្លុង	Khlong	240102
24010202	កូនភ្នំ	Koun Phnum	240102
24010203	អូរតាវ៉ៅ	Ou Ta Vau	240102
24010204	ក្បាលព្រលាន	Kbal Pralean	240102
24010205	ដីក្រហម	Dei Kraham	240102
24010206	អូរប្រើស	Ou Preus	240102
24010207	ក្រចាប់	Krachab	240102
24010208	អូរខ្ទីង	Ou Kting	240102
24010209	ព្រៃមង្គល	Prey Mongkul	240102
24010210	ប៉ាងរលឹម	Pang Rolem	240102
24010301	ទួលល្វា	Tuol Lvea	240103
24010302	ចំការកាហ្វេ	Chamkar Kaphe	240103
24010303	អូរច្រាកណ្ដាល	Ou Chra Kandal	240103
24010304	អូរច្រាកើត	Ou Chra Kaeut	240103
24010305	អូរច្រាលើ	Ou Chra Leu	240103
24010306	អូរតាពុកក្រោម	Ou Ta Puk Kraom	240103
24010307	អូរពឺត	Ou Peut	240103
24010308	ទួលស្រឡៅ	Tuol Sralau	240103
24010309	ទួលនិមិត្ដ	Tuol Nimitt	240103
24010310	ថ្មី	Thmei	240103
24010311	វាលវង់	Veal Vong	240103
24010401	អូរច្រារលិច	Ou Chra Lech	240104
24010402	អូរស្ងួត	Ou Snguot	240104
24010403	រោងចក្រ	Roungchak	240104
24010404	បរយ៉ាខា	Bar Yakha	240104
24010405	បរតាំងស៊ូ	Bar Tangsu	240104
24010406	បរហ៊ុយខ្មែរជើង	Bar Huy Khmer Cheung	240104
24010407	បរហ៊ុយខ្មែរត្បូង	Bar Huy Khmer Tboung	240104
24020102	ភ្នំស្ពង់	Phnum Spong	240201
24020103	វាល	Veal	240201
24020104	ទួល	Tuol	240201
24020105	លាវ	Leav	240201
24020106	ភ្នំកុយ	Phnum Koy	240201
24020108	កោះកែវ	Kaoh Kaev	240201
24020109	ស្រែអន្ទាក់	Srae Anteak	240201
24020113	អូរឬស្សីក្រោម	Ou Ruessei Kraom	240201
24020204	ថ្នល់បត់	Thnal Bat	240202
24020205	ស្ទឹងត្រង់	Stueng Trang	240202
24020207	ភ្នំក្រិញ	Phnum Krenh	240202
24020208	អូរកន្ឋៀងវ៉ា	Ou Kanthieng Va	240202
24020209	បាយសី	Bay Sei	240202
24020210	ភ្នំព្រាល	Phnum Preal	240202
24020211	ដីស្អិត	Dei S'et	240202
24020212	អូរដូនតាក្រោម	Ou Dounta Kraom	240202
24020213	ព្រៃសន្ទះ	Prey Santeah	240202
24020214	អូរដូនតាលើ	Ou Dounta Leu	240202
24020215	ផ្ទះស្បូវ	Phteah Sbov	240202
24020216	ទំនប់	Tumnob	240202
24020217	កូនដំរី	Koun Damrei	240202
24020218	ទួលខ្ពស់	Tuol Khpos	240202
24020219	ដីសថ្មី	Dei Sa Thmei	240202
24020220	អន្លង់រក្សា	Anlong Reaksar	240202
24020301	ក្ងោក	Kngaok	240203
24020302	តាង៉ែនក្រោម	Ta Ngaen Kraom	240203
24020303	អូរបេង	Ou Beng	240203
24020304	បុសស្អំ	Bos S'am	240203
24020305	ដូង	Doung	240203
24020306	ស្ទឹងកាច់	Stueng Kach	240203
24020307	បឹងព្រលិត	Boeng Prolit	240203
24020308	ស្លា	Sla	240203
24020309	រថក្រោះឆេះ	Rathkraoh Chheh	240203
24020310	ទឹកចេញ	Tuek Chenh	240203
24020311	អូររអិល	Ou Ro'el	240203
24020312	ផ្សារព្រំ	Phsar Prum	240203
24020313	អូរឈើក្រំ	Ou Chheu Kram	240203
24020314	ស្រង់មានជ័យ	Srong Meanchey	240203
24020315	អណ្តូងថ្ម	Andoung Thmar	240203
24020316	ផ្សារព្រំជើង	Phsar Prum Choeung	240203
24020401	ថ្នល់ទទឹង	Thnal Totueng	240204
24020402	កូនភ្នំ	Koun Phnum	240204
24020403	ថ្នល់កែង	Thnal Kaeng	240204
24020404	បឹងត្រកួន	Boeng Trakuon	240204
24020405	អូរឫស្សីលើ	Ou Ruessei Leu	240204
24020406	អូរអណ្ដូង	Ou Andoung	240204
24020407	អូរទឹកភ្លាវ	Ou Teuk Pleav	240204
24020408	អូរចិតប្រាំ	Ou Chet Pram	240204
24020409	ស្រះពីរ	Sras Pir	240204
25010101	គោកស្រឡៅ	Kouk Sralau	250101
25010102	តារាម	Ta Ream	250101
25010103	តាមាឃចាស់	Ta Meakh Chas	250101
25010104	តាមាឃថ្មី	Ta Meakh Thmei	250101
25010105	ជាចកើត	Cheach Kaeut	250101
25010106	ជាចជើង	Cheach Cheung	250101
25010107	ជាចធំ	Cheach Thum	250101
25010108	ត្រពាំងជ្រៃ	Trapeang Chrey	250101
25010109	កូនត្រុំ	Koun Trom	250101
25010110	ចារស្ទឹងតាថុក	Char Stueng Ta Thok	250101
25010111	ចារធំ	Char Thum	250101
25010112	ចារស្វាយប៉ាក់	Char Svay Pak	250101
25010113	ពន្លាក	Ponleak	250101
25010201	តំបែរ	Dambae	250102
25010202	ជ្រៃភ្លូក	Chrey Phluk	250102
25010203	កកោះ	Kakaoh	250102
25010204	ត្រពាំងឫស្សី	Trapeang Ruessei	250102
25010205	ខ្ជាយ	Khcheay	250102
25010206	ស្វាយពពាល	Svay Popeal	250102
25010207	ថ្នល់	Thnal	250102
25010208	ជ័យសម្បត្ដិ	Chey Sambatt	250102
25010209	សញ្ជ័យសែន	Sach Chey Sen	250102
25010210	ត្រពាំងរំដួល	Trapaeng Rumdul	250102
25010301	ស៊ងឃ្វាង	Sorng Khveang	250103
25010302	គោកចារ	Kouk Char	250103
25010303	ត្រពាំងស្រង៉ែ	Trapeang Srangae	250103
25010304	គោកស្រុក	Kouk Srok	250103
25010305	ឈើទាលជ្រុំ	Chheu Teal Chrum	250103
25010306	ត្រពាំងឫស្សី	Trapeang Ruessei	250103
25010307	វាលអណ្ដើក	Veal Andaeuk	250103
25010308	ត្រពាំងឈូក	Trapeang Chhuk	250103
25010309	ដូនមាស	Doun Meas	250103
25010401	ខ្នុរ	Khnor	250104
25010402	ពង្រ	Pongro	250104
25010403	ចំបក់	Chambak	250104
25010404	នាងទើត	Neang Teut	250104
25010405	សង្គម	Sangkum	250104
25010501	កំពង់រាំង	Kampong Reang	250105
25010502	វាលតូច	Veal Touch	250105
25010503	ស្វាយកាំបិត	Svay Kambet	250105
25010504	ក្រសាំង	Krasang	250105
25010505	សំព័រ	Sampoar	250105
25010506	អណ្ដូងល្ងៀង	Andoung Lngieng	250105
25010507	តាកែវ	Ta Kaev	250105
25040103	លេខ ៥	Lekh Pram	250401
25010508	ទួលប្រោះ	Tuol Praoh	250105
25010509	ជីធាង	Chi Theang	250105
25010510	ឈូងតាសៅ	Chhung Ta Sau	250105
25010511	ស្រែខ្សាច់	Srae Khsach	250105
25010512	សេដាសែនជ័យ	Seda Sen Chey	250105
25010513	រពាក់ ១	Rum Peak 1	250105
25010514	រពាក់ ២	Rum Peak 2	250105
25010515	រពាក់ ៣	Rum Peak 3	250105
25010516	ខ្នាចជុំ	Khnach Chum	250105
25010517	ដង្ហា	Dangha	250105
25010518	អណ្តូងចំបក់	Andoung Cham Bok	250105
25010519	សែនជុំ	Sen Chum	250105
25010520	សែនចម្រើន	Sen Chamroeun	250105
25010521	បេងថ្មី	Beng Thmei	250105
25010522	ព្រែកជ័រ	Praek Chor	250105
25010523	ថ្នល់កែង	Tnoal Kaeng	250105
25010524	អណ្តូងពេជ្រ	Andoung Pech	250105
25010601	បង្ហើខ្លែង	Banghaeu Khlaeng	250106
25010602	ស្រែកក់	Srae Kak	250106
25010603	ចំបក់	Chambak	250106
25010604	ប្រឡោះ	Pralaoh	250106
25010605	ត្រពាំងព្រីង	Trapeang Pring	250106
25010606	កំប្រើស	Kampraeus	250106
25010607	ស្រែប្រាំង	Srae Prang	250106
25010608	បុស្នោរ	Bos Snaor	250106
25010609	ជីទ្រុន	Chi Trun	250106
25010610	ទួលសំបូរណ៍	Tuol Sambour	250106
25010611	ជ័យសុខសាន្ត	Chey Sok San	250106
25010612	សែនមនោរ័ត្ន	Sen Monorath	250106
25010701	ត្របែក	Trabaek	250107
25010702	ទឹកជ្រៅ	Tuek Chrov	250107
25010703	មេសរ	Me Sar	250107
25010704	ឃ្លៃ	Khley	250107
25010705	ផ្អាវ	Ph'av	250107
25010706	ស្រម៉រ	Sramar	250107
25010707	ជាំត្រកួន	Choam Trakuon	250107
25010708	ក្រសាំង	Krasang	250107
25010709	ស្រែវែង	Srae Veaeng	250107
25010710	ត្របែកថ្មី	Trabaek Thmei	250107
25020101	ឈូក	Chhuk	250201
25020102	ផ្កាដូង	Phka Doung	250201
25020103	ក្របីក្រៀក	Krabei Kriek	250201
25020104	ច្រវ៉ាក់ដែក	Chravak Daek	250201
25020105	បារ៉ាយ	Baray	250201
25020106	រួមវិញ	Ruom Vinh	250201
25020107	ស្រះត្រកួន	Srah Trakuon	250201
25020108	បុសស្វាយ	Bos Svay	250201
25020201	ព្រែកតាហុប	Preaek Ta Hob	250202
25020202	ជំនីក	Chumnik	250202
25020203	ស្វាយតំណាក់	Svay Damnak	250202
25020204	បន្ទាយ	Banteay	250202
25020301	ភូមិទី១	Phum Ti Muoy	250203
25020302	ភូមិទី២	Phum Ti Pir	250203
25020303	ភូមិទី៣	Phum Ti Bei	250203
25020304	ភូមិទី៤	Phum Ti Buon	250203
25020305	ភូមិទី៥	Phum Ti Pram	250203
25020306	ភូមិទី៦	Phum Ti Prammuoy	250203
25020401	កោះបីពៃ	Kaoh Bei Pey	250204
25020402	កោះត្រែង	Kaoh Traeng	250204
25020403	កោះម៉ឺននង់	Kaoh Meun Nong	250204
25020404	ជួរកណ្ដាល	Chuor Kandal	250204
25020501	សំរោង	Samraong	250205
25020502	ដើមជ្រៃ	Daeum Chrey	250205
25020503	ក្រូចឆ្មារលើ	Krouch Chhmar Leu	250205
25020504	ក្រូចឆ្មារក្រោម	Krouch Chhmar Kraom	250205
25020505	ខ្សាច់ប្រឆេះលើ	Khsach Prachheh Leu	250205
25020506	ខ្សាច់ប្រឆេះកណ្ដាល	Khsach Prachheh Kandal	250205
25020507	ខ្សាច់ប្រឆេះក្រោម	Khsach Prachheh Kraom	250205
25020601	សោយ ១	Saoy Muoy	250206
25020602	សោយ ២	Saoy Pir	250206
25020603	ព្រែកក្រូច	Preaek Krouch	250206
25020604	អំពិល	Ampil	250206
25020605	កោះផល់	Kaoh Phal	250206
25020701	អំពិល	Ampil	250207
25020702	ប៉ើស	Peus	250207
25020703	ដីដុះ	Dei Doh	250207
25020704	ទួលសម្បត្ដិ	Tuol Sambatt	250207
25020801	ភូមិទី ១	Phum Ti Muoy	250208
25020802	ភូមិទី ២	Phum Ti Pir	250208
25020803	ភូមិទី ៣	Phum Ti Bei	250208
25020804	ភូមិទី ៤	Phum Ti Buon	250208
25020805	ភូមិទី ៥	Phum Ti Pram	250208
25020806	ភូមិទី ៦	Phum Ti Prammuoy	250208
25020901	ភូមិទី ១	Phum Ti Muoy	250209
25020902	ភូមិទី ២	Phum Ti Pir	250209
25020903	ភូមិទី ៣	Phum Ti Bei	250209
25020904	ភូមិទី ៤	Phum Ti Buon	250209
25020905	ភូមិទី ៥	Phum Ti Pram	250209
25020906	ភូមិទី ៦	Phum Ti Prammuoy	250209
25020907	ភូមិទី ៧	Phum Ti Prampir	250209
25021001	ភូមិទី ១	Phum Ti Muoy	250210
25021002	ភូមិទី ២	Phum Ti Pir	250210
25021003	ភូមិទី ៣	Phum Ti Bei	250210
25021004	ភូមិទី ៤	Phum Ti Buon	250210
25021005	ភូមិទី ៥	Phum Ti Pram	250210
25021006	ភូមិទី ៦	Phum Ti Prammuoy	250210
25021101	ក្ដុលលើ	Kdol Leu	250211
25021102	ក្ដុលកណ្ដាល	Kdol Kandal	250211
25021103	ទ្រាទី ១	TreaTi Muoy	250211
25021104	ទ្រាទី ២	Trea Ti Pir	250211
25021105	ទ្រាទី ៣	Trea Ti Bei	250211
25021106	ទ្រាទី ៤	Trea Ti Buon	250211
25021107	ទ្រាទី ៥	Trea Ti Pram	250211
25021108	ក្ដុលក្រោម	Kdol Kraom	250211
25021201	ទួលអុក	Tuol Ok	250212
25021202	មុខភ្នំ	Mukh Phnum	250212
25021203	ទួលរកា	Tuol Roka	250212
25021204	ទូលតាកោ	Tuol Ta Kao	250212
25021205	ទួលស្នួល	Tuol Snuol	250212
25021206	ទួលត្រាច	Tuol Trach	250212
25021207	សង្គមមានជ័យ	Sangkum Mean Chey	250212
25021208	ជើងច្រង់	Cheung Chrang	250212
25021209	តាប៉ាវ	Ta Pav	250212
25021210	បីម៉ែត្រ	Bei Maetr	250212
25021211	ចំរើន	Chamraeun	250212
25021212	ភពថ្មី	Phop Thmei	250212
25030101	ស្រែតានងលិច	Srae Ta Nong Lech	250301
25030102	ស្រែតានងកើត	Srae Ta Nong Kaeut	250301
25030103	ធ្លក	Thlok	250301
25030104	ស្អំ	S'am	250301
25030105	ចាន់មូល	Chan Mul	250301
25030106	តាកែវ	Ta Kaev	250301
25030107	ពាម	Peam	250301
25030108	គរ	Kor	250301
25030109	តាឡូ	Ta Lou	250301
25030110	កន្ដ្រើយ	Kantraeuy	250301
25030111	អំផុល	Amphol	250301
25030112	ខ្លុងត្បូង	Khlong Tboung	250301
25030201	ងៀវ	Ngiev	250302
25030202	លាចក្រោម	Leach Kraom	250302
25030203	លាចលើ	Leach Leu	250302
25030204	បឹងជ្រោង	Boeng Chroung	250302
25030205	ជាំអំពិល	Choam Ampil	250302
25030206	ជាំ	Choam	250302
25030207	ជើង	Cheung	250302
25030208	មង់	Mong	250302
25030209	ពព្លាំ	Poploam	250302
25030210	ស្ទឹងអង្កាម	Stueng Angkam	250302
25030301	ក្រវៀនធំ	Kravien Thum	250303
25030302	ក្រវៀនជើង	Kravien Cheung	250303
25030303	ដូង	Doung	250303
25030304	សាទុំ	Satum	250303
25030305	ថ្មតាដោក	Thma Ta Daok	250303
25030306	ក្បាលស្លែង	Kbal Slaeng	250303
25030307	ម្ខោះ	Mkhaoh	250303
25030308	ម្រាន់	Mroan	250303
25030309	ថ្មដារ	Thma Dar	250303
25030310	ដង្ហិត	Danghet	250303
25030311	ឃ្មួរ	Khmuor	250303
25030312	ប្រីយ៍	Prei	250303
25030313	បង្ហើយហួស	Banghaeuy Huos	250303
25030314	របងច្រុះ	Robang Chroh	250303
25030315	ជីប្លុក	Chi Plok	250303
25030316	ជ្រៃឡើង	Chrey Laeung	250303
25030317	ខ្ជាយ	Khcheay	250303
25030318	ស្រែលើសែនជ័យ	Sre Leu Meanchey	250303
25030401	តាម៉ៅជើង	Ta Mau  Cheung	250304
25030402	តាម៉ៅកើត	Ta Mau Kaeut	250304
25030403	ជំនុំំពល	Chumnum Pol	250304
25030404	សំពៅលូន	Sampov Loun	250304
25030405	ទួលគ្រួស	Tuol Kruos	250304
25030406	ថ្នល់កែង	Thnal Kaeng	250304
25030407	អង្កាំ	Angkam	250304
25030408	កន្ទូត	Kantuot	250304
25030409	ថ្មទទឹងជើង	Thma Totueng Cheung	250304
25030410	ស្រែតាពេជ	Srae Ta Pich	250304
25030411	កូនក្រពើ	Koun Krapeu	250304
25030412	បុស្សតាអឹម	Bos Ta Oem	250304
25030413	ថ្មទទឹងត្បូង	Thma Totueng Tboung	250304
25030414	ទ្បាំបោ	Lam Baor	250304
25030501	ដារកណ្ដាល	Dar Kandal	250305
25030502	ដារលិច	Dar Lech	250305
25030503	៧ មករា	Prampir Meakkakra	250305
25030504	ស្ពាន	Spean	250305
25030505	ដារផ្សារ	Dar Phsar	250305
25030506	ស្រែជាំ	Srae Choam	250305
25030507	មែកពុក	Meaek Puk	250305
25030508	ដារត្បូង	Dar Tboung	250305
25030509	ដារកណ្ដាល	Dar Kandal	250305
25030510	ទ្រៀក	Triek	250305
25030511	ឆ្ងរជើង	Chhngar Cheung	250305
25030512	សំរោងជើង	Samraong Cheung	250305
25030513	ដារជើង	Dar Cheung	250305
25030514	បេង	Beng	250305
25030515	ចំការគរ	Chamkar Kor	250305
25030516	ឆ្ងរកណ្ដាល	Chhngar Kandal	250305
25030517	សាឡង់ ទី១	Salang Ti Mouy	250305
25030518	សាឡង់ ទី២	Salang Ti Pir	250305
25030519	កងកេង	Kang Keng	250305
25030601	លោ	Lou	250306
25030602	កំពាន់	Kampoan	250306
25030603	ទឹកទុំ	Tuek Tum	250306
25030604	ស្រែសោមថ្មី	Srae Saom Thmei	250306
25030605	ស្រែសោមចាស់	Srae Saom Chas	250306
25030606	ស្រែកណ្ដាល	Srae Kandal	250306
25030607	ឆ្លូង ១	Chhloung Muoy	250306
25030608	ឆ្លូង ២	Chhloung Pir	250306
25030609	ឆ្លូង ៣	Chhloung Bei	250306
25030701	ព្រែកពួយ	Preaek Puoy	250307
25030702	ក្ងោក	Kngaok	250307
25030703	ស្រែពោល	Srae Poul	250307
25030704	ទួលថ្ម	Tuol Thma	250307
25030705	គគីរជើង	Kokir Cheung	250307
25030706	គគីរត្បូង	Kokir Tboung	250307
25030707	ចំការថ្មី	Chamkar Thmei	250307
25030708	សាឡង់ ៣	Salang Bei	250307
25030801	មេមង	Memong	250308
25030802	សង្កែចាស់	Sangkae Chas	250308
25030803	សង្កែថ្មី	Sangkae Thmei	250308
25030804	ពើក	Peuk	250308
25030805	ជាំខ្យង	Choam Khyang	250308
25030806	ទ្រៀក	Triek	250308
25030807	កំបាស់	Kambas	250308
25030808	ជាច	Cheach	250308
25030809	សំបូរ	Sambour	250308
25030901	ត្រពាំងរាំង	Trapeang Reang	250309
25030902	មុសក្រាស់	Mus Kras	250309
25030903	ឆ្ងរសាលា	Chhngar Sala	250309
25030904	ជីប៉េះ	Chi Peh	250309
25030905	សង្គមមានជ័យថ្មី	Sangkom Mean Chey Thmei	250309
25030906	ជាម្អោរ	Cheam'aor	250309
25030907	ណង់ក្រពើ	Nang Krapeu	250309
25030908	មេមត់កណ្ដាល	Memot Kandal	250309
25030909	ម៉ាសីនទឹក	Masin Tuek	250309
25030910	ត្បូងវត្ដ	Tboung Voat	250309
25030911	មេមត់ផ្សារ	Memot Phsar	250309
25030912	ត្របែក	Trabaek	250309
25030913	សង្គមមានជ័យចាស់	Sangkom Mean Chey Chas	250309
25030914	ឆ្ងរកើត	Chhngar Kaeut	250309
25030915	មេមត់ថ្មី	Memot Thmei	250309
25031001	រំចេក	Rumchek	250310
25031002	ឈើខ្លឹម	Chheu Khloem	250310
25031003	ខ្ពប	Khpob	250310
25031004	ថ្មដាប់	Thma Dab	250310
25031005	កំពៃ	Kampey	250310
25031006	ព្នៅ	Pnov	250310
25031007	ស្រែពង្រ	Srae Pongro	250310
25031008	ឃ្លៀច	Khliech	250310
25031009	កន្ទួត	Kantuot	250310
25031010	សុខសាន្ត	Sok San	250310
25031011	សែនជ័យ	Sen Chey	250310
25031012	សែនផល	Sen Phal	250310
25031013	សែនប្រពៃ	Sen Prapey	250310
25031101	រូង	Rung	250311
25031102	ត្រពាំងឫស្សី	Trapeang Ruessei	250311
25031103	បេង	Beng	250311
25031104	ជាំទូក	Choam Tuk	250311
25031105	តោញ	Taonh	250311
25031106	អណ្ដូងតាជោ	Andoung Ta Chou	250311
25031107	ម៉ាស៊ីន	Masin	250311
25031108	បុស្ស	Bos	250311
25031109	ដូង	Doung	250311
25031110	សូទៃ	Soutey	250311
25031111	ដូនរ័ត្នទី ១	Doun Roath Ti Muoy	250311
25031112	ចំបក់	Chambak	250311
25031113	ដូនរ័ត្នទី ២	Doun Roath Ti Pir	250311
25031201	ក្ដុលលើ	Kdol Leu	250312
25031202	ក្ដុលក្រោម	Kdol Kraom	250312
25031203	ក្ដុលផ្សារ	Kdol Phsar	250312
25031204	ចង្គំទី ១	Changkum Ti Muoy	250312
25031205	ចង្គំកណ្ដាល	Changkum Kandal	250312
25031206	ស្ពានចង្គំ	Spean Changkum	250312
25031207	កោះថ្ម	Kaoh Thma	250312
25031208	ស្លាភ្នំ	Sla Phnum	250312
25031209	ម្កោរ	Mkaor	250312
25031210	បេងកោង	Beng Kaong	250312
25031211	ពងទឹក	Pong Tuek	250312
25031212	ល្វាលើ	Lvea Leu	250312
25031213	ស្លាគីឡូ	Sla Kilou	250312
25031301	អូរខ្លូត	Ou Khlout	250313
25031302	ត្រមែងលើ	Tramaeng Leu	250313
25031303	ត្រមូង	Tramung	250313
25031304	ជាំទ្រៀក	Choam Triek	250313
25031305	អណ្ដូងថ្មលើ	Andoung Thma Leu	250313
25031306	អណ្ដូងថ្មក្រោម	Andoung Thma Kraom	250313
25031307	រោងចក្រស្ករ	Roung Chakr Skar	250313
25031308	ត្រមែងក្រោម	Tramaeng Kraom	250313
25031309	ដូងទី១	Doung Ti Muoy	250313
25031310	ជាំត្រាវ	Choam Trav	250313
25031311	ឈូក	Chhuk	250313
25031312	ងើថ្មី	Ngeu Thmei	250313
25031313	ងើធំ	Ngeu Thum	250313
25031314	ត្រពាំងងើ	Trapeang Ngeu	250313
25031315	ជ្រៃ	Chrey	250313
25031316	ខ្នងក្រពើលិច	Khnoang Kra Peu Lech	250313
25031317	ខ្នងក្រពើកើត	Khnoang Kra Peu Kaeut	250313
25031318	ដូងទី២	Doung Ti Pir	250313
25031319	សំបូរ	Sambour	250313
25031320	ក្រូច	Krouch	250313
25031401	ដក់ពរ	Dak Por	250314
25031402	បង្គៅ	Bangkov	250314
25031403	ប្រីយ៍	Prei	250314
25031404	ឃ្លៃ	Khley	250314
25031405	រមាសចូល	Romeas Choul	250314
25031406	ព្រះពន្លា	Preah Ponlea	250314
25031407	សំរោងត្បូង	Samraong Tboung	250314
25040101	ទំពាំងបង្កង់	Tumpeang Bangkang	250401
25040102	ព្រៃស្រឡៅ	Prey Sralau	250401
25040104	លេខ ៤លិច	Lekh Buon Lech	250401
25040105	ទួលទន្សោង	Tuol Tonsaong	250401
25040106	ស្វាយតាធម្ម	Svay Ta Thoam	250401
25040107	ពោធិ៍មាស	Pou Meas	250401
25040108	មិត្ដរ៉ាច	Mitt Rach	250401
25040109	ទួលតាលាប់	Tuol Ta  Lorb	250401
25040110	ដំណាក់បេង	Damnak Beng	250401
25040111	ពោធិ៍ស្វាយមីង	Pou Svay Ming	250401
25040112	ស្វាយមីង	Svay Ming	250401
25040113	មាសស្នេហ៍	Meas Snae	250401
25040114	ស្វាយរលួស	Svay Roluos	250401
25040115	ជ្រៃតាសូ	Chrey Ta Sou	250401
25040116	លេខ ៣	Lekh Bei	250401
25040117	លេខ ៤កើត	Lekh Buon Kaeut	250401
25040118	ចង្វា	Changva	250401
25040119	បុសល្ហុង	Bos Lhong	250401
25040120	អំពិលជើង	Ampil  Cheung	250401
25040121	អំពិលត្បូង	Ampil  Tboung	250401
25040122	ទំពាំងឫស្សី	Tumpeang Ruessei	250401
25040123	ស្វាយតាឡក	Svay Ta Lak	250401
25040124	អំពិលជុំ	Ampil Chum	250401
25040201	ជ្រួល	Chruol	250402
25040202	ចំឡាក់	Chamlak	250402
25040203	ត្រពាំងកណ្ដាល	Trapeang Kandal	250402
25040204	ចំការគ	Chamkar Kor	250402
25040205	អូរឡោក	Ou Laok	250402
25040206	ជ្រោយផ្អុង	Chrouy Ph'ong	250402
25040207	ចក	Chak	250402
25040208	ព្រីង	Pring	250402
25040209	ត្រាចជ្រុំ	Trach Chrum	250402
25040210	ដើមចង្ក្រាន	Daeum Changkran	250402
25040211	ប្រាសាទ	Prasat	250402
25040212	ខ្ទមលាវ	Khtom Leav	250402
25040213	ពុទ្ធា	Putthea	250402
25040214	ត្រពាំងទា	Trapeang Tea	250402
25040215	គោកទី	Kouk Ti	250402
25040216	ជំពូ	Chumpou	250402
25040217	ស្រឡុង	Sralong	250402
25040301	ដំរិលទី ១	Damril Ti Muoy	250403
25040302	ដំរិលទី ២	Damril Ti Pir	250403
25040303	ដំរិលទី ៣	Damril Ti Bei	250403
25040304	ដំរិលទី ៤	Damril Ti Buon	250403
25040305	យាកជើង	Yeak Cheung	250403
25040306	យាកត្បូង	Yeak Tboung	250403
25040307	សង្កែ	Sangkae	250403
25040308	សំរោង	Samraong	250403
25040309	ពើក	Peuk	250403
25040310	ជ្រៃសុខុម	Chrey Sokhom	250403
25040311	ក្បាលអូរ	Kbal Ou	250403
25040312	ក្រពើសារ	Krapeu Sar	250403
25040313	សំស្នែរ	Sam Snae	250403
25040314	ស្រែស្រួច	Srae Sruoch	250403
25040315	ទួល	Tuol	250403
25040316	ធ្លក	Thlok	250403
25040317	ចន្លោង	Chanlaong	250403
25040318	ខ្នប់ដំរីជើង	Khnab Damrei Cheung	250403
25040319	ខ្នប់ដំរីត្បូង	Khnab Damrei Tboung	250403
25040320	ប្រឡាយ	Pralay	250403
25040401	ស្ទឹងរោង	Stueng Roung	250404
25040402	សុក្រំជ្រុំ	Sokram Chrum	250404
25040403	ទំនាប	Tumneab	250404
25040404	លេខ ២	Lekh Pir	250404
25040405	គងជ័យ	Kong Chey	250404
25040406	អូរដំរ៉ាយ	Ou Damray	250404
25040407	ថ្នល់កែង	Thnal Kaeng	250404
25040408	បង្គានស	Bangkean Sar	250404
25040409	ទួលស្រឡៅ	Tuol Sralau	250404
25040410	ស្ទឹងជ័យ	Stueng Chey	250404
25040411	ទួលត្រាច	Tuol Trach	250404
25040412	ព្រំខេត្ដ	Prum Khet	250404
25040413	អណ្ដូង	Andoung	250404
25040414	ភូមិលេខ ១	Phum Lekh Muoy	250404
25040415	ទួលតាហោ	Tuol Ta Hao	250404
25040416	ទួលសាម៉	Tuol Sama	250404
25040417	ចង្វា	Changva	250404
25040418	សឹង	Soeng	250404
25040419	ជើងវត្ដ	Cheung Voat	250404
25040420	អូពពូល	Ou Popul	250404
25040421	ថ្មី	Thmei	250404
25040422	ស្រែស្ពៃ	Srae Spey	250404
25040501	បន្ទាយមៀន	Banteay Mien	250405
25040502	សោយ	Saoy	250405
25040503	ស្វាយពក	Svay Pok	250405
25040504	មៀន	Mien	250405
25040505	ព្រៃសំបួរកើត	Prey Sambuor Kaeut	250405
25040506	ព្រៃសំបួរលិច	Prey Sambuor Lech	250405
25040507	បឹងជើង	Boeng Cheung	250405
25040508	ថ្មី	Thmei	250405
25040509	កន្លែងចក	Kanlaeng Chak	250405
25040510	បឹងកណ្ដាល	Boeng Kandal	250405
25040511	មេលោង	Me Loung	250405
25040512	កំពូលសេរី	Kampul Serei	250405
25040513	ថ្មសំលៀង	Thma Samlieng	250405
25040514	ថ្មប្រជុំ	Thma Prachum	250405
25040601	បាស្រី	Ba Srei	250406
25040602	ក្បាលទឹក	Kbal Tuek	250406
25040603	ភ្នំ	Phnum	250406
25040604	ទួលថ្កូវ	Tuol Thkov	250406
25040605	ទួលមានជ័យ	Tuol Mean Chey	250406
25040606	ទួលព្នៅ	Tuol Pnov	250406
25040607	ទួលឃ្លាំង	Tuol Khleang	250406
25040608	ព្រះធាតុកណ្ដាល	Preah Theat Kandal	250406
25040609	ទួលសំបូរ	Tuol Sambour	250406
25040610	ព្រះធាតុថ្មដា	Preah Theat Thma Da	250406
25040611	ត្រពាំងនាង	Trapeang Neang	250406
25040612	បឹងកាង	Boeng Kang	250406
25040613	ជ័យសោភ័ណ្ឌ	Chey Saophoan	250406
25040614	ថ្មីកណ្ដាល	Thmei Kandal	250406
25040615	អ្នកតាទ្វារ	Neak Ta Tvear	250406
25040616	ថ្នល់កែង	Thnal Kaeng	250406
25040617	ថ្មីលើ	Thmei Leu	250406
25040618	ស្រែមៀន	Srae Mien	250406
25040619	ភូមិ ១២	Phum Dabpir	250406
25040620	ភូមិ ២៥	Phum Mpheypram	250406
25040621	ភូមិ ២៧	Phum Mphey Prampir	250406
25040622	ភូមិ ៤៤	Phum Saesebbuon	250406
25040701	ក្បាលថ្នល់	Kbal Thnal	250407
25040702	ក្បាលពែ	Kbal Peae	250407
25040703	ថ្មី	Thmei	250407
25040704	បឹងផ្ទិល	Boeng Phtil	250407
25040705	តាង៉ិន	Ta Ngen	250407
25040706	ទួលសូព័រ	Tuol Sopoar	250407
25040707	ត្រពាំងផ្អាវ	Trapeang Ph'av	250407
25040708	ពោង	Poung	250407
25040709	ចាន់អណ្ដែត	Chan Andaet	250407
25040710	ត្រពាំងល្វាត្បូង	Trapeang Lvea Tboung	250407
25040711	ត្រពាំងល្វាជើង	Trapeang Lvea Cheung	250407
25040712	បឹងកំពឹស	Boeng Kampues	250407
25040713	ស្ទឹង	Stueng	250407
25040714	ថ្មដាលិច	Thma Da Lech	250407
25040715	ទួលសូភី	Tuol Souphi	250407
25040716	ដំណាក់កែវ	Damnak Kaev	250407
25040717	ដូនទេស	Doun Tes	250407
25040718	ថ្មដាកើត	Thma Da Kaeut	250407
25040719	ក្បាលអូរ	Kbal Ou	250407
25040720	ភូមិ ៧៦	Phum Chetseb Prammuoy	250407
25040721	ភូមិ ៥៤	Phum Hasebbuon	250407
25040722	ភូមិ ៧៣	Phum Chetsebbei	250407
25040723	ថ្មីសែនជ័យ	Thmey Senchey	250407
25050101	បុសរកា	Bos Roka	250501
25050102	ព្រៃទំនប់	Prey Tumnob	250501
25050103	រោលផ្អែម	Roul Ph'aem	250501
25050104	តានី	Ta Ni	250501
25050105	ស្ពានជ្រៃ	Spean Chrey	250501
25050106	ស្វាយសុខុម	Svay Sokhom	250501
25050107	បុសឫស្សី	Bos Ruessei	250501
25050108	សំរោង	Samraong	250501
25050109	ដូនតី	Dountei	250501
25050110	ពោធិព្រឹក្សលិច	Pouthi Proeks Lech	250501
25050111	ពោធិព្រឹក្សកើត	Pouthi Proeks Kaeut	250501
25050112	សុវណ្ណមាលា	Sovann Mealea	250501
25050113	រើលលើ	Reul Leu	250501
25050114	រើលក្រោម	Reul Kraom	250501
25050115	ស្នាកកណ្ដាល	Snak Kandal	250501
25050116	ឈូកស	Chhuk Sa	250501
25050117	អង្គរក្រៅ	Angkor Krau	250501
25050118	អង្គរក្នុង	Angkor Knong	250501
25050119	ពោធិធំ	Pou Thum	250501
25050120	គោកនាវា	Kouk Neavea	250501
25050121	អង្គរលើ	Angkor Leu	250501
25050201	សំបូរ	Sambour	250502
25050202	កញ្ចែ	Kanhchae	250502
25050203	បុសទី	Bos Ti	250502
25050204	ពន្លៃ	Ponley	250502
25050205	ត្រពាំងស្ទៀង	Trapeang Stieng	250502
25050206	ទឹកយង់	Tuek Yong	250502
25050207	អង្កែង	Angkaeng	250502
25050208	តាអាំ	Ta Am	250502
25050209	សន្ទៃទី ២	Santey Ti Pir	250502
25050210	សំរើយ	Samraeuy	250502
25050211	ត្រពាំងសន្ទៃ	Trapeang Santey	250502
25050212	ថ្លុកត្រាច	Thlok Trach	250502
25050213	ឫស្សីជួរ	Ruessei Chuor	250502
25050214	ក្រូច	Krouch	250502
25050215	អំពិល	Ampil	250502
25050216	សន្ទៃ ទី ១	Santey Ti Muoy	250502
25050217	ក្រសោមសត្វ	Krasaom Satv	250502
25050218	គគីរ	Kokir	250502
25050219	អន្លង់ជ្រៃ	Anlong Chrey	250502
25050220	ធ្លក	Thlok	250502
25050221	ស្ទឹងតូច	Stueng Touch	250502
25050222	អូរព្រិច	Ou Prich	250502
25050223	ដងក្ដោង	Dang Kdaong	250502
25050301	កណ្ដោលជ្រុំ	Kandaol Chrum	250503
25050302	បុសខ្នុរ	Bos Khnor	250503
25050303	មនោប៊ូ	Monou Bu	250503
25050304	វាល	Veal	250503
25050305	ជើងអង	Cheung Ang	250503
25050306	ដឺកពរ	Doek Por	250503
25050307	ពងទឹក	Pong Tuek	250503
25050308	ជ័យនិគម	Chey Nikom	250503
25050309	អំពុក	Ampuk	250503
25050310	អណ្ដោត	Andaot	250503
25050311	ស្វាយមាស	Svay Meas	250503
25050312	ត្រពាំងប្រិយ៍	Trapeang Prei	250503
25050313	ទួលចំការ	Tuol Chamkar	250503
25050314	ត្រពាំងន្សោង	Trapeang Tonsaong	250503
25050315	ព្រះអណ្ដូង	Preah Andoung	250503
25050316	ម្កាក់	Mkak	250503
25050317	ទួលពោធិ	Tuol Pou	250503
25050318	ទួលជ័យ	Tuol Chey	250503
25050319	សុវណ្ណគម	Sovann Kom	250503
25050320	គោកល្វៀង	Kouk Lvieng	250503
25050321	ស្បែកគឺ	Sbaek Kueu	250503
25050322	បត់ទន្លា	Bat Tonlea	250503
25050323	ល្ងៀង	Lngieng	250503
25050324	ស្ដុកសម្បត្ដិ	Sdok Sambat	250503
25050325	ផ្សារកណ្ដោលជ្រុំ	Phsar Kandaol Chrum	250503
25050401	ត្រពាំងខ្យង	Trapeang Khyang	250504
25050402	តាហៀវលើ	Ta Hiev Leu	250504
25050403	តាហៀវក្រោម	Ta Hiev Kraom	250504
25050404	កណ្ដោលកោង	Kandaol Kaong	250504
25050405	ស្ទឹង	Stueng	250504
25050406	ពោធិរោងលិច	Pou Roung Lech	250504
25050407	ពោធិរោងលើ	Pou Roung Leu	250504
25050408	ពោធិឥន្ទ ទី ១	Pou Ent Ti Muoy	250504
25050409	ពោធិឥន្ទ ទី ២	Pou Ent Ti Pir	250504
25050410	កោងកាង ទី ១	Kaong Kang Ti Muoy	250504
25050411	កោងកាង ទី ២	Kaong Kang Ti Pir	250504
25050412	កោងកាង ទី ៣	Kaong Kang Ti Bei	250504
25050413	កន្ទួត	Kantuot	250504
25050414	ឡ	La	250504
25050415	ពោធិស្រុក	Pou Srok	250504
25050416	ថ្នល់ថ្មី	Thnal Thmei	250504
25050501	ក្រែកត្បូង	Kraek Tboung	250505
25050502	ក្រែកជើង	Kraek Cheung	250505
25050503	ជីមាន់ត្បូង	Chimoan Tboung	250505
25050504	ជីមាន់ជើង	Chimoan Cheung	250505
25050505	ជីមាន់កណ្ដាល	Chimoan Kandal	250505
25050506	ជីមាន់លិច	Chimoan Lech	250505
25050507	ពើក	Peuk	250505
25050508	ហួចលិច	Huoch Lech	250505
25050509	ហួចកើត	Huoch Kaeut	250505
25050510	ព្រៃទទឹង	Prey Totueng	250505
25050511	ទួលអង្គ្រង	Tuol Angkrong	250505
25050512	នាងនយ	Neang Noy	250505
25050513	ត្រសិត	Traset	250505
25050514	កូវ	Kov	250505
25050515	ល្អក់	L'ak	250505
25050516	គរ	Kor	250505
25050517	អំពុក	Ampuk	250505
25050518	ជីពាំង	Chi Peang	250505
25050519	បុសល្វេ	Bos Lveae	250505
25050520	សមាគម	Sakmakom	250505
25050521	ត្រពាំងសុខា	Trapeang Sokha	250505
25050522	អណ្ដូងជ័យ	Andoung Chey	250505
25050523	សេរីសុខា	Serei Sokha	250505
25050524	ជីតុក	Chi Tok	250505
25050525	មេម៉ៃ	Memae	250505
25050526	ស្រែទឹក	Srae Tuek	250505
25050527	ស្អំ	S'am	250505
25050528	រោងចក្រ	Roung Chakr	250505
25050529	សំបូរផល	Sambour Phal	250505
25050530	ភូមិ ៥៥	Phum Hapram	250505
25050531	ភូមិ ៤៥	Phum Saepram	250505
25050532	ភូមិ ៣៧	Phum Samprampir	250505
25050533	ព្រឹត	Pruet	250505
25050601	ពពេល	Popel	250506
25050602	ទួលកណ្ដាល	Tuol Kandal	250506
25050603	ថ្មី	Thmei	250506
25050604	ត្រពាំងថ្ម	Trapeang Thma	250506
25050605	ខ្សាក	Khsak	250506
25050606	ត្រពាំងឈ្លើង	Trapeang Chhleung	250506
25050607	ស្រះ	Srah	250506
25050608	ជាំធ្លក	Choam Thlok	250506
25050609	ស្ទឹងជើង	Stueng Cheung	250506
25050610	ទួលចាន់	Tuol Chan	250506
25050701	ទួលសង្កែ	Tuol Sangkae	250507
25050702	ក្បាលដំរី	Kbal Damrei	250507
25050703	ត្រពាំងព្រីង ទី ១	Trapeang Pring Ti Muoy	250507
25050704	ត្រពាំងព្រីង ទី ២	Trapeang Pring Ti Pir	250507
25050705	ច្រករំដេង	Chrak Rumdeng	250507
25050706	សេរីសុខុម	Serei Sokhom	250507
25050707	ត្រពាំងរំសែង	Trapeang Rumsaeng	250507
25050708	ព្រះផ្ដៅ	Preah Phdau	250507
25050709	បុសចេក	Bos Chek	250507
25050710	ថ្នល់កែង	Thnal Kaeng	250507
25050711	ត្រាចខោល	Trach Khaol	250507
25050712	ត្រពាំងផ្លុង ទី ២	Trapeang Phlong Ti Pir	250507
25050713	ត្រពាំងផ្លុង ទី ១	Trapeang Phlong Ti Muoy	250507
25050714	ថ្មី	Thmei	250507
25050801	ច្រាប	Chrab	250508
25050802	ស្រឡៅច្រឹង	Sralau Chroeng	250508
25050803	វាលម្លូរ	Veal Mlu	250508
25050804	ដំបងអំពាក់	Dambang Ampeak	250508
25050805	កប្បាស	Kabbas	250508
25050806	ក្រញូង	Kranhung	250508
25050807	សុខចំរើន	Sokh Chamraeun	250508
25050808	ភូមិ១០.៨	Phum Dab - Prambei	250508
25060101	ពោធិកិល	Pou Kel	250601
25060102	ធ្លក	Thlok	250601
25060103	ជ្រៃបិទមាស	Chrey Bet Meas	250601
25060104	វិហារខ្ពស់	Vihear Khpos	250601
25060105	សួងលិច	Suong Lech	250601
25060106	ជើងឡង	Cheung Lang	250601
25060107	សួងកើត	Suong Kaeut	250601
25060108	ព្រៃទទឹង	Prey Totueng	250601
25060109	ច្រកពោន	Chrak Poun	250601
25060110	ពណ្ណរាយ	Ponnareay	250601
25060111	ចុងអង្គ្រង	Chong Angkrong	250601
25060112	តូង	Toung	250601
25060113	ភូមិ ៤.៨	Phum Buon Prambei	250601
25060114	ភូមិ ១៨	Phum Dabprambei	250601
25060115	ភូមិ ៣.១០	Phum Bei Dab	250601
25060201	ជ្រួយ	Chruoy	250602
25060202	ជីកែ	Chi Kae	250602
25060203	កណ្ដាល	Kandal	250602
25060204	ជើងវត្ដ	Cheung Voat	250602
25060205	ថ្មី	Thmei	250602
25060206	ក្រឆាន	Krachhan	250602
25060207	ប្រស្រែក្រោម	Prasrae Kraom	250602
25060208	ប្រស្រែលើ	Prasrae Leu	250602
25060209	ព្នៅ	Pnov	250602
25060210	ថ្នល់ថ្មី	Thnal Thmei	250602
25060211	ភូមិ ៦.១០	Phum Prammuoy Dab	250602
25060212	ភូមិ ៦.១២	Phum Prammuoy Dabpir	250602
25060213	ភូមិ ៥.១០	Phum Pram Dab	250602
25060214	វាលចារ	Veal Char	250602
25060215	គៀនរូង	Kien Rung	250602
25070101	ពន្លៃជួរ	Ponley Chuor	250701
25070102	មជ្ឈឹមភាគ	Mochchhuem Pheak	250701
25070103	ឈើទាលជ្រុំ	Chheu Teal Chrum	250701
25070104	ត្រពាំងចក	Trapeang Chak	250701
25070105	កូនត្មាត	Koun Tmat	250701
25070106	ក្រោយវត្ដ	Kraoy Voat	250701
25070107	តាកែប	Ta Kaeb	250701
25070108	ពោន	Poun	250701
25070109	ឯអូត	Ae Out	250701
25070110	ពោធិរោង	Pou Roung	250701
25070111	ពន្លៃផ្សា	Ponley Phsar	250701
25070112	អង្កែវ	Angkaev	250701
25070113	តាត្រាវ	Ta Trav	250701
25070114	ដំណាក់ចារ	Damnak Char	250701
25070115	ព្រៃកំពែង	Prey Kampeaeng	250701
25070116	ឥសាន្ដមានជ័យ	Eisant Mean Chey	250701
25070117	ព្រៃជង្រុក	Prey Chongruk	250701
25070118	ដូងព្រះ	Doung Preah	250701
25070119	រូង	Rung	250701
25070120	ត្រាច	Trach	250701
25070121	អញ្ចើម	Anhchaeum	250701
25070122	នាហ្មឹនខឹង	Neameun Khoeng	250701
25070201	បឹងព្រួលលើ	Boeng Pruol Leu	250702
25070202	ទួលកំពតទី ១	Tuol Kampot Ti Muoy	250702
25070203	ទួលកំពតទី ៣	Tuol Kampot Ti Bei	250702
25070204	ម៉ាស៊ីនស្រូវ	Masin Srov	250702
25070205	វិហារក្រោម	Vihear Kraom	250702
25070206	បាតដីក្រោម	Bat Dei Kraom	250702
25070207	បឹងកំបោរ	Boeng Kambaor	250702
25070208	ទួលដំបង	Tuol Dambang	250702
25070209	ស្ពានឈើ	Spean Chheu	250702
25070210	បឹងកក់	Boeng kak	250702
25070211	បឹងព្រះ	Boeng Preah	250702
25070301	វាលលិច	Veal Lech	250703
25070302	ខ្ទុំកណ្ដាល	Khtum Kandal	250703
25070303	រកាឃ្មួចត្បូង	Roka Khmuoch Tboung	250703
25070304	រកាឃ្មួចជើង	Roka Khmuoch Cheung	250703
25070305	ស្លែង	Slaeng	250703
25070306	វាល	Veal	250703
25070307	ខ្នាចក្រសាំង	Khnach Krasang	250703
25070308	ចន្ទុំ	Chantum	250703
25070309	ទួលកណ្ដាលជើង	Tuol Kandal Cheung	250703
25070310	ជីគរ	Chi Kor	250703
25070311	កំរ៉ែង	Kamraeng	250703
25070312	ស្ទឹងពេញ	Stueng Penh	250703
25070313	ស្វាយទិព្វ	Svay Tipv	250703
25070314	ខ្ទុំកើត	Khtum Kaeut	250703
25070315	ខ្ទុំលិច	Khtum Lech	250703
25070316	សាមគ្គី	Sameakki	250703
25070317	ទួលកណ្ដាលត្បូង	Tuol Kandal Tboung	250703
25070318	ទួលថ្មី	Tuol Thmei	250703
25070319	វះ (ជាសារ)	Veah (Cheang Sar )	250703
25070401	ព្រែកតូច	Preaek Touch	250704
25070402	រកាធំ	Roka Thum	250704
25070403	ជីរោទ៍ក្រោម ទី ១	Chirou Kraom Ti Muoy	250704
25070404	ជីរោទ៍ក្រោម ទី ២	Chirou Kraom Ti Pir	250704
25070405	ជីរោទ៍លើ	Chirou Leu	250704
25070406	ជីរោទ៍កណ្ដាល	Chirou Kandal	250704
25070407	ជួរកណ្ដាល	Chuor Kandal	250704
25070408	កំពង់ឫស្សី	Kampong Ruessei	250704
25070409	ទួលកែវ	Tuol Kaev	250704
25070501	ទួលវិហារ	Tuol Vihear	250705
25070502	ស្រែសៀម	Srae Siem	250705
25070503	ទឹកចេញ	Tuek Chenh	250705
25070504	ឯកភាព	Aekkapheap	250705
25070505	ទួលពន្លៃ	Tuol Ponley	250705
25070506	ម្រាមទាក	Mream Teak	250705
25070507	អណ្ដូងជា	Andoung Chea	250705
25070508	តាត្រាវ	Ta Trav	250705
25070509	ជ្រោយគរ	Chrouy Kor	250705
25070510	បឹងត្រស់	Boeng Traoh	250705
25070511	សាមពីរ	Sampir	250705
25070512	សំពៅផុសថ្មី	Sampov Phos Thmei	250705
25070601	ជប់ទី ១	Chob Ti Muoy	250706
25070602	ជប់ទី ២	Chob Ti Pir	250706
25070603	ជប់ក្រៅ	Chob Krau	250706
25070604	ច្រកចំបក់	Chrak Chambak	250706
25070605	វាលកណ្ដៀង	Veal Kandieng	250706
25070606	ស្លាបក្ដោង	Slab Kdaong	250706
25070607	អណ្ដូងល្វេ	Andoung Lve	250706
25070608	ទួលទ្រាត្បូង	Tuol Trea Tboung	250706
25070609	ទួលទ្រាជើង	Tuol Trea Cheung	250706
25070610	ទួលសំបូរ	Tuol Sambour	250706
25070611	ភូមិ ១៤	Phum Dabbuon	250706
25070612	ភូមិ ១៥	Phum Dabpram	250706
25070613	ភូមិ ៤៦	Phum Saeprammuoy	250706
25070614	ភូមិ ៣៦	Phum Samprammuoy	250706
25070615	ភូមិ ០៤.០៥	Phum Sounbuon Sounpram	250706
25070616	ភូមិ ០៦	Phum Sounprammuoy	250706
25070701	ល្វាតូច	Lvea Touch	250707
25070702	សេះ	Seh	250707
25070703	ក្បាលបឹងសេះ	Kbal Boeng Seh	250707
25070704	ដំណាក់ពពេល	Damnak Popel	250707
25070705	ក្បាលអូរ	Kbal Ou	250707
25070706	ធ្នង់	Thnong	250707
25070707	ទួលថ្មី	Tuol Thmei	250707
25070708	ទេព្វនិមិត្ដ	Tep Nimitt	250707
25070709	វាលឃ្មុំ	Veal Khmum	250707
25070710	កណ្ដាល	Kandal	250707
25070711	គរ	Kor	250707
25070712	សំបួរ	sambuor	250707
25070713	ភូមិ ៨.១៥	Phum Prambei Dabpram	250707
25070714	ភូមិ ៦.១៦	Phum Prammuoy Dabprammuoy	250707
25070715	ទួលវិហារមានជ័យ	Tuol Vihear Mean Chey	250707
25070716	ទំនប់សែនជ័យ	Tumnob Saen Chey	250707
25070717	ត្រពាំងបី	Trapeang Bei	250707
25070718	វាលទឹកចេញ	Veal Tuek Chenh	250707
25070719	ក្បាលបឹងសេះកើត	Kbal Boeng Seh Kaeut	250707
25070720	សុខសាន្ដ	Sokh Sant	250707
25070801	ល្ងៀង	Lngieng	250708
25070802	គគីរ	Kokir	250708
25070803	ច្រាប	Chrab	250708
25070804	ស្មោញ	Smaonh	250708
25070805	ល្វាធំ	Lvea Thum	250708
25070806	ភូមិ ៤.១៦	Phum Buon Dabprammuoy	250708
25070807	ភូមិ ២.១៧	Phum Pir Dabprampir	250708
25070808	ថ្លុងពង្រ	Thlok Pongro	250708
25070809	គៀនចេក	Kien Chek	250708
25070901	ត្រពាំងស្នោ	Trapeang Snao	250709
25070902	ជីពាង	Chi Peang	250709
25070903	ព្រីង	Pring	250709
25070904	រៀវ	Riev	250709
25070905	ធ្នង់	Thnong	250709
25070906	មង់ទី ៧	Mong Ti Prampir	250709
25070907	មង់ទី ៦	Mong Ti Prammuoy	250709
25070908	ជើងខាល	Cheung Khal	250709
25070909	ត្រពាំងក្រពើ	Trapeang Krapeu	250709
25070910	ពោន	Poun	250709
25070911	ជ្រោយចង្ហា	Chrouy Changha	250709
25071001	តាប៉ាង	Ta Pang	250710
25071002	ព្រែកផ្ដៅ	Preaek Phdau	250710
25071003	កំពង់ចន្លុះលិច	Kampong Chanloh Lech	250710
25071004	ឈើទាលទី ២	Chheu Teal Ti Pir	250710
25071005	កំពង់ចន្លុះកើត	Kampong Chanloh Kaeut	250710
25071006	ឈើទាលតូច	Chheu Teal Touch	250710
25071007	ឈើទាល ទី ១	Chheu Teal Ti Muoy	250710
25071008	ពាមក្នុង	Peam Knong	250710
25071009	បទស្លាស្នាម	Bat Sla Snam	250710
25071010	ប្រាំដំឡឹង	Pram Damloeng	250710
25071011	ព្រែកពាម	Preaek Peam	250710
25071101	ចុងអូរ	Chong Ou	250711
25071102	វាលវង់	Veal Vong	250711
25071103	រកាពប្រាំទី ១	Roka Po Pram Ti Muoy	250711
25071104	ព្រះអង្គ	Preah Angk	250711
25071105	ច័ន្ទនិមិត្ដ	Chant Nimitt	250711
25071106	វិហារសំបូរ	Vihear Sambour	250711
25071107	រកាប្រាំទី ២	Roka Po Pram Ti Pir	250711
25071108	ឈូកសណ្ដល់	Chhuk Sandal	250711
25071109	ត្រពាំងខ្លា	Trapeang Khla	250711
25071110	ពងទឹក	Pong Tuek	250711
25071111	តាប៉ាវបំពេញទេស	Ta Pav Bampenh Tes	250711
25071112	ប្រផាត់	Praphat	250711
25071113	ត្រពាំងឫស្សី	Trapeang Ruessei	250711
25071114	គោល	Koul	250711
25071115	សមរម្យ	Samrum	250711
25071116	ភ្នំលក	Phnum Lok	250711
25071117	១០.១១	Dab Dabmuoy	250711
25071118	៨.១១	Prambei Dabmuoy	250711
25071119	ជាំម្លូរ	Choam Mlur	250711
25071120	តាពេញ	Ta Penh	250711
25071121	ត្រពាំងព្រលិត	Trapeang Pralit	250711
25071201	ចាន់ទូង	Chan Toung	250712
25071202	ត្របុស្ស	Trabos	250712
25071203	ត្រពាំងធំ	Trapeang Thum	250712
25071204	ប្រយ៉ាប	Prayab	250712
25071205	សង្គមថ្មី	Sangkom Thmei	250712
25071206	អង្គរជា	Angkor Chea	250712
25071207	ស្រឡប់	Sralab	250712
25071208	ដងកាំបិត	Dang Kambet	250712
25071209	ខ្លោង	Khlaong	250712
25071210	ត្រពាំងដុំ	Trapeang Dom	250712
25071211	ខ្នារ	Khnar	250712
25071212	អង្គរជ័យ	Angkor Chey	250712
25071213	វាលខ្នាច	Veal Khnach	250712
25071214	និគមលើ	Nikom Leu	250712
25071215	ប្រធាតុ	Pratheat	250712
25071216	ត្រពាំងគូ	Trapeang Ku	250712
25071217	និគមក្រោម	Nikom Kraom	250712
25071218	អណ្ដូងពក	Andoung Pok	250712
25071219	កៀនរមៀត	Kien Romiet	250712
25071220	ត្រពាំងសង្កែ	Trapeang Sangkae	250712
25071301	ថ្មពេជ្រទី១	Thma Pech Ti Muoy	250713
25071302	ថ្មពេជ្រទី២	Thma Pech Ti Pir	250713
25071303	ថ្មពេជ្រទី៣	Thma Pech Ti Bei	250713
25071304	ពើក	Peuk	250713
25071305	រោងគោ	Roung Kou	250713
25071306	ដូង	Doung	250713
25071307	ជៀសទី១	Chies Ti Muoy	250713
25071308	ជៀសទី២	Chies Ti Pir	250713
25071309	ចំបក់	Chambak	250713
25071310	គក	Kok	250713
25071311	ភូមិ ៦៧	Phum Hokprampir	250713
25071312	ភូមិ ៨/១០	Phum Prambei Dab	250713
25071313	ភូមិ ៨៧	Phum Paetprampir	250713
25071314	ភូមិ ១០/៨	Phum Dab - Prambei	250713
25071315	ទួលអូរពីរ	Tuol Ou Pir	250713
25071401	អន្លង់ពោង	Anlung Poung	250714
25071402	ជ្រោយស្រឡៅ	Chrouy Sralau	250714
25071403	ភ្នំ	Phnum	250714
25071404	អំពិលជ្រុំ	Ampil Chrum	250714
25071405	ទួលគរ	Tuol Kor	250714
25071406	ព្រែកតូច	Preaek Touch	250714
25071407	ព្រែកជីក	Preaek Chik	250714
25071408	ទួលខ្សាច់	Tuol Khsach	250714
25071409	ដូនម៉ៅក្រោម	Doun Mau Kraom	250714
25071410	ដូនម៉ៅលើ	Doun Mau Leu	250714
25071411	ទន្លេបិទក្រោម	Tonle Bet Kraom	250714
25071412	ទន្លេបិទលើ	Tonle Bet Leu	250714
25071413	យាយស	Yeay Sar	250714
25071414	ទន្លេបិទ	Tonle Bet	250714
25071415	តាអ៊ុយ	Ta Uy	250714
\.


--
-- Data for Name: pagodas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pagodas (id, name, abbot_name, village_id, commune_id, district_id, province_id, phone, created_at) FROM stdin;
1	វត្តនិរោធរង្សី	ស្រេង សុខា	\N	\N	\N	\N	\N	\N
2	វត្តប្រជុំវង្ស	ប៊ុន អ៊ុីម	\N	\N	\N	\N	\N	\N
4	ឬស្សីស្រស់	ឬស្សីស្រស់	12120303	121203	001212	12	099838774	\N
5	វត្តកោះនរា	វត្តកោះនរា	12120304	121203	001212	12	098774743	\N
6	វត្តកំសាន្ត	វត្តកំសាន្ត	12120403	121204	001212	12	0394837833	\N
7	វត្តកោះក្របី	សូរ សារឿន	12120802	121208	001212	12	098384743	\N
8	វត្តវាលស្បូវ	វត្តវាលស្បៅ	12120502	121205	001212	12	093747733	\N
9	វត្តស្វាយឧត្តម		\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: kutis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kutis (id, pagoda_id, kuti_name, manager_name, created_at) FROM stdin;
9	1	ធំ ជាន់ទី៣	ពុត ពេជ	2026-06-19 07:56:45
8	1	ធំ ជាន់ទី២	ហុឺម ម៉ានុត	2026-06-19 07:56:49
7	1	ធំ ជាន់ទី១	ត្រង់ សុខរ៉ុម	2026-06-19 07:56:53
6	1	លេខ៤	ខន ចត់	2026-06-19 07:56:57
5	1	លេខ២ ជាន់លើ	ម៉ៅ សុីណា	2026-06-19 07:57:01
4	1	លេខ២ ជាន់ក្រោយ	រឹម មករា	2026-06-19 07:57:06
1	1	សាលាពុទ្ធិក	តុប ចិន្ដា	2026-06-19 07:57:20
2	1	សាលាបាលីចាស់	សារ៉ុម ឆៃរ៉ង	2026-06-19 07:57:24
3	1	ហោត្រ័យ	ធីម ប្រេម	2026-06-19 07:57:28
10	2	តេស្ត	-	\N
11	2	០	-	\N
\.


--
-- Data for Name: nationalities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nationalities (id, name, created_at) FROM stdin;
2	ខ្មែរ	2026-06-19 07:48:58
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, student_code, first_name, last_name, latin_name, gender, monk_status, image_url, sanghatika_no, chaya_name, chaya_no, ordination_date, preceptor_name, nationality_id, date_of_birth, birth_village_code, education_level_id, phone, current_pagoda_id, birth_pagoda_id, kuti_id, enrollment_date, status, created_at, updated_at) FROM stdin;
89	STU104	ផាណ្ណា	ជា	\N	ប្រុស	សាមណេរ	students/logo.png	\N	\N	\N	\N	\N	\N	2008-07-15	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 04:01:29.560061	2026-07-06 16:30:27.943406
117	STU003	រតនា	ឌុយ	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2009-01-22	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 15:55:25.524042
118	STU004	វណ្ណៈ	ណា	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2012-02-17	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 15:55:49.110127
119	STU005	សុមនា	ណែម	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2010-02-20	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 15:56:47.84194
120	STU006	វីរៈ	តុប	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2012-01-01	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 15:57:05.197637
121	STU007	សេងចន្ធី	ថន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2010-06-16	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 15:57:19.486809
122	STU008	សុខលឿន	ទ្រី	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2008-07-23	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 15:57:40.043579
123	STU009	វិច្ឆិកា	ធី	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2009-11-27	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 15:58:04.561326
127	STU013	រ៉ានុត	នី	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2010-11-05	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 15:59:27.654696
128	STU014	មករា	នឿន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2013-01-21	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 15:59:45.795595
129	STU015	ពិសី	នៅ	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2006-06-03	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 16:00:12.855326
130	STU016	វណ្ណៈ	បុប្ផា	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2008-11-12	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 16:00:31.263495
115	STU001	ជូន	ចក់	test	ប្រុស	សាមណេរ		០៩៨៦៣	\N	\N	2026-06-28	ការ	\N	2009-03-24	14090305	1	098765432	1	\N	\N	\N	dropped	2026-06-24 21:02:30.321946	2026-06-28 09:31:46.409229
87	STU102	សូនី	ឃ្នី	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2009-04-07	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:06:14.31963
88	STU103	ស៊ីណាត	ឆ្លាត	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2013-07-15	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:06:41.49527
90	STU105	ហៀន	ជឺន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2009-08-27	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:07:31.146415
91	STU106	ប៊ុនធីម	ជុន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2008-02-22	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:07:52.154401
92	STU107	វឌ្ឍនា	ថន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2013-12-05	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:08:33.514967
93	STU108	សុខគា	ថាច	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2013-05-15	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:08:49.066313
94	STU109	រិទ្ធី	ថេង	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2006-12-12	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:09:49.416956
95	STU110	ចាន់រតនា	ទូច	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2009-08-30	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:10:05.39365
96	STU111	រ៉ាវីន	នៅ	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2010-01-14	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:10:34.754446
97	STU112	ពិសី	ប៉ូច	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2009-12-25	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:11:10.339899
98	STU113	ញ៉ក់	ប៉េង	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2008-12-27	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:11:27.153287
99	STU114	វ៉ាន់នី	ជា	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2012-05-23	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:11:53.287258
100	STU115	សុផៃ	ភន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2009-04-25	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:12:14.827036
101	STU116	សៀងម៉េង	ម៉ាន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2010-09-01	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:12:35.038066
102	STU117	ផាណេត	យ៉ា	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2008-04-24	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:13:05.450861
103	STU118	សុខឡែន	លី	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2010-04-25	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:13:24.477546
104	STU119	យុទ្ធ	វណ្ណី	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2012-09-01	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:13:54.184125
105	STU120	ផល្លា	វ៉ាត	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2011-03-26	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:14:12.772075
106	STU121	ធា	វីន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2010-07-28	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:14:41.382907
107	STU122	សុផល	ស៊ត	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2011-08-04	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:15:03.7901
108	STU123	សំណាង	សាត	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2008-10-21	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:15:19.804104
109	STU124	ម៉េងស៊ាង	សួរ	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2011-02-22	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:15:47.048671
110	STU125	ហ្សឺឌី	សៅ	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2012-01-11	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:16:12.84424
111	STU126	សុវណ្ណវិហ្សា	ឡូន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2008-11-11	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:17:12.817201
112	STU127	មេត្តា	ឡេង	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2012-12-23	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:17:38.889081
113	STU128	បញ្ញា	អាន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2008-02-17	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:18:10.277031
114	STU129	ចាន់ឌី	អ៊ុក	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2010-01-30	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:01:29.560061	2026-06-25 16:18:27.733798
124	STU010	ហាន់ឆៀវ	នយ	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2009-12-10	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 04:02:30.321946	2026-06-26 07:59:12.298238
116	STU002	ចំណាប់	ឆោម	\N	ប្រុស	សាមណេរ	students/2025-08-13_19.41.13.jpg	\N	\N	\N	\N	\N	2	2011-12-28	\N	\N	098894858	2	\N	11	\N	active	2026-06-21 02:02:30.321946	2026-07-07 16:34:46.692405
126	STU012	ដែន	យឿង	\N	ប្រុស	សាមណេរ	students/magic_editTUFIT2hJX1VrcjAjMSNjZTllN2I1YTQzNGJiOWZlMzA4YmVkN2Q2NWQ3MTdkNSMxMDI0IyNUUkFOU0ZPUk1BVElPTl9SRVFVRVNU.jpg	\N	\N	\N	\N	\N	\N	2009-12-21	\N	\N	0	\N	\N	\N	\N	active	2026-06-24 21:02:30.321946	2026-07-06 16:30:05.754574
86	STU101	សុផាត	គឹម	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2012-05-15	\N	\N	០	\N	\N	\N	\N	dropped	2026-06-24 07:01:29.560061	2026-06-27 12:10:42.41434
131	STU017	ធី	ប្រុស	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2007-03-26	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 16:00:46.45516
132	STU018	សុតារា	ផល	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2011-06-25	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 16:01:11.049483
133	STU019	សោភ័ន	ផល់	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2009-11-30	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 16:01:24.287873
134	STU020	សុភត្រា	ភុន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2008-11-30	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 16:01:39.364879
136	STU022	ថេរ៉ា	ម៉ុន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2011-08-28	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 16:02:07.986553
144	STU000030	កាមិញ	មិ	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	\N	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 16:03:12.322755	\N
139	STU025	សិរីបុត្រ	សាក់	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2013-06-25	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 16:04:01.613577
140	STU026	គាឡាយ	សុខគឹម	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2009-11-25	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 16:04:21.897203
141	STU027	ច័ន្ទលីន	ឡី	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2010-05-17	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 16:04:41.909491
142	STU028	រ៉ាសិញ	អឿន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2010-03-07	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 16:05:07.822349
143	STU029	លាងអុី	អេន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2012-01-17	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 11:02:30.321946	2026-06-25 16:05:24.920871
145	STU000031	ថីរ៉ាយុ	ថា	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	\N	\N	\N	០	\N	\N	\N	\N	active	2026-06-26 07:39:40.828503	\N
138	STU024	សុវ៉ាន់	វៃ	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2011-07-15	\N	\N	០	\N	\N	\N	\N	active	2026-06-25 04:02:30.321946	2026-06-26 07:39:59.743999
135	STU021	ច័ន្ទដារិទ្ធ	ម៉ុន	\N	ប្រុស	សាមណេរ		\N	\N	\N	\N	\N	\N	2013-08-31	\N	\N	0	\N	\N	\N	\N	active	2026-06-25 04:02:30.321946	2026-07-01 10:35:13.630396
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers (id, teacher_code, first_name, last_name, latin_name, gender, monk_status, phone, start_date, status, image_url, created_at, updated_at) FROM stdin;
3	T0002	គាត	សែ	\N	ប្រុស	ភិក្ខុ	099367464	2024-05-01	active		2026-06-19 08:17:23	2026-06-19 08:17:25
4	T0003	មករា	រឹម	\N	ប្រុស	ភិក្ខុ	\N	2024-05-01	active		2026-06-19 08:18:24	2026-06-19 08:18:26
5	T001	ចន្ទថុល្ល	យឹម		ប្រុស	គ្រហស្ថ	0	2026-06-22	active		2026-06-19 11:09:36.394494	2026-06-22 15:25:45.555195
6	T002	សារិទ្ធិ	ហួត		ប្រុស	គ្រហស្ថ	០	\N	active		2026-06-19 11:09:36.394494	2026-06-23 17:14:09.348134
7	T003	ហុងលី	ខាត់		ប្រុស	គ្រហស្ថ	០	\N	active		2026-06-19 11:09:36.394494	2026-06-23 17:14:40.476437
9	T005	រដ្ឋា	សុខុម		ប្រុស	គ្រហស្ថ	០	\N	active		2026-06-19 11:09:36.394494	2026-06-23 17:14:55.974609
11	T007	ចន្ធី	ប៉ាល់		ប្រុស	គ្រហស្ថ	០	\N	active		2026-06-19 11:09:36.394494	2026-06-23 17:15:37.960666
12	T008	ចាន់ណា	រស់		ស្រី	គ្រហស្ថ	0	\N	active		2026-06-19 11:09:36.394494	2026-06-23 17:15:52.29177
13	T009	នីរ	គឹម		ប្រុស	គ្រហស្ថ	០	\N	active		2026-06-19 11:09:36.394494	2026-06-23 17:16:29.234565
2	T0001	ចិន្ដា	តុប	Tob Chenda	ប្រុស	ភិក្ខុ	0968217022	2024-05-01	active	teachers/Tob_Chenda_n3fA44G.jpg	2026-06-19 01:14:36	2026-06-23 17:16:47.688726
17	T0011	លាងអុីម	លាក		ប្រុស	គ្រហស្ថ	០	2026-06-24	active		\N	\N
16	T0010	ភារ៉ាន់	ចាន់		ប្រុស	ភិក្ខុ	0	2026-06-24	active		\N	2026-06-23 17:18:18.852682
18	T0012	គីមឡាង	ស៊ុក		ប្រុស	គ្រហស្ថ	០	2026-06-24	active		\N	\N
19	T0013	រី	ធឿន		ប្រុស	គ្រហស្ថ	០	2026-06-24	active		\N	\N
20	T0014	ស្រីណាន់	យ៉ែម		ប្រុស	គ្រហស្ថ	០	2026-06-24	active		\N	\N
23	T0015	វុទ្ធី	ដូង	\N	ប្រុស	គ្រហស្ថ	0123456789	\N	active		\N	\N
24	T0016	ចន្នី	ប៉ាល់	\N	ប្រុស	គ្រហស្ថ	0123456789	\N	active		\N	\N
10	T006	វិជ្ជនី	ឌូង		ប្រុស	គ្រហស្ថ	០	\N	active		2026-06-19 04:09:36.394494	2026-06-25 01:51:32.191916
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password_hash, role, teacher_id, student_id, is_active, last_login, created_at, updated_at) FROM stdin;
1	admin	pbkdf2_sha256$600000$OBAwMagJhhVHzn4dE3ANpF$FjM7QcOX02F33zHPuvBM9irLWsbU5Kja5zNTyFESEeA=	admin	2	\N	t	2026-06-17 00:29:44	\N	2026-07-08 00:55:10.643895
3	monitor_stu012	pbkdf2_sha256$600000$qAHZkzMEqVUuAv0m3tH6zf$raoyPnWDjXtGkPtQ9gDy8jC6In4ZZbNnbsa3LhlLYPU=	monitor	\N	126	t	\N	\N	\N
4	monitor_stu104	pbkdf2_sha256$600000$pkDeFZqdqfPGxPZvAX1ONk$CIGplfx1iHbxwruyACoADOJKtNp4AnEArPJEEQ31Y5M=	monitor	\N	89	t	\N	\N	\N
5	monitor_stu105	pbkdf2_sha256$600000$WfuARLQaAf7eYEINtan2dn$vOgK5sdFm41M2MF4qD8KmWp1bB5JEriE+ZIfadlOneg=	monitor	\N	90	t	\N	\N	\N
6	monitor_stu019	pbkdf2_sha256$600000$FNzDv6jAiJaLD4iYVUduVS$bCuogb3gXmME5nIVi4Gd0ZN/gxTL74WIUpcgQMm2wGo=	monitor	\N	133	t	\N	\N	\N
2	monitorA	pbkdf2_sha256$600000$bYjXuAVKy6MuyI3Z0YZ9Rc$+Gi/PT9a0+Pfl+1M1tDWeQYK85il49FR0uPMYx2Fs8s=	monitor	\N	115	t	\N	\N	2026-07-07 08:54:41.152181
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (id, user_id, action, table_name, record_id, description, ip_address, created_at) FROM stdin;
\.


--
-- Data for Name: classrooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.classrooms (id, class_name, grade_level, homeroom_teacher_id, room, created_at, desks_per_row) FROM stdin;
5	ថ្នាក់ទី ៣	9	3	៥	2026-06-19 01:22:44	4
4	ថ្នាក់ទី ២(ខ)	8	4	៤	2026-06-18 11:21:51	4
3	ថ្នាក់ទី ២(ក)	8	4	៣	2026-06-18 18:21:20	4
2	ថ្នាក់ទី ១(ខ)	7	2	២	2026-06-18 11:20:51	4
1	ថ្នាក់ទី ១(ក)	7	2	១	2026-06-14 23:20:24	4
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjects (id, subject_code, subject_name, coefficient, total_hours, total_score, total_homework, total_time_exam, created_at) FROM stdin;
13	S13	ប្រវត្តិវិទ្យា	1	4	30	4	45	2026-06-19 11:02:25
12	S12	ភូមិវិទ្យា	1	4	30	4	45	2026-06-19 11:02:25
11	S11	ផែនដីវិទ្យា	1	4	30	4	45	2026-06-19 11:02:25
10	S10	ជីវវិទ្យា	1	4	30	4	45	2026-06-19 04:02:25
9	S09	គីមីវិទ្យា	1	6	50	4	60	2026-06-19 11:02:25
8	S08	រូបវិទ្យា	1	6	50	4	60	2026-06-19 11:02:25
7	S07	គណិតវិទ្យា	1	20	90	4	120	2026-06-19 11:02:25
5	S05	ភាសាខ្មែរ	1	16	90	4	90	2026-06-19 11:02:25
2	S02	ព្រះវិន័យ	1	8	90	4	90	2026-06-19 11:02:25
14	S14	សីលធម៌	1	4	30	4	45	2026-06-19 04:02:25
1	S01	ភាសាបាលី	1	32	120	4	120	2026-06-18 14:02:25
6	S06	អង់គ្លេស	1	4	30	4	45	2026-06-19 04:02:25
4	S04	សំស្រ្កឹត	1	12	90	4	90	2026-06-19 04:02:25
3	S03	ព្រះអភិធម្ម	1	6	90	4	90	2026-06-19 04:02:25
65	NONE	គ្មានគ្រូបង្រៀន	1	0	0	\N	\N	\N
\.


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance (id, student_id, classroom_id, session, attendance_date, status, subject_id, academic_year_id, recorded_by_teacher_id, recorded_by_monitor_id, created_at, updated_at, late_time) FROM stdin;
\.


--
-- Data for Name: attendance_warnings; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.attendance_warnings (id, last_absent_warned, last_permission_warned, last_late_warned, updated_at, academic_year_id, student_id) FROM stdin;
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	auth	user
5	contenttypes	contenttype
6	sessions	session
7	authtoken	token
8	authtoken	tokenproxy
9	core	academicperiods
10	core	academicyears
11	core	classrooms
12	core	classsubjects
13	core	communes
14	core	districts
15	core	documents
16	core	kutis
17	core	nationalities
18	core	pagodas
19	core	paperheaders
20	core	payrates
21	core	provinces
22	core	schedulesubstitutions
23	core	schoolcalendar
24	core	subjects
25	core	teachingsessions
26	core	timeslots
27	core	timetable
28	core	villages
29	core	yearbookentries
30	students	awards
31	students	classmonitors
32	students	enrollments
33	students	monkpermission
34	students	monkpermissionlogs
35	students	pendingstudents
36	students	studenteducation
37	students	students
38	students	studentpayyear
39	attendance	attendance
40	attendance	notifications
41	attendance	reportdaily
42	scores	finalscores
43	scores	scores
44	users	positions
45	users	teachers
46	users	users
47	users	teachereducation
48	users	staffpositions
49	users	activitylogs
50	users	teachersalaries
51	permissions	permissionactions
52	permissions	permissionauditlogs
53	permissions	permissiongroupmembers
54	permissions	permissiongroups
55	permissions	permissionresources
56	permissions	permissions
57	permissions	resourceaccesspolicies
58	permissions	rolepermissions
59	permissions	userpermissions
60	students	registrationsession
61	core	educationlevels
62	users	pendingteachers
63	users	teacherregistrationsession
64	students	multiplepermission
65	students	dropoutstudent
66	core	payrollrecords
67	attendance	attendancewarning
68	core	monthlypayrolls
69	core	payrollrates
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add content type	5	add_contenttype
14	Can change content type	5	change_contenttype
15	Can delete content type	5	delete_contenttype
16	Can view content type	5	view_contenttype
17	Can add session	6	add_session
18	Can change session	6	change_session
19	Can delete session	6	delete_session
20	Can view session	6	view_session
21	Can add Token	7	add_token
22	Can change Token	7	change_token
23	Can delete Token	7	delete_token
24	Can view Token	7	view_token
25	Can add Token	8	add_tokenproxy
26	Can change Token	8	change_tokenproxy
27	Can delete Token	8	delete_tokenproxy
28	Can view Token	8	view_tokenproxy
29	Can add academic periods	9	add_academicperiods
30	Can change academic periods	9	change_academicperiods
31	Can delete academic periods	9	delete_academicperiods
32	Can view academic periods	9	view_academicperiods
33	Can add academic years	10	add_academicyears
34	Can change academic years	10	change_academicyears
35	Can delete academic years	10	delete_academicyears
36	Can view academic years	10	view_academicyears
37	Can add classrooms	11	add_classrooms
38	Can change classrooms	11	change_classrooms
39	Can delete classrooms	11	delete_classrooms
40	Can view classrooms	11	view_classrooms
41	Can add class subjects	12	add_classsubjects
42	Can change class subjects	12	change_classsubjects
43	Can delete class subjects	12	delete_classsubjects
44	Can view class subjects	12	view_classsubjects
45	Can add communes	13	add_communes
46	Can change communes	13	change_communes
47	Can delete communes	13	delete_communes
48	Can view communes	13	view_communes
49	Can add districts	14	add_districts
50	Can change districts	14	change_districts
51	Can delete districts	14	delete_districts
52	Can view districts	14	view_districts
53	Can add documents	15	add_documents
54	Can change documents	15	change_documents
55	Can delete documents	15	delete_documents
56	Can view documents	15	view_documents
57	Can add kutis	16	add_kutis
58	Can change kutis	16	change_kutis
59	Can delete kutis	16	delete_kutis
60	Can view kutis	16	view_kutis
61	Can add nationalities	17	add_nationalities
62	Can change nationalities	17	change_nationalities
63	Can delete nationalities	17	delete_nationalities
64	Can view nationalities	17	view_nationalities
65	Can add pagodas	18	add_pagodas
66	Can change pagodas	18	change_pagodas
67	Can delete pagodas	18	delete_pagodas
68	Can view pagodas	18	view_pagodas
69	Can add paper headers	19	add_paperheaders
70	Can change paper headers	19	change_paperheaders
71	Can delete paper headers	19	delete_paperheaders
72	Can view paper headers	19	view_paperheaders
73	Can add pay rates	20	add_payrates
74	Can change pay rates	20	change_payrates
75	Can delete pay rates	20	delete_payrates
76	Can view pay rates	20	view_payrates
77	Can add provinces	21	add_provinces
78	Can change provinces	21	change_provinces
79	Can delete provinces	21	delete_provinces
80	Can view provinces	21	view_provinces
81	Can add schedule substitutions	22	add_schedulesubstitutions
82	Can change schedule substitutions	22	change_schedulesubstitutions
83	Can delete schedule substitutions	22	delete_schedulesubstitutions
84	Can view schedule substitutions	22	view_schedulesubstitutions
85	Can add school calendar	23	add_schoolcalendar
86	Can change school calendar	23	change_schoolcalendar
87	Can delete school calendar	23	delete_schoolcalendar
88	Can view school calendar	23	view_schoolcalendar
89	Can add subjects	24	add_subjects
90	Can change subjects	24	change_subjects
91	Can delete subjects	24	delete_subjects
92	Can view subjects	24	view_subjects
93	Can add teaching sessions	25	add_teachingsessions
94	Can change teaching sessions	25	change_teachingsessions
95	Can delete teaching sessions	25	delete_teachingsessions
96	Can view teaching sessions	25	view_teachingsessions
97	Can add time slots	26	add_timeslots
98	Can change time slots	26	change_timeslots
99	Can delete time slots	26	delete_timeslots
100	Can view time slots	26	view_timeslots
101	Can add timetable	27	add_timetable
102	Can change timetable	27	change_timetable
103	Can delete timetable	27	delete_timetable
104	Can view timetable	27	view_timetable
105	Can add villages	28	add_villages
106	Can change villages	28	change_villages
107	Can delete villages	28	delete_villages
108	Can view villages	28	view_villages
109	Can add yearbook entries	29	add_yearbookentries
110	Can change yearbook entries	29	change_yearbookentries
111	Can delete yearbook entries	29	delete_yearbookentries
112	Can view yearbook entries	29	view_yearbookentries
113	Can add awards	30	add_awards
114	Can change awards	30	change_awards
115	Can delete awards	30	delete_awards
116	Can view awards	30	view_awards
117	Can add class monitors	31	add_classmonitors
118	Can change class monitors	31	change_classmonitors
119	Can delete class monitors	31	delete_classmonitors
120	Can view class monitors	31	view_classmonitors
121	Can add enrollments	32	add_enrollments
122	Can change enrollments	32	change_enrollments
123	Can delete enrollments	32	delete_enrollments
124	Can view enrollments	32	view_enrollments
125	Can add monk permission	33	add_monkpermission
126	Can change monk permission	33	change_monkpermission
127	Can delete monk permission	33	delete_monkpermission
128	Can view monk permission	33	view_monkpermission
129	Can add monk permission logs	34	add_monkpermissionlogs
130	Can change monk permission logs	34	change_monkpermissionlogs
131	Can delete monk permission logs	34	delete_monkpermissionlogs
132	Can view monk permission logs	34	view_monkpermissionlogs
133	Can add pending students	35	add_pendingstudents
134	Can change pending students	35	change_pendingstudents
135	Can delete pending students	35	delete_pendingstudents
136	Can view pending students	35	view_pendingstudents
137	Can add student education	36	add_studenteducation
138	Can change student education	36	change_studenteducation
139	Can delete student education	36	delete_studenteducation
140	Can view student education	36	view_studenteducation
141	Can add students	37	add_students
142	Can change students	37	change_students
143	Can delete students	37	delete_students
144	Can view students	37	view_students
145	Can add student pay year	38	add_studentpayyear
146	Can change student pay year	38	change_studentpayyear
147	Can delete student pay year	38	delete_studentpayyear
148	Can view student pay year	38	view_studentpayyear
149	Can add attendance	39	add_attendance
150	Can change attendance	39	change_attendance
151	Can delete attendance	39	delete_attendance
152	Can view attendance	39	view_attendance
153	Can add notifications	40	add_notifications
154	Can change notifications	40	change_notifications
155	Can delete notifications	40	delete_notifications
156	Can view notifications	40	view_notifications
157	Can add report daily	41	add_reportdaily
158	Can change report daily	41	change_reportdaily
159	Can delete report daily	41	delete_reportdaily
160	Can view report daily	41	view_reportdaily
161	Can add final scores	42	add_finalscores
162	Can change final scores	42	change_finalscores
163	Can delete final scores	42	delete_finalscores
164	Can view final scores	42	view_finalscores
165	Can add scores	43	add_scores
166	Can change scores	43	change_scores
167	Can delete scores	43	delete_scores
168	Can view scores	43	view_scores
169	Can add positions	44	add_positions
170	Can change positions	44	change_positions
171	Can delete positions	44	delete_positions
172	Can view positions	44	view_positions
173	Can add teachers	45	add_teachers
174	Can change teachers	45	change_teachers
175	Can delete teachers	45	delete_teachers
176	Can view teachers	45	view_teachers
177	Can add users	46	add_users
178	Can change users	46	change_users
179	Can delete users	46	delete_users
180	Can view users	46	view_users
181	Can add teacher education	47	add_teachereducation
182	Can change teacher education	47	change_teachereducation
183	Can delete teacher education	47	delete_teachereducation
184	Can view teacher education	47	view_teachereducation
185	Can add staff positions	48	add_staffpositions
186	Can change staff positions	48	change_staffpositions
187	Can delete staff positions	48	delete_staffpositions
188	Can view staff positions	48	view_staffpositions
189	Can add activity logs	49	add_activitylogs
190	Can change activity logs	49	change_activitylogs
191	Can delete activity logs	49	delete_activitylogs
192	Can view activity logs	49	view_activitylogs
193	Can add teacher salaries	50	add_teachersalaries
194	Can change teacher salaries	50	change_teachersalaries
195	Can delete teacher salaries	50	delete_teachersalaries
196	Can view teacher salaries	50	view_teachersalaries
197	Can add permission actions	51	add_permissionactions
198	Can change permission actions	51	change_permissionactions
199	Can delete permission actions	51	delete_permissionactions
200	Can view permission actions	51	view_permissionactions
201	Can add permission audit logs	52	add_permissionauditlogs
202	Can change permission audit logs	52	change_permissionauditlogs
203	Can delete permission audit logs	52	delete_permissionauditlogs
204	Can view permission audit logs	52	view_permissionauditlogs
205	Can add permission group members	53	add_permissiongroupmembers
206	Can change permission group members	53	change_permissiongroupmembers
207	Can delete permission group members	53	delete_permissiongroupmembers
208	Can view permission group members	53	view_permissiongroupmembers
209	Can add permission groups	54	add_permissiongroups
210	Can change permission groups	54	change_permissiongroups
211	Can delete permission groups	54	delete_permissiongroups
212	Can view permission groups	54	view_permissiongroups
213	Can add permission resources	55	add_permissionresources
214	Can change permission resources	55	change_permissionresources
215	Can delete permission resources	55	delete_permissionresources
216	Can view permission resources	55	view_permissionresources
217	Can add permissions	56	add_permissions
218	Can change permissions	56	change_permissions
219	Can delete permissions	56	delete_permissions
220	Can view permissions	56	view_permissions
221	Can add resource access policies	57	add_resourceaccesspolicies
222	Can change resource access policies	57	change_resourceaccesspolicies
223	Can delete resource access policies	57	delete_resourceaccesspolicies
224	Can view resource access policies	57	view_resourceaccesspolicies
225	Can add role permissions	58	add_rolepermissions
226	Can change role permissions	58	change_rolepermissions
227	Can delete role permissions	58	delete_rolepermissions
228	Can view role permissions	58	view_rolepermissions
229	Can add user permissions	59	add_userpermissions
230	Can change user permissions	59	change_userpermissions
231	Can delete user permissions	59	delete_userpermissions
232	Can view user permissions	59	view_userpermissions
233	Can add រដូវកាលចុះឈ្មោះ	60	add_registrationsession
234	Can change រដូវកាលចុះឈ្មោះ	60	change_registrationsession
235	Can delete រដូវកាលចុះឈ្មោះ	60	delete_registrationsession
236	Can view រដូវកាលចុះឈ្មោះ	60	view_registrationsession
237	Can add កម្រិតវប្បធម៌	61	add_educationlevels
238	Can change កម្រិតវប្បធម៌	61	change_educationlevels
239	Can delete កម្រិតវប្បធម៌	61	delete_educationlevels
240	Can view កម្រិតវប្បធម៌	61	view_educationlevels
241	Can add គ្រូកំពុងរង់ចាំ	62	add_pendingteachers
242	Can change គ្រូកំពុងរង់ចាំ	62	change_pendingteachers
243	Can delete គ្រូកំពុងរង់ចាំ	62	delete_pendingteachers
244	Can view គ្រូកំពុងរង់ចាំ	62	view_pendingteachers
245	Can add រដូវកាលដាក់ពាក្យធ្វើគ្រូ	63	add_teacherregistrationsession
246	Can change រដូវកាលដាក់ពាក្យធ្វើគ្រូ	63	change_teacherregistrationsession
247	Can delete រដូវកាលដាក់ពាក្យធ្វើគ្រូ	63	delete_teacherregistrationsession
248	Can view រដូវកាលដាក់ពាក្យធ្វើគ្រូ	63	view_teacherregistrationsession
249	Can add ច្បាប់ឈប់សម្រាកច្រើនថ្ងៃ	64	add_multiplepermission
250	Can change ច្បាប់ឈប់សម្រាកច្រើនថ្ងៃ	64	change_multiplepermission
251	Can delete ច្បាប់ឈប់សម្រាកច្រើនថ្ងៃ	64	delete_multiplepermission
252	Can view ច្បាប់ឈប់សម្រាកច្រើនថ្ងៃ	64	view_multiplepermission
253	Can add សិស្សឈប់រៀន	65	add_dropoutstudent
254	Can change សិស្សឈប់រៀន	65	change_dropoutstudent
255	Can delete សិស្សឈប់រៀន	65	delete_dropoutstudent
256	Can view សិស្សឈប់រៀន	65	view_dropoutstudent
257	Can add កំណត់ត្រាបើកប្រាក់ខែ	66	add_payrollrecords
258	Can change កំណត់ត្រាបើកប្រាក់ខែ	66	change_payrollrecords
259	Can delete កំណត់ត្រាបើកប្រាក់ខែ	66	delete_payrollrecords
260	Can view កំណត់ត្រាបើកប្រាក់ខែ	66	view_payrollrecords
261	Can add ការព្រមានវត្តមាន	67	add_attendancewarning
262	Can change ការព្រមានវត្តមាន	67	change_attendancewarning
263	Can delete ការព្រមានវត្តមាន	67	delete_attendancewarning
264	Can view ការព្រមានវត្តមាន	67	view_attendancewarning
265	Can add កំណត់ត្រាបើកប្រាក់ខែប្រចាំខែ	68	add_monthlypayrolls
266	Can change កំណត់ត្រាបើកប្រាក់ខែប្រចាំខែ	68	change_monthlypayrolls
267	Can delete កំណត់ត្រាបើកប្រាក់ខែប្រចាំខែ	68	delete_monthlypayrolls
268	Can view កំណត់ត្រាបើកប្រាក់ខែប្រចាំខែ	68	view_monthlypayrolls
269	Can add payroll rates	69	add_payrollrates
270	Can change payroll rates	69	change_payrollrates
271	Can delete payroll rates	69	delete_payrollrates
272	Can view payroll rates	69	view_payrollrates
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: authtoken_token; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.authtoken_token (key, created, user_id) FROM stdin;
dcfd201bd4a388cafd61069b58f000c492cfb183	2026-06-19 10:06:55.586419+07	1
1093b0bf119486636cd0df45e637b04a22f46e64	2026-07-06 23:01:01.248705+07	2
560beacf16f41b105d0b9c878da47212a59a4ce0	2026-07-06 23:32:15.721328+07	3
\.


--
-- Data for Name: awards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.awards (id, student_id, academic_year_id, title, award_type, category, rank, awarded_date, description, evidence_url, awarded_by, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: class_monitors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.class_monitors (id, student_id, classroom_id, academic_year_id, role, appointed_date, created_at) FROM stdin;
13	126	1	1	monitor	\N	\N
17	89	2	1	monitor	\N	\N
18	90	2	1	deputy	\N	\N
21	133	1	1	deputy	\N	\N
\.


--
-- Data for Name: class_subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.class_subjects (id, classroom_id, subject_id, teacher_id, created_at, "order") FROM stdin;
157	2	5	17	2026-06-29 09:47:59.586876	0
153	1	4	5	2026-06-29 09:44:56.074998	1
134	1	2	6	2026-06-24 15:52:32.349875	2
151	1	3	7	2026-06-29 09:44:08.782727	3
136	1	5	6	2026-06-24 15:52:32.359193	4
138	1	7	9	2026-06-24 15:52:32.369227	6
139	1	8	10	2026-06-24 08:52:32.381392	7
140	1	9	11	2026-06-24 08:52:32.388395	8
142	1	10	12	2026-06-24 15:52:32.397905	10
143	1	13	13	2026-06-24 15:52:32.40292	11
144	1	12	13	2026-06-24 15:52:32.406288	12
155	1	14	2	2026-06-29 09:45:53.9335	13
154	1	1	5	2026-06-29 09:44:56.078821	0
156	1	6	2	2026-06-29 09:45:53.934142	5
152	1	11	7	2026-06-29 09:44:08.781999	9
15	2	1	5	2026-06-23 17:39:26.833797	0
16	2	4	5	2026-06-23 10:39:26.834779	1
19	2	2	16	2026-06-23 10:42:15.950293	2
17	2	3	7	2026-06-23 17:39:47.408239	3
21	2	6	18	2026-06-23 17:43:55.008042	5
22	2	7	18	2026-06-23 17:43:55.010304	6
23	2	8	19	2026-06-23 17:44:12.477278	7
24	2	9	19	2026-06-23 17:44:12.479832	8
18	2	11	7	2026-06-23 17:39:47.411328	9
25	2	10	12	2026-06-23 17:44:33.249766	10
27	2	13	20	2026-06-23 17:44:51.830974	11
26	2	12	20	2026-06-23 17:44:51.82969	12
28	2	14	3	2026-06-23 17:45:02.954788	13
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
1	2026-06-19 10:30:43.437376+07	1	Nationalities object (1)	1	[{"added": {}}]	17	1
2	2026-06-19 10:31:16.941467+07	2	Nationalities object (2)	1	[{"added": {}}]	17	1
3	2026-06-19 10:31:48.235477+07	1	Pagodas object (1)	1	[{"added": {}}]	18	1
4	2026-06-19 10:49:08.22976+07	2	វត្តប្រជុំវង្ស	1	[{"added": {}}]	18	1
5	2026-06-19 11:04:34.002514+07	1	2026-2027	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	10	1
6	2026-06-19 14:42:18.983617+07	4	ឬស្សីស្រស់	1	[{"added": {}}]	18	1
7	2026-06-19 14:43:29.78155+07	5	វត្តកោះនរា	1	[{"added": {}}]	18	1
8	2026-06-19 14:45:17.963721+07	6	វត្តកំសាន្ត	1	[{"added": {}}]	18	1
9	2026-06-19 14:46:44.890566+07	7	វត្តកោះក្របី	1	[{"added": {}}]	18	1
10	2026-06-19 14:48:40.872127+07	8	វត្តវាលស្បូវ	1	[{"added": {}}]	18	1
11	2026-06-19 14:49:00.388102+07	2	ខ្មែរ	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	17	1
12	2026-06-19 14:49:05.559295+07	1	ខ្មែរ	3		17	1
13	2026-06-19 14:49:11.729053+07	2	ខ្មែរ	2	[]	17	1
14	2026-06-19 14:49:50.919844+07	1	សាលាពុទ្ធិក	1	[{"added": {}}]	16	1
15	2026-06-19 14:50:28.495315+07	2	សាលាបាលីចាស់	1	[{"added": {}}]	16	1
16	2026-06-19 14:50:49.493719+07	3	ហោត្រ័យ	1	[{"added": {}}]	16	1
17	2026-06-19 14:51:29.53649+07	4	លេខ២ ជាន់ក្រោយ	1	[{"added": {}}]	16	1
18	2026-06-19 14:52:21.237044+07	5	លេខ២ ជាន់លើ	1	[{"added": {}}]	16	1
19	2026-06-19 14:53:24.735726+07	6	លេខ៤	1	[{"added": {}}]	16	1
20	2026-06-19 14:54:07.352381+07	7	ធំ ជាន់ទី១	1	[{"added": {}}]	16	1
21	2026-06-19 14:54:34.783702+07	8	ធំ ជាន់ទី២	1	[{"added": {}}]	16	1
22	2026-06-19 14:55:03.754123+07	9	ធំ ជាន់ទី៣	1	[{"added": {}}]	16	1
23	2026-06-19 14:56:46.91273+07	9	ធំ ជាន់ទី៣	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	16	1
24	2026-06-19 14:56:50.744158+07	8	ធំ ជាន់ទី២	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	16	1
25	2026-06-19 14:56:54.742023+07	7	ធំ ជាន់ទី១	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	16	1
26	2026-06-19 14:56:58.074797+07	6	លេខ៤	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	16	1
27	2026-06-19 14:57:02.274417+07	5	លេខ២ ជាន់លើ	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	16	1
28	2026-06-19 14:57:08.356861+07	4	លេខ២ ជាន់ក្រោយ	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	16	1
29	2026-06-19 14:57:12.060253+07	3	ហោត្រ័យ	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	16	1
30	2026-06-19 14:57:15.206988+07	2	សាលាបាលីចាស់	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	16	1
31	2026-06-19 14:57:18.659073+07	2	សាលាបាលីចាស់	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	16	1
32	2026-06-19 14:57:21.216466+07	1	សាលាពុទ្ធិក	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	16	1
33	2026-06-19 14:57:24.82823+07	2	សាលាបាលីចាស់	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	16	1
34	2026-06-19 14:57:31.076861+07	3	ហោត្រ័យ	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	16	1
35	2026-06-19 14:59:15.154907+07	1	2026-2027	2	[{"changed": {"fields": ["\\u1780\\u17b6\\u179b\\u1794\\u179a\\u17b7\\u1785\\u17d2\\u1786\\u17c1\\u1791\\u1794\\u1784\\u17d2\\u1780\\u17be\\u178f"]}}]	10	1
36	2026-06-19 14:59:19.301127+07	1	2026-2027	2	[]	10	1
37	2026-06-19 15:04:14.551133+07	2	2027-2028	1	[{"added": {}}]	10	1
38	2026-06-19 15:05:08.597905+07	3	2028-2029	1	[{"added": {}}]	10	1
39	2026-06-19 15:05:16.018703+07	1	2026-2027	2	[]	10	1
40	2026-06-19 15:16:18.011823+07	2	ចិន្ដា តុប	1	[{"added": {}}]	45	1
41	2026-06-19 15:17:28.138588+07	3	គាត សែ	1	[{"added": {}}]	45	1
42	2026-06-19 15:18:32.720679+07	4	មករា រឹម	1	[{"added": {}}]	45	1
43	2026-06-19 15:20:25.380282+07	1	ថ្នាក់ទី ១(ក)	1	[{"added": {}}]	11	1
44	2026-06-19 15:20:53.106959+07	2	ថ្នាក់ទី ១(ខ)	1	[{"added": {}}]	11	1
45	2026-06-19 15:21:21.661137+07	3	ថ្នាក់ទី ២(ក)	1	[{"added": {}}]	11	1
46	2026-06-19 15:21:25.759183+07	2	ថ្នាក់ទី ១(ខ)	2	[{"changed": {"fields": ["\\u1794\\u1793\\u17d2\\u1791\\u1794\\u17cb"]}}]	11	1
47	2026-06-19 15:21:29.382844+07	1	ថ្នាក់ទី ១(ក)	2	[{"changed": {"fields": ["\\u1794\\u1793\\u17d2\\u1791\\u1794\\u17cb"]}}]	11	1
48	2026-06-19 15:21:51.791914+07	4	ថ្នាក់ទី ២(ខ)	1	[{"added": {}}]	11	1
49	2026-06-19 15:21:57.534978+07	4	ថ្នាក់ទី ២(ខ)	2	[]	11	1
50	2026-06-19 15:22:45.284429+07	5	ថ្នាក់ទី ៣	1	[{"added": {}}]	11	1
51	2026-06-19 15:22:52.617898+07	4	ថ្នាក់ទី ២(ខ)	2	[{"changed": {"fields": ["\\u1780\\u1798\\u17d2\\u179a\\u17b7\\u178f\\u1790\\u17d2\\u1793\\u17b6\\u1780\\u17cb"]}}]	11	1
52	2026-06-19 15:22:57.162738+07	3	ថ្នាក់ទី ២(ក)	2	[{"changed": {"fields": ["\\u1780\\u1798\\u17d2\\u179a\\u17b7\\u178f\\u1790\\u17d2\\u1793\\u17b6\\u1780\\u17cb"]}}]	11	1
53	2026-06-19 15:23:02.044318+07	2	ថ្នាក់ទី ១(ខ)	2	[{"changed": {"fields": ["\\u1780\\u1798\\u17d2\\u179a\\u17b7\\u178f\\u1790\\u17d2\\u1793\\u17b6\\u1780\\u17cb"]}}]	11	1
54	2026-06-19 15:23:08.114101+07	1	ថ្នាក់ទី ១(ក)	2	[{"changed": {"fields": ["\\u1780\\u1798\\u17d2\\u179a\\u17b7\\u178f\\u1790\\u17d2\\u1793\\u17b6\\u1780\\u17cb"]}}]	11	1
55	2026-06-19 17:22:21.686757+07	1	admin	2	[{"changed": {"fields": ["\\u1782\\u17d2\\u179a\\u17bc"]}}]	46	1
56	2026-06-19 18:28:17.171763+07	14	សីលធម៌	2	[{"changed": {"fields": ["\\u1785\\u17c6\\u1793\\u17bd\\u1793\\u1798\\u17c9\\u17c4\\u1784\\u179f\\u179a\\u17bb\\u1794"]}}]	24	1
57	2026-06-19 18:28:31.583393+07	13	ប្រវត្តិវិទ្យា	2	[{"changed": {"fields": ["\\u1785\\u17c6\\u1793\\u17bd\\u1793\\u1798\\u17c9\\u17c4\\u1784\\u179f\\u179a\\u17bb\\u1794"]}}]	24	1
58	2026-06-19 18:28:35.323657+07	12	ភូមិវិទ្យា	2	[{"changed": {"fields": ["\\u1785\\u17c6\\u1793\\u17bd\\u1793\\u1798\\u17c9\\u17c4\\u1784\\u179f\\u179a\\u17bb\\u1794"]}}]	24	1
59	2026-06-19 18:28:55.635891+07	11	ផែនដីវិទ្យា	2	[{"changed": {"fields": ["\\u1785\\u17c6\\u1793\\u17bd\\u1793\\u1798\\u17c9\\u17c4\\u1784\\u179f\\u179a\\u17bb\\u1794"]}}]	24	1
60	2026-06-19 18:29:00.051867+07	10	ជីវវិទ្យា	2	[{"changed": {"fields": ["\\u1785\\u17c6\\u1793\\u17bd\\u1793\\u1798\\u17c9\\u17c4\\u1784\\u179f\\u179a\\u17bb\\u1794"]}}]	24	1
61	2026-06-19 18:29:06.491371+07	10	ជីវវិទ្យា	2	[]	24	1
62	2026-06-19 18:29:30.604232+07	9	គីមីវិទ្យា	2	[{"changed": {"fields": ["\\u1785\\u17c6\\u1793\\u17bd\\u1793\\u1798\\u17c9\\u17c4\\u1784\\u179f\\u179a\\u17bb\\u1794"]}}]	24	1
63	2026-06-19 18:29:37.258266+07	8	រូបវិទ្យា	2	[{"changed": {"fields": ["\\u1785\\u17c6\\u1793\\u17bd\\u1793\\u1798\\u17c9\\u17c4\\u1784\\u179f\\u179a\\u17bb\\u1794"]}}]	24	1
64	2026-06-19 18:29:47.89117+07	7	គណិតវិទ្យា	2	[{"changed": {"fields": ["\\u1785\\u17c6\\u1793\\u17bd\\u1793\\u1798\\u17c9\\u17c4\\u1784\\u179f\\u179a\\u17bb\\u1794"]}}]	24	1
65	2026-06-19 18:29:53.070087+07	6	ភាសាអង់គ្លេស	2	[{"changed": {"fields": ["\\u1785\\u17c6\\u1793\\u17bd\\u1793\\u1798\\u17c9\\u17c4\\u1784\\u179f\\u179a\\u17bb\\u1794"]}}]	24	1
66	2026-06-19 18:30:07.167286+07	5	ភាសាខ្មែរ	2	[{"changed": {"fields": ["\\u1785\\u17c6\\u1793\\u17bd\\u1793\\u1798\\u17c9\\u17c4\\u1784\\u179f\\u179a\\u17bb\\u1794"]}}]	24	1
67	2026-06-19 18:30:12.312733+07	3	ព្រះអភិធម្ម	2	[{"changed": {"fields": ["\\u1785\\u17c6\\u1793\\u17bd\\u1793\\u1798\\u17c9\\u17c4\\u1784\\u179f\\u179a\\u17bb\\u1794"]}}]	24	1
68	2026-06-19 18:30:34.359063+07	2	ព្រះវិន័យ	2	[{"changed": {"fields": ["\\u1785\\u17c6\\u1793\\u17bd\\u1793\\u1798\\u17c9\\u17c4\\u1784\\u179f\\u179a\\u17bb\\u1794"]}}]	24	1
69	2026-06-19 18:30:44.400587+07	1	ភាសាបាលី	2	[{"changed": {"fields": ["\\u1785\\u17c6\\u1793\\u17bd\\u1793\\u1798\\u17c9\\u17c4\\u1784\\u179f\\u179a\\u17bb\\u1794"]}}]	24	1
70	2026-06-19 18:31:46.601218+07	15	សំស្រ្កឹត	1	[{"added": {}}]	24	1
71	2026-06-19 18:32:02.990559+07	4	ភាសាសំស្រ្កឹត	2	[{"changed": {"fields": ["\\u1785\\u17c6\\u1793\\u17bd\\u1793\\u1798\\u17c9\\u17c4\\u1784\\u179f\\u179a\\u17bb\\u1794"]}}]	24	1
72	2026-06-19 18:32:08.820197+07	15	សំស្រ្កឹត	3		24	1
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2026-06-19 09:25:25.117855+07
6	contenttypes	0002_remove_content_type_name	2026-06-19 09:25:25.237079+07
22	sessions	0001_initial	2026-06-19 09:25:25.400071+07
23	core	0001_initial	2026-06-19 09:36:08.419519+07
24	students	0001_initial	2026-06-19 09:36:08.441398+07
25	users	0001_initial	2026-06-19 09:36:08.499102+07
26	attendance	0001_initial	2026-06-19 09:36:08.508687+07
27	attendance	0002_initial	2026-06-19 09:36:08.737069+07
28	core	0002_initial	2026-06-19 09:36:09.567256+07
29	permissions	0001_initial	2026-06-19 09:36:09.582373+07
30	permissions	0002_initial	2026-06-19 09:36:10.145893+07
31	scores	0001_initial	2026-06-19 09:36:10.190091+07
32	scores	0002_initial	2026-06-19 09:36:10.51478+07
33	students	0002_initial	2026-06-19 09:36:11.50677+07
34	admin	0001_initial	2026-06-19 09:54:20.393461+07
35	admin	0002_logentry_remove_auto_add	2026-06-19 09:54:20.412065+07
36	admin	0003_logentry_add_action_flag_choices	2026-06-19 09:54:20.430433+07
37	auth	0001_initial	2026-06-19 09:54:20.611277+07
38	auth	0002_alter_permission_name_max_length	2026-06-19 09:54:20.659027+07
39	auth	0003_alter_user_email_max_length	2026-06-19 09:54:20.668742+07
40	auth	0004_alter_user_username_opts	2026-06-19 09:54:20.677737+07
41	auth	0005_alter_user_last_login_null	2026-06-19 09:54:20.686135+07
42	auth	0006_require_contenttypes_0002	2026-06-19 09:54:20.6893+07
43	auth	0007_alter_validators_add_error_messages	2026-06-19 09:54:20.69757+07
44	auth	0008_alter_user_username_max_length	2026-06-19 09:54:20.705992+07
45	auth	0009_alter_user_last_name_max_length	2026-06-19 09:54:20.714631+07
46	auth	0010_alter_group_name_max_length	2026-06-19 09:54:20.763665+07
47	auth	0011_update_proxy_permissions	2026-06-19 09:54:20.811432+07
48	auth	0012_alter_user_first_name_max_length	2026-06-19 09:54:20.819702+07
49	authtoken	0001_initial	2026-06-19 09:54:20.870878+07
50	authtoken	0002_auto_20160226_1747	2026-06-19 09:54:20.966486+07
51	authtoken	0003_tokenproxy	2026-06-19 09:54:20.970762+07
52	authtoken	0004_alter_tokenproxy_options	2026-06-19 09:54:20.976999+07
53	users	0002_alter_users_id_alter_users_is_active	2026-06-19 09:54:45.827382+07
54	attendance	0003_alter_attendance_options_alter_notifications_options_and_more	2026-06-19 10:22:24.332133+07
55	core	0003_alter_academicperiods_options_and_more	2026-06-19 10:22:24.545574+07
56	permissions	0003_alter_permissionactions_options_and_more	2026-06-19 10:22:24.613399+07
57	scores	0003_alter_finalscores_options_alter_scores_options	2026-06-19 10:22:24.652349+07
58	students	0003_alter_awards_options_alter_classmonitors_options_and_more	2026-06-19 10:22:24.806162+07
59	users	0003_alter_activitylogs_options_alter_positions_options_and_more	2026-06-19 10:22:24.95196+07
60	attendance	0004_alter_attendance_academic_year_and_more	2026-06-19 10:29:06.815411+07
61	core	0004_alter_academicyears_created_at_and_more	2026-06-19 10:29:07.108744+07
62	students	0004_alter_enrollments_academic_year_and_more	2026-06-19 10:29:08.01232+07
63	scores	0004_alter_finalscores_attendance_score_and_more	2026-06-19 10:29:08.556223+07
64	users	0004_alter_teachers_created_at_alter_teachers_first_name_and_more	2026-06-19 10:29:09.117827+07
65	core	0005_alter_pagodas_commune_alter_pagodas_district_and_more	2026-06-19 14:08:17.923164+07
66	students	0005_alter_students_image_url	2026-06-19 14:08:17.964608+07
67	users	0005_alter_teachers_image_url	2026-06-19 14:08:17.989955+07
68	core	0006_geo_hierarchy_fk	2026-06-19 14:13:14.288188+07
69	core	0007_pagoda_khmer_labels	2026-06-19 14:18:33.423113+07
70	core	0008_kuti_khmer_labels	2026-06-19 14:29:55.850743+07
71	core	0009_alter_academicperiods_academic_year_and_more	2026-06-19 15:01:34.782173+07
72	students	0006_alter_awards_academic_year_alter_awards_award_type_and_more	2026-06-19 15:01:36.193487+07
73	attendance	0005_alter_notifications_created_at_and_more	2026-06-19 15:08:53.763446+07
74	students	0007_alter_studentpayyear_academic_year_and_more	2026-06-19 15:08:54.117889+07
75	users	0006_alter_activitylogs_action_and_more	2026-06-19 15:08:54.775291+07
76	permissions	0004_alter_permissionactions_action_code_and_more	2026-06-19 15:10:58.309844+07
77	users	0007_alter_teachers_gender	2026-06-19 15:10:58.32933+07
78	permissions	0005_alter_permissiongroupmembers_created_at_and_more	2026-06-19 15:11:32.848115+07
79	users	0008_alter_teachers_monk_status_alter_teachers_status	2026-06-19 15:11:32.882419+07
80	permissions	0006_alter_permissionresources_created_at_and_more	2026-06-19 15:13:03.151356+07
81	users	0009_alter_teachers_monk_status_alter_teachers_status	2026-06-19 15:13:03.20467+07
82	permissions	0007_khmer_labels_all	2026-06-19 15:15:31.449701+07
83	users	0010_alter_teachers_monk_status_alter_teachers_status	2026-06-19 15:15:54.466884+07
84	users	0011_users_id_label	2026-06-19 15:26:45.755356+07
85	core	0010_alter_subjects_subject_code	2026-06-19 15:28:03.908888+07
118	students	0008_remove_pendingstudents_pagoda_name_and_more	2026-06-19 22:48:14.673058+07
119	students	0009_registrationsession	2026-06-19 23:13:59.773664+07
120	core	0011_educationlevels	2026-06-20 15:08:56.289948+07
121	students	0010_alter_students_education_level	2026-06-20 15:08:56.371269+07
122	students	0011_pendingstudents_image_url_and_more	2026-06-20 22:07:02.311876+07
123	core	0012_alter_classrooms_created_at	2026-06-22 16:39:20.393423+07
124	users	0012_pendingteachers	2026-06-22 22:36:06.574524+07
125	users	0013_teacherregistrationsession	2026-06-22 22:50:48.323654+07
126	students	0012_alter_students_created_at	2026-06-23 11:59:40.403324+07
127	core	0013_alter_classsubjects_options_classsubjects_order	2026-06-25 08:36:46.362724+07
128	core	0014_classrooms_desks_per_row	2026-06-25 17:39:58.64074+07
129	students	0013_enrollments_desk_number	2026-06-25 17:39:59.941133+07
130	students	0014_multiplepermission_dropoutstudent	2026-06-27 19:45:19.770944+07
131	attendance	0006_alter_attendance_created_at_and_more	2026-06-28 07:36:42.103994+07
132	core	0015_payrollrecords	2026-06-28 16:52:43.076762+07
133	core	0016_payrollrates_academic_period	2026-06-29 09:52:44.179471+07
134	core	0017_payrollrates_note	2026-06-29 17:37:56.739954+07
135	attendance	0007_attendance_late_time	2026-07-07 08:30:54.673934+07
136	attendance	0008_attendancewarning	2026-07-07 18:28:30.604263+07
137	core	0018_monthlypayrolls_payrollrates_and_more	2026-07-07 20:07:00.10404+07
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
g2h4msagrx01xuj5h94gt971yy9a3g89	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waPZr:1-i3c8UrR4sYIDYKFJ1Xi9fPlf-GFEA0Z_cbVxT7WvE	2026-07-03 10:07:31.333764+07
05dpsqrusd31yiexj8gebfydmhhe0n7z	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waPb1:u-Ba7krM8gbAbrOJUUJjQW_R5m8JVOGGJsvMURdfFk8	2026-07-03 10:08:43.073792+07
3i3wdq3gk2zkex37v63kk4m6exkne1dk	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waPcs:DBPlw09fi1yV_CiwxANDM7VZXacVWgtNqoScEsth0O4	2026-07-03 10:10:38.729095+07
l8evttm9czun7xm2q762f0gqgo8yj13d	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waPd0:vGOqTC8VaMTUB9MKdevuc-QCKBgWPjBho_0HmLvWNTM	2026-07-03 10:10:46.646907+07
srfnwg5wur6uvy98igxbv35hxmzevzya	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waPqt:B9yf8Q-DO3AbIVno4u9ZFjQSMf_Oc_UGQDIy1uyHXhI	2026-07-03 10:25:07.591328+07
lixangxp8z3ytqerm9kijfc1i9pzsjhw	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waPuz:1T5FaUEO562PG2IeBCS6NPU9gLiH_b0EeYbSOjx9pds	2026-07-03 10:29:21.408504+07
me796ikwtohhn6pomrdwiwnkkzu87d87	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waPvC:yUrjDfjaprmstvDkm4CEgCD4LdcCk9qt9L5kxU7MDWU	2026-07-03 10:29:34.055387+07
yks19b7qoh5fe03tkqa707k606oosism	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waPzk:d38aSLCoRSZ5cy-yIyhplHbLWwXnF4zILbvmt5Rcxy8	2026-07-03 10:34:16.442676+07
xlexziuf10mwxr2jnvbnxq4vgvtn5bat	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waQF9:h4_836e6kf3vDdN1_OvKBMXwfRK3pScnw_pYhXTriF0	2026-07-03 10:50:11.692864+07
ugs33pw3ur2m19sfsnx68tne7wdhbpv7	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waQWW:VMYNZcng8HmxbER-I50h2D4zObIabcm6JvGstLNomPQ	2026-07-03 11:08:08.925443+07
9198bfv0j1jcl3upfscm03u3npibl7o9	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waQWg:0NF5Qc7yfgx858AyOnHqwTy4ecEfb3Vq4qj72QIQAxo	2026-07-03 11:08:18.878058+07
y54d1d368c7ld0rnv4aor0o8j7rabj0f	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waTBy:aJKLxcDCzHNxj3HKQiOsW70tcpuYs4Dz9FGSwQ9KSTs	2026-07-03 13:59:06.726872+07
e3e64gjbna5huhq672vh5btuijtmxetf	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waTTG:whQPCeNqOG1V1hIuMIXt0jHVU-F-Z1qhrAe6ZwgWLJI	2026-07-03 14:16:58.702089+07
km98yf2t21icc2nhzj7lk95kwz29eyzz	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waTTS:c17U6Unpqy_GAzeir8hms-cAkTNwtX9nuHxltFoIVhk	2026-07-03 14:17:10.414321+07
vqbj1gu1vd1v9m156a2bqtwuljjoymq9	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waTTf:-S-61iLStjDPQinU-ADZzbfhszlrwaR7oLTcMk2NMR4	2026-07-03 14:17:23.426026+07
ek05jltxojp4fcrb33dzjbpw034x2c3l	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waTV3:tLuZLN7xDiuBzYAH9lsIf91p_WClbVWIwXUTXR_rsG8	2026-07-03 14:18:49.555892+07
mkmx9qoumfqpcw2frxfwil1qsoz3rrrg	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waTfz:3G6VxBeJelOId44HXKpswNbPHIMh6SE5M_S00SCt4Tk	2026-07-03 14:30:07.379999+07
cyej0nvuduvhk5yf7dekk5abmxdu2ner	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waUST:dFuqRVNQfBHmhvnHoxl2KofPeoXPzYaKgE_t03Y1DIs	2026-07-03 15:20:13.323135+07
tri3cuesontzctv68dpp56waeayuptbf	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waUZb:lCEHhBhCAfrZn4BSEzxrW9vl64btf61Jce4Ru0qytSg	2026-07-03 15:27:35.901878+07
84osjd5ibnb2oyvzsukqcj677faj5pjk	.eJyrVopPLC3JiC8tTi2Kz0xRslIyVNJBFktKTM5OzQNJpGQl5qXn6yXn55UUZSbpgZToQWWL9XzzU1JznKBqUQzISCzOAOpWqgUAGNEmTQ:1waUbg:kU0B2xhPFvO4DbcEAt83KimvRs68un0YUZ0Lm47ljKc	2026-07-03 15:29:44.186861+07
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, title, doc_category, file_url, description, uploaded_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: dropout; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.dropout (id, reason, status, created_at, student_id) FROM stdin;
56	ត្រឡប់មកវិញ	f	2026-07-07 09:01:02.488706+07	115
57	សឹក	t	2026-07-07 09:01:31.090331+07	141
58	សឹក	t	2026-07-07 09:01:48.62888+07	144
\.


--
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (id, student_id, classroom_id, academic_year_id, enrollment_date, created_at, desk_number) FROM stdin;
149	97	2	1	2026-06-26	\N	7
150	98	2	1	2026-06-26	\N	7
166	114	2	1	2026-06-26	\N	6
148	96	2	1	2026-06-26	\N	6
138	86	2	1	2026-06-26	\N	1
139	87	2	1	2026-06-26	\N	1
140	88	2	1	2026-06-26	\N	2
143	91	2	1	2026-06-26	\N	3
144	92	2	1	2026-06-26	\N	4
145	93	2	1	2026-06-26	\N	4
146	94	2	1	2026-06-26	\N	5
147	95	2	1	2026-06-26	\N	5
151	99	2	1	2026-06-26	\N	8
152	100	2	1	2026-06-26	\N	8
153	101	2	1	2026-06-26	\N	9
154	102	2	1	2026-06-26	\N	9
155	103	2	1	2026-06-26	\N	10
156	104	2	1	2026-06-26	\N	10
157	105	2	1	2026-06-26	\N	11
158	106	2	1	2026-06-26	\N	11
159	107	2	1	2026-06-26	\N	12
160	108	2	1	2026-06-26	\N	12
161	109	2	1	2026-06-26	\N	13
162	110	2	1	2026-06-26	\N	13
141	89	2	1	2026-06-26	\N	2
142	90	2	1	2026-06-26	\N	3
110	116	1	1	2026-06-26	\N	1
109	115	1	1	2026-06-15	\N	1
137	145	1	1	2026-06-26	\N	2
119	126	1	1	2026-06-26	\N	2
111	117	1	1	2026-06-26	\N	3
117	123	1	1	2026-06-26	\N	3
112	118	1	1	2026-06-26	\N	4
113	119	1	1	2026-06-26	\N	4
114	120	1	1	2026-06-26	\N	5
115	121	1	1	2026-06-26	\N	5
116	122	1	1	2026-06-26	\N	6
118	124	1	1	2026-06-26	\N	6
120	127	1	1	2026-06-26	\N	7
121	128	1	1	2026-06-26	\N	7
122	129	1	1	2026-06-26	\N	8
127	140	1	1	2026-06-26	\N	8
123	130	1	1	2026-06-26	\N	9
136	131	1	1	2026-06-26	\N	9
135	132	1	1	2026-06-26	\N	10
163	111	2	1	2026-06-26	\N	14
164	112	2	1	2026-06-26	\N	14
165	113	2	1	2026-06-26	\N	15
134	133	1	1	2026-06-26	\N	10
133	134	1	1	2026-06-26	\N	11
131	135	1	1	2026-06-26	\N	11
132	136	1	1	2026-06-26	\N	12
129	138	1	1	2026-06-26	\N	12
128	139	1	1	2026-06-26	\N	13
125	142	1	1	2026-06-26	\N	14
124	143	1	1	2026-06-26	\N	14
126	141	1	1	2026-06-26	\N	\N
130	144	1	1	2026-06-26	\N	\N
\.


--
-- Data for Name: final_scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.final_scores (id, student_id, subject_id, period_id, attendance_score, homework_score, exercise_score, exam_score, created_at) FROM stdin;
\.


--
-- Data for Name: monk_permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.monk_permission (id, monk_id, reason, start_date, end_date, status, reviewed_by, reviewed_by_monitor, reviewed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: monk_permission_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.monk_permission_logs (id, permission_id, action, old_status, new_status, performed_by, performed_by_monitor, note, created_at) FROM stdin;
\.


--
-- Data for Name: monthly_payrolls; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.monthly_payrolls (id, teacher_id, subject_id, academic_period_id, total_hours, total_teaching, rate_per_hour, created_at, updated_at) FROM stdin;
1	3	13	54	40.00	20.00	20.00	2026-06-28 17:41:43.078871+07	2026-06-28 17:41:51.100512+07
2	4	12	54	35.00	18.00	18.00	2026-06-28 17:41:59.293944+07	2026-06-28 17:41:59.293944+07
3	5	11	54	50.00	25.00	12.00	2026-06-28 17:41:59.358141+07	2026-06-28 17:41:59.358141+07
4	6	10	54	45.00	22.00	16.00	2026-06-28 17:41:59.418358+07	2026-06-28 17:41:59.418358+07
\.


--
-- Data for Name: multiple_permission; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.multiple_permission (id, reason, start_date, end_date, reminder_sent, created_at, student_id) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, student_id, type, title, message, related_id, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: paper_headers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paper_headers (id, name, doc_type, header_html, footer_html, logo_url, is_default, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: pay_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pay_rates (id, subject_id, rate_per_hour, currency, is_active, effective_from, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payroll_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payroll_rates (id, class_subject_id, total_teaching, rate_per_hour, created_at, updated_at, academic_period_id, note) FROM stdin;
1	15	10.00	5000.00	2026-06-28 23:52:03.419904+07	2026-06-28 23:52:03.420224+07	\N	\N
4	17	3.00	10000.00	2026-06-29 10:10:37.927919+07	2026-06-30 18:18:05.503915+07	54	\N
16	18	4.00	10000.00	2026-06-29 10:10:38.128969+07	2026-06-30 18:18:05.55221+07	54	\N
13	23	4.00	10000.00	2026-06-29 10:10:38.070043+07	2026-06-30 18:18:05.59885+07	54	\N
15	24	6.00	10000.00	2026-06-29 10:10:38.108655+07	2026-06-30 18:18:05.642935+07	54	\N
19	27	6.00	10000.00	2026-06-29 10:10:38.176863+07	2026-06-30 18:18:05.684461+07	54	\N
22	26	4.00	10000.00	2026-06-29 10:10:38.245813+07	2026-06-30 18:18:05.719372+07	54	\N
8	21	10.00	10000.00	2026-06-29 10:10:37.964706+07	2026-06-30 18:18:05.752529+07	54	\N
7	22	21.00	10000.00	2026-06-29 10:10:37.963372+07	2026-06-30 18:18:05.786313+07	54	\N
2	19	4.00	10000.00	2026-06-29 10:10:37.926729+07	2026-06-30 18:18:05.822901+07	54	\N
18	25	4.00	10000.00	2026-06-29 10:10:38.169807+07	2026-06-30 18:18:05.858288+07	54	\N
36	157	12.00	10000.00	2026-06-29 17:23:01.319785+07	2026-06-30 18:18:05.891155+07	54	\N
23	28	4.00	10000.00	2026-06-29 10:10:38.25408+07	2026-06-30 18:18:05.923068+07	54	\N
31	151	6.00	10000.00	2026-06-29 17:06:31.382371+07	2026-06-30 18:25:03.167347+07	54	\N
32	152	4.00	10000.00	2026-06-29 17:06:31.386464+07	2026-06-30 18:25:03.217173+07	54	\N
21	143	5.00	10000.00	2026-06-29 10:10:38.208965+07	2026-06-30 18:25:03.264686+07	54	\N
24	144	5.00	10000.00	2026-06-29 10:10:38.266647+07	2026-06-30 18:25:03.311641+07	54	\N
29	156	4.00	10000.00	2026-06-29 17:06:31.356945+07	2026-06-30 18:25:03.350136+07	54	\N
30	155	3.00	10000.00	2026-06-29 17:06:31.360623+07	2026-06-30 18:25:03.382209+07	54	\N
9	139	7.00	10000.00	2026-06-29 10:10:38.029094+07	2026-06-30 18:25:03.413399+07	54	\N
14	140	3.00	10000.00	2026-06-29 10:10:38.098454+07	2026-06-30 18:25:03.444785+07	54	\N
20	142	4.00	10000.00	2026-06-29 10:10:38.200276+07	2026-06-30 18:25:03.475773+07	54	\N
10	138	18.00	10000.00	2026-06-29 10:10:38.036727+07	2026-06-30 18:25:03.507646+07	54	\N
3	134	6.00	0.00	2026-06-29 10:10:37.923601+07	2026-06-30 18:26:28.500865+07	54	គ្រូក្របខណ្ឌ
12	136	14.00	0.00	2026-06-29 10:10:38.066739+07	2026-06-30 18:26:42.037858+07	54	គ្រូក្របខណ្ឌ
27	15	32.00	15000.00	2026-06-29 10:11:01.686288+07	2026-06-30 18:35:10.016164+07	54	
35	154	32.00	15000.00	2026-06-29 17:06:43.35773+07	2026-06-30 18:35:18.934361+07	54	
33	153	10.00	15000.00	2026-06-29 17:06:43.342109+07	2026-06-30 18:35:48.456026+07	54	
34	16	14.00	15000.00	2026-06-29 17:06:43.345346+07	2026-06-30 18:36:03.341403+07	54	
\.


--
-- Data for Name: pending_students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pending_students (id, first_name, last_name, gender, date_of_birth, phone, address, note, status, reviewed_by, reviewed_at, created_at, birth_pagoda_id, birth_village_code, chaya_name, chaya_no, current_pagoda_id, education_level, kuti_id, latin_name, monk_status, nationality_id, ordination_date, preceptor_name, sanghatika_no, tracking_code, image_url, new_birth_pagoda_name, new_current_pagoda_name, new_kuti_name, new_nationality_name) FROM stdin;
52	ចិន្ដា	តុប	\N	\N	0968217022	\N	\N	draft	\N	\N	2026-06-23 09:06:27.199889	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	80QMZ7		\N	\N	\N	\N
\.


--
-- Data for Name: pending_teachers; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.pending_teachers (id, tracking_code, image_url, first_name, last_name, latin_name, gender, monk_status, phone, start_date, note, status, reviewed_at, created_at, reviewed_by) FROM stdin;
\.


--
-- Data for Name: permission_actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permission_actions (id, action_code, action_name, description, action_level, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: permission_resources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permission_resources (id, resource_code, resource_name, description, resource_type, icon, display_order, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, resource_id, action_id, permission_name, description, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: permission_audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permission_audit_logs (id, user_id, action_type, resource_id, action_id, permission_id, target_user_id, target_role, old_value, new_value, reason, ip_address, is_success, created_at) FROM stdin;
\.


--
-- Data for Name: permission_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permission_groups (id, group_code, group_name, description, group_type, icon, display_order, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: permission_group_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permission_group_members (id, group_id, permission_id, created_at) FROM stdin;
\.


--
-- Data for Name: positions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.positions (id, title, parent_id, description, created_at) FROM stdin;
\.


--
-- Data for Name: registration_sessions; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.registration_sessions (id, title, start_date, end_date, is_active, created_at) FROM stdin;
1	បំពេញព័ត៌មាន	2026-06-19	2026-06-20	f	2026-06-19 23:27:20.462799+07
2	test	2026-06-20	2026-06-20	t	2026-06-20 07:26:46.344923+07
3	ចុះឈ្មោះចូររៀនន	2026-06-21	2026-06-21	f	2026-06-21 07:18:59.162882+07
4	ចុះឈ្មោះ	2026-06-23	2026-06-23	f	2026-06-23 15:25:19.517288+07
5	test	2026-06-23	2026-06-23	t	2026-06-23 15:53:57.53412+07
\.


--
-- Data for Name: report_daily; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.report_daily (id, report_date, title, content, reported_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: resource_access_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resource_access_policies (id, resource_id, policy_name, policy_type, default_access, require_approval, approval_role, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (id, role, permission_id, granted_at, granted_by, notes, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: time_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.time_slots (id, session, slot_no, start_time, end_time) FROM stdin;
1	morning	1	07:00:00	07:55:00
2	morning	2	08:00:00	09:00:00
3	afternoon	1	14:00:00	14:55:00
4	afternoon	2	15:00:00	15:55:00
5	afternoon	3	16:00:00	17:00:00
\.


--
-- Data for Name: schedule_substitutions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedule_substitutions (id, classroom_id, change_date, time_slot_id, original_subject_id, new_subject_id, new_teacher_id, reason, created_by, created_at, original_teacher_id, status) FROM stdin;
6	1	2026-07-01	5	14	7	9		\N	\N	\N	pending
7	1	2026-07-03	1	13	7	9		\N	\N	\N	pending
9	1	2026-07-03	3	8	14	2		\N	\N	\N	pending
13	1	2026-07-08	2	5	1	5	\N	\N	\N	\N	pending
20	1	2026-07-03	2	12	13	13	\N	\N	\N	\N	pending
\.


--
-- Data for Name: school_calendar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.school_calendar (id, title, event_type, start_date, end_date, description, classroom_id, location, organizer_id, is_recurring, recurring_type, color_code, notify_days, is_public, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scores (id, student_id, subject_id, period_id, score_type, raw_score, exam_date, created_at) FROM stdin;
\.


--
-- Data for Name: staff_positions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.staff_positions (id, teacher_id, position_id, start_date, end_date, created_at) FROM stdin;
\.


--
-- Data for Name: student_education; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_education (id, student_id, level, institution, start_year, end_year, note, created_at) FROM stdin;
\.


--
-- Data for Name: student_pay_year; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_pay_year (id, student_id, academic_year_id, amount_due, amount_paid, payment_date, status, note, recorded_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: teacher_education; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_education (id, teacher_id, degree, field, institution, education_type, start_year, end_year, is_completed, note, created_at) FROM stdin;
\.


--
-- Data for Name: teacher_registration_sessions; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.teacher_registration_sessions (id, title, start_date, end_date, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: teacher_salaries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_salaries (id, teacher_id, subject_id, academic_year_id, period_label, total_hours, rate_per_hour, calculated_at) FROM stdin;
\.


--
-- Data for Name: teaching_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teaching_sessions (id, teacher_id, subject_id, classroom_id, session_date, time_slot_id, is_substitute, substitution_id, created_at) FROM stdin;
\.


--
-- Data for Name: timetable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.timetable (id, classroom_id, subject_id, academic_year_id, day_no, time_slot_id, created_at) FROM stdin;
2	1	7	1	1	2	2026-06-19 18:25:25.501975
3	1	8	1	1	3	2026-06-19 18:25:25.501975
4	1	1	1	1	4	2026-06-19 18:25:25.501975
5	1	1	1	1	5	2026-06-19 18:25:25.501975
6	1	5	1	2	1	2026-06-19 18:25:25.501975
7	1	5	1	2	2	2026-06-19 18:25:25.501975
8	1	7	1	2	3	2026-06-19 18:25:25.501975
9	1	7	1	2	4	2026-06-19 18:25:25.501975
10	1	14	1	2	5	2026-06-19 18:25:25.501975
11	1	2	1	3	1	2026-06-19 18:25:25.501975
12	1	2	1	3	2	2026-06-19 18:25:25.501975
13	1	7	1	3	3	2026-06-19 18:25:25.501975
14	1	7	1	3	4	2026-06-19 18:25:25.501975
15	1	14	1	3	5	2026-06-19 18:25:25.501975
16	1	13	1	4	1	2026-06-19 18:25:25.501975
17	1	12	1	4	2	2026-06-19 18:25:25.501975
18	1	8	1	4	3	2026-06-19 18:25:25.501975
19	1	4	1	4	4	2026-06-19 18:25:25.501975
20	1	4	1	4	5	2026-06-19 18:25:25.501975
21	1	5	1	5	1	2026-06-19 18:25:25.501975
22	1	5	1	5	2	2026-06-19 18:25:25.501975
23	1	3	1	5	3	2026-06-19 18:25:25.501975
24	1	3	1	5	4	2026-06-19 18:25:25.501975
25	1	3	1	5	5	2026-06-19 18:25:25.501975
26	1	1	1	6	1	2026-06-19 18:25:25.501975
27	1	1	1	6	2	2026-06-19 18:25:25.501975
28	1	1	1	6	3	2026-06-19 18:25:25.501975
29	1	1	1	6	4	2026-06-19 18:25:25.501975
30	1	1	1	6	5	2026-06-19 18:25:25.501975
31	1	4	1	7	1	2026-06-19 18:25:25.501975
32	1	4	1	7	2	2026-06-19 18:25:25.501975
33	1	9	1	7	3	2026-06-19 18:25:25.501975
34	1	1	1	7	4	2026-06-19 18:25:25.501975
35	1	1	1	7	5	2026-06-19 18:25:25.501975
36	1	5	1	9	1	2026-06-19 18:25:25.501975
37	1	5	1	9	2	2026-06-19 18:25:25.501975
38	1	8	1	9	3	2026-06-19 18:25:25.501975
39	1	11	1	9	4	2026-06-19 18:25:25.501975
40	1	11	1	9	5	2026-06-19 18:25:25.501975
41	1	5	1	10	1	2026-06-19 18:25:25.501975
42	1	5	1	10	2	2026-06-19 18:25:25.501975
43	1	1	1	10	3	2026-06-19 18:25:25.501975
44	1	1	1	10	4	2026-06-19 18:25:25.501975
45	1	1	1	10	5	2026-06-19 18:25:25.501975
46	1	7	1	11	1	2026-06-19 18:25:25.501975
47	1	7	1	11	2	2026-06-19 18:25:25.501975
48	1	9	1	11	3	2026-06-19 18:25:25.501975
49	1	6	1	11	4	2026-06-19 18:25:25.501975
50	1	6	1	11	5	2026-06-19 18:25:25.501975
51	1	12	1	12	1	2026-06-19 18:25:25.501975
52	1	13	1	12	2	2026-06-19 18:25:25.501975
53	1	9	1	12	3	2026-06-19 18:25:25.501975
54	1	10	1	12	4	2026-06-19 18:25:25.501975
55	1	10	1	12	5	2026-06-19 18:25:25.501975
56	1	7	1	13	1	2026-06-19 18:25:25.501975
57	1	7	1	13	2	2026-06-19 18:25:25.501975
58	1	1	1	13	3	2026-06-19 18:25:25.501975
59	1	4	1	13	4	2026-06-19 18:25:25.501975
60	1	4	1	13	5	2026-06-19 18:25:25.501975
61	1	2	1	14	1	2026-06-19 18:25:25.501975
62	1	2	1	14	2	2026-06-19 18:25:25.501975
63	1	1	1	14	3	2026-06-19 18:25:25.501975
64	1	1	1	14	4	2026-06-19 18:25:25.501975
65	1	1	1	14	5	2026-06-19 18:25:25.501975
69	5	11	3	1	1	\N
70	5	13	1	1	1	\N
71	2	4	1	1	1	\N
72	2	4	1	1	2	\N
73	2	5	1	1	3	\N
74	2	5	1	1	4	\N
75	2	2	1	1	5	\N
76	2	7	1	2	1	\N
77	2	7	1	2	2	\N
78	2	1	1	2	3	\N
79	2	1	1	2	4	\N
80	2	1	1	2	5	\N
81	2	8	1	3	1	\N
82	2	9	1	3	2	\N
83	2	1	1	3	3	\N
84	2	1	1	3	4	\N
85	2	1	1	3	5	\N
86	2	13	1	4	1	\N
87	2	12	1	4	2	\N
91	2	4	1	5	1	\N
92	2	4	1	5	2	\N
93	2	1	1	5	3	\N
94	2	1	1	5	4	\N
95	2	1	1	5	5	\N
96	2	7	1	6	1	\N
97	2	7	1	6	2	\N
98	2	11	1	6	3	\N
99	2	11	1	6	4	\N
100	2	14	1	6	5	\N
101	2	7	1	7	1	\N
102	2	7	1	7	2	\N
103	2	5	1	7	3	\N
104	2	5	1	7	4	\N
105	2	5	1	7	5	\N
106	2	6	1	9	1	\N
107	2	6	1	9	2	\N
108	2	1	1	9	3	\N
109	2	1	1	9	4	\N
110	2	1	1	9	5	\N
111	2	7	1	10	1	\N
112	2	7	1	10	2	\N
113	2	10	1	10	3	\N
114	2	10	1	10	4	\N
115	2	14	1	10	5	\N
116	2	12	1	11	1	\N
117	2	13	1	11	2	\N
118	2	4	1	11	3	\N
119	2	4	1	11	4	\N
120	2	1	1	11	5	\N
121	2	8	1	12	1	\N
122	2	9	1	12	2	\N
123	2	1	1	12	3	\N
124	2	1	1	12	4	\N
125	2	1	1	12	5	\N
126	2	7	1	13	1	\N
127	2	7	1	13	2	\N
128	2	2	1	13	3	\N
129	2	2	1	13	4	\N
130	2	2	1	13	5	\N
131	2	8	1	14	1	\N
132	2	9	1	14	2	\N
133	2	1	1	14	3	\N
134	2	1	1	14	4	\N
135	2	1	1	14	5	\N
88	2	3	1	4	3	\N
89	2	3	1	4	4	\N
90	2	3	1	4	5	\N
1	1	7	1	1	1	2026-06-19 04:25:25.501975
\.


--
-- Data for Name: user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_permissions (id, user_id, permission_id, grant_type, reason, granted_at, granted_by, expiry_date, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: yearbook_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.yearbook_entries (id, academic_year_id, classroom_id, entry_type, title, section_order, image_url, description, person_id, event_date, uploaded_by, created_at, updated_at) FROM stdin;
\.


--
-- Name: academic_periods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.academic_periods_id_seq', 70, true);


--
-- Name: academic_years_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.academic_years_id_seq', 5, true);


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 1, false);


--
-- Name: attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attendance_id_seq', 658, true);


--
-- Name: attendance_warnings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.attendance_warnings_id_seq', 2, true);


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 272, true);


--
-- Name: awards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.awards_id_seq', 1, false);


--
-- Name: class_monitors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.class_monitors_id_seq', 21, true);


--
-- Name: class_subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.class_subjects_id_seq', 158, true);


--
-- Name: classrooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.classrooms_id_seq', 20, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 72, true);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 69, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 137, true);


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.documents_id_seq', 1, false);


--
-- Name: dropout_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.dropout_id_seq', 58, true);


--
-- Name: education_levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.education_levels_id_seq', 1, true);


--
-- Name: enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enrollments_id_seq', 166, true);


--
-- Name: final_scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.final_scores_id_seq', 1, false);


--
-- Name: kutis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kutis_id_seq', 11, true);


--
-- Name: monk_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.monk_permission_id_seq', 1, false);


--
-- Name: monk_permission_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.monk_permission_logs_id_seq', 1, false);


--
-- Name: monthly_payrolls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.monthly_payrolls_id_seq', 4, true);


--
-- Name: multiple_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.multiple_permission_id_seq', 132, true);


--
-- Name: nationalities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nationalities_id_seq', 2, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: pagodas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pagodas_id_seq', 9, true);


--
-- Name: paper_headers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paper_headers_id_seq', 1, false);


--
-- Name: pay_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pay_rates_id_seq', 1, false);


--
-- Name: payroll_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payroll_rates_id_seq', 36, true);


--
-- Name: pending_students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pending_students_id_seq', 59, true);


--
-- Name: pending_teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.pending_teachers_id_seq', 2, true);


--
-- Name: permission_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permission_actions_id_seq', 1, false);


--
-- Name: permission_audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permission_audit_logs_id_seq', 1, false);


--
-- Name: permission_group_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permission_group_members_id_seq', 1, false);


--
-- Name: permission_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permission_groups_id_seq', 1, false);


--
-- Name: permission_resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permission_resources_id_seq', 1, false);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissions_id_seq', 1, false);


--
-- Name: positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.positions_id_seq', 1, false);


--
-- Name: registration_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.registration_sessions_id_seq', 5, true);


--
-- Name: report_daily_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.report_daily_id_seq', 1, false);


--
-- Name: resource_access_policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resource_access_policies_id_seq', 1, false);


--
-- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_permissions_id_seq', 1, false);


--
-- Name: schedule_substitutions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schedule_substitutions_id_seq', 22, true);


--
-- Name: school_calendar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.school_calendar_id_seq', 1, false);


--
-- Name: scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.scores_id_seq', 1, false);


--
-- Name: staff_positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staff_positions_id_seq', 1, false);


--
-- Name: student_education_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_education_id_seq', 1, false);


--
-- Name: student_pay_year_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_pay_year_id_seq', 1, false);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 145, true);


--
-- Name: subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subjects_id_seq', 65, true);


--
-- Name: teacher_education_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_education_id_seq', 1, false);


--
-- Name: teacher_registration_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.teacher_registration_sessions_id_seq', 1, true);


--
-- Name: teacher_salaries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teacher_salaries_id_seq', 1, false);


--
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teachers_id_seq', 53, true);


--
-- Name: teaching_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teaching_sessions_id_seq', 1, false);


--
-- Name: time_slots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.time_slots_id_seq', 10, true);


--
-- Name: timetable_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.timetable_id_seq', 135, true);


--
-- Name: user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_permissions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 12, true);


--
-- Name: yearbook_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.yearbook_entries_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict 1xOD14ysJpnarDG0MO5gcQa78s4xAU8cNDeGsKMbi3G1EJg23RUyLWIGe0uNHJL

