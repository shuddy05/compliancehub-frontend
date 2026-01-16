import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ArrowLeft, Info, Building2, Users, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { companiesService } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const industries = [
  "Technology",
  "Manufacturing",
  "Retail",
  "Services",
  "Healthcare",
  "Construction",
  "Agriculture",
  "Finance",
  "Education",
  "Other",
];

const states = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "Abuja (FCT)",
];

const lgas: Record<string, string[]> = {
  Abia: [
    "Aba North",
    "Aba South",
    "Arochukwu",
    "Bende",
    "Ikwuano",
    "Isiala Ngwa North",
    "Isiala Ngwa South",
    "Isuikwuato",
    "Obi Ngwa",
    "Ohafia",
    "Osisioma Ngwa",
    "Ugwunagbo",
    "Ukwa East",
    "Ukwa West",
    "Umuahia North",
    "Umuahia South",
    "Umunneochi",
  ],
  Adamawa: [
    "Demsa",
    "Fufore",
    "Ganye",
    "Girei",
    "Gombi",
    "Guyuk",
    "Hong",
    "Jada",
    "Lamurde",
    "Madagali",
    "Maiha",
    "Mayo-Belwa",
    "Michika",
    "Mubi North",
    "Mubi South",
    "Numan",
    "Shelleng",
    "Song",
    "Toungo",
    "Yola North",
    "Yola South",
  ],
  "Akwa Ibom": [
    "Abak",
    "Eastern Obolo",
    "Eket",
    "Esit-Eket",
    "Essien Udim",
    "Etim Ekpo",
    "Etinan",
    "Ibeno",
    "Ibesikpo-Asutan",
    "Ibiono-Ibom",
    "Ika",
    "Ikono",
    "Ikot Abasi",
    "Ikot Ekpene",
    "Ini",
    "Itu",
    "Mbo",
    "Mkpat-Enin",
    "Mbo",
    "Nsit-Atai",
    "Nsit-Ibom",
    "Nsit-Ubium",
    "Obot Akara",
    "Okobo",
    "Onna",
    "Oron",
    "Oruk Anam",
    "Udung-Uko",
    "Ukanafun",
    "Uruan",
    "Urue-Offong/Oruko",
    "Uyo",
  ],
  Anambra: [
    "Aguata",
    "Anambra East",
    "Anambra West",
    "Anaocha",
    "Awka North",
    "Awka South",
    "Ayamelum",
    "Dunukofia",
    "Ekwusigo",
    "Idemili North",
    "Idemili South",
    "Ihiala",
    "Njikoka",
    "Nnewi North",
    "Nnewi South",
    "Ogbaru",
    "Onitsha North",
    "Onitsha South",
    "Orumba North",
    "Orumba South",
    "Oyi",
  ],
  Bauchi: [
    "Alkaleri",
    "Bauchi",
    "Bogoro",
    "Damban",
    "Darazo",
    "Dass",
    "Gamawa",
    "Ganjuwa",
    "Giade",
    "Itas/Gadau",
    "Jama'are",
    "Katagum",
    "Kirfi",
    "Misau",
    "Ningi",
    "Shira",
    "Tafawa Balewa",
    "Toro",
    "Warji",
    "Zaki",
  ],
  Bayelsa: [
    "Brass",
    "Ekeremor",
    "Kolokuma/Opokuma",
    "Nembe",
    "Ogbia",
    "Sagbama",
    "Southern Ijaw",
    "Yenagoa",
  ],
  Benue: [
    "Agatu",
    "Apa",
    "Ado",
    "Buruku",
    "Gboko",
    "Guma",
    "Gwer East",
    "Gwer West",
    "Katsina-Ala",
    "Konshisha",
    "Kwande",
    "Logo",
    "Makurdi",
    "Obi",
    "Ogbadibo",
    "Oju",
    "Okpokwu",
    "Otukpo",
    "Tarka",
    "Ukum",
    "Ushongo",
    "Vandeikya",
  ],
  Borno: [
    "Abadam",
    "Askira/Uba",
    "Bama",
    "Bayo",
    "Biu",
    "Chibok",
    "Damboa",
    "Dikwa",
    "Gubio",
    "Guzamala",
    "Gwoza",
    "Hawul",
    "Jere",
    "Kaga",
    "Kala/Balge",
    "Konduga",
    "Kukawa",
    "Kwaya Kusar",
    "Mafa",
    "Magumeri",
    "Maiduguri",
    "Marte",
    "Mobbar",
    "Monguno",
    "Ngala",
    "Nganzai",
    "Shani",
  ],
  "Cross River": [
    "Akpabuyo",
    "Odukpani",
    "Akamkpa",
    "Biase",
    "Abi",
    "Ikom",
    "Obanliku",
    "Obudu",
    "Ogoja",
    "Yala",
    "Bekwarra",
    "Calabar Municipal",
    "Calabar South",
  ],
  Delta: [
    "Burutu",
    "Ethiope East",
    "Ethiope West",
    "Ika North-East",
    "Ika South",
    "Isoko North",
    "Isoko South",
    "Ndokwa East",
    "Ndokwa West",
    "Okpe",
    "Oshimili North",
    "Oshimili South",
    "Patani",
    "Sapele",
    "Udu",
    "Ughelli North",
    "Ughelli South",
    "Ukwuani",
    "Uvwie",
    "Warri North",
    "Warri South",
    "Warri South-West",
  ],
  Ebonyi: [
    "Abakaliki",
    "Afikpo North",
    "Afikpo South (Edda)",
    "Ebonyi",
    "Ezza North",
    "Ezza South",
    "Ikwo",
    "Ishielu",
    "Ivo",
    "Izzi",
    "Ohaukwu",
    "Onicha",
  ],
  Edo: [
    "Aduwawa",
    "Egor",
    "Esan Central",
    "Esan North-East",
    "Esan South-East",
    "Esan West",
    "Etsako Central",
    "Etsako East",
    "Etsako West",
    "Igueben",
    "Ikpoba-Okha",
    "Oredo",
    "Ovia North-East",
    "Ovia South-West",
    "Orhionmwon",
    "Uhunmwonde",
  ],
  Ekiti: [
    "Ado-Ekiti",
    "Efon",
    "Ekiti East",
    "Ekiti South-West",
    "Ekiti West",
    "Emure",
    "Gbonyin",
    "Ido-Osi",
    "Ijero",
    "Ilejemeje",
    "Irepodun/Ifelodun",
    "Ise/Orun",
    "Moba",
    "Oye",
  ],
  Enugu: [
    "Aninri",
    "Awgu",
    "Anambra East",
    "Enugu East",
    "Enugu North",
    "Enugu South",
    "Ezeagu",
    "Igbo Eze North",
    "Igbo Eze South",
    "Isi Uzo",
    "Nkanu East",
    "Nkanu West",
    "Nsukka",
    "Udenu",
    "Udi",
    "Oji River",
  ],
  Gombe: [
    "Akko",
    "Balanga",
    "Billiri",
    "Dukku",
    "Funakaye",
    "Gombe",
    "Kaltungo",
    "Kwami",
    "Nafada/Bajoga",
    "Shongom",
    "Yamaltu/Deba",
  ],
  Imo: [
    "Aboh Mbaise",
    "Ahiazu Mbaise",
    "Ehime Mbano",
    "Ezinihitte",
    "Ideato North",
    "Ideato South",
    "Ihitte/Uboma",
    "Ikeduru",
    "Isiala Mbano",
    "Isu",
    "Mbaitoli",
    "Ngor Okpala",
    "Njaba",
    "Nkwerre",
    "Nwangele",
    "Obowo",
    "Oguta",
    "Ohaji/Egbema",
    "Okigwe",
    "Orlu",
    "Orsu",
    "Oru East",
    "Oru West",
    "Owerri Municipal",
    "Owerri North",
    "Owerri West",
  ],
  Jigawa: [
    "Auyo",
    "Babura",
    "Biriniwa",
    "Birnin Kudu",
    "Buji",
    "Dutse",
    "Gagarawa",
    "Garki",
    "Gumel",
    "Guri",
    "Gwaram",
    "Gwiwa",
    "Hadejia",
    "Jahun",
    "Kafin Hausa",
    "Kaugama",
    "Kazaure",
    "Kiri Kasama",
    "Kiyawa",
    "Maigatari",
    "Malam Madori",
    "Miga",
    "Ringim",
    "Roni",
    "Sule Tankarkar",
    "Taura",
    "Yankwashi",
  ],
  Kaduna: [
    "Birnin Gwari",
    "Chikun",
    "Giwa",
    "Igabi",
    "Ikara",
    "Jaba",
    "Jema'a",
    "Kachia",
    "Kaduna North",
    "Kaduna South",
    "Kagarko",
    "Kajuru",
    "Kaura",
    "Kauru",
    "Kubau",
    "Kudan",
    "Lere",
    "Makarfi",
    "Sabon Gari",
    "Sanga",
    "Soba",
    "Zangon Kataf",
    "Zaria",
  ],
  Kano: [
    "Ajingi",
    "Albasu",
    "Bagwai",
    "Bebeji",
    "Bichi",
    "Bunkure",
    "Dala",
    "Dambatta",
    "Dawakin Kudu",
    "Dawakin Tofa",
    "Doguwa",
    "Fagge",
    "Gabasawa",
    "Garko",
    "Garun Mallam",
    "Gaya",
    "Gezawa",
    "Gwale",
    "Gwarzo",
    "Kabo",
    "Kano Municipal",
    "Karaye",
    "Kibiya",
    "Kiru",
    "Kumbotso",
    "Kunchi",
    "Kura",
    "Madobi",
    "Makoda",
    "Minjibir",
    "Nasarawa",
    "Rano",
    "Rimin Gado",
    "Rogo",
    "Shanono",
    "Sumaila",
    "Takai",
    "Tarauni",
    "Tofa",
    "Tsanyawa",
    "Tudun Wada",
    "Ungogo",
    "Warawa",
    "Wudil",
  ],
  Katsina: [
    "Bakori",
    "Batagarawa",
    "Batsari",
    "Baure",
    "Bindawa",
    "Charanchi",
    "Dandume",
    "Danja",
    "Dan Musa",
    "Daura",
    "Dutsi",
    "Dutsin-Ma",
    "Faskari",
    "Funtua",
    "Ingawa",
    "Jibia",
    "Kafur",
    "Kaita",
    "Kankara",
    "Kankia",
    "Katsina",
    "Kurfi",
    "Kusada",
    "Mai'Adua",
    "Malumfashi",
    "Mani",
    "Mashi",
    "Matazu",
    "Musawa",
    "Rimi",
    "Sabuwa",
    "Safana",
    "Sandamu",
    "Zango",
  ],
  Kebbi: [
    "Aleiro",
    "Arewa",
    "Argungu",
    "Augie",
    "Bagudo",
    "Birnin Kebbi",
    "Bunza",
    "Dandi",
    "Fakai",
    "Gwandu",
    "Jega",
    "Kalgo",
    "Koko/Besse",
    "Maiyama",
    "Ngaski",
    "Sakaba",
    "Shanga",
    "Suru",
    "Wasagu/Danko",
    "Yauri",
  ],
  Kogi: [
    "Adavi",
    "Ajaokuta",
    "Ankpa",
    "Bassa",
    "Dekina",
    "Ibaji",
    "Idah",
    "Igalamela-Odolu",
    "Ijumu",
    "Kabba/Bunu",
    "Kogi",
    "Lokoja",
    "Mopa-Muro",
    "Ofu",
    "Ogori/Magongo",
    "Okehi",
    "Okene",
    "Olamaboro",
    "Omala",
    "Yagba East",
    "Yagba West",
  ],
  Kwara: [
    "Asa",
    "Baruten",
    "Ekiti",
    "Ifelodun",
    "Ilorin East",
    "Ilorin South",
    "Ilorin West",
    "Irepodun",
    "Isin",
    "Kaiama",
    "Moro",
    "Offa",
    "Oke Ero",
    "Oyun",
    "Pategi",
  ],
  Lagos: [
    "Agege",
    "Ajeromi-Ifelodun",
    "Alimosho",
    "Amuwo-Odofin",
    "Apapa",
    "Badagry",
    "Epe",
    "Eti-Osa",
    "Ibeju-Lekki",
    "Ifako-Ijaiye",
    "Ikeja",
    "Ikorodu",
    "Kosofe",
    "Lagos Island",
    "Lagos Mainland",
    "Mushin",
    "Ojo",
    "Oshodi-Isolo",
    "Shomolu",
    "Surulere",
  ],
  Nasarawa: [
    "Akwanga",
    "Awe",
    "Doma",
    "Karu",
    "Keana",
    "Keffi",
    "Lafia",
    "Nasarawa",
    "Nasarawa-Eggon",
    "Obi",
    "Toto",
    "Wamba",
  ],
  Niger: [
    "Agaie",
    "Agwara",
    "Bida",
    "Borgu",
    "Bosso",
    "Chanchaga",
    "Edati",
    "Gbako",
    "Gurara",
    "Katcha",
    "Kontagora",
    "Lapai",
    "Lavun",
    "Magama",
    "Mariga",
    "Mashegu",
    "Mokwa",
    "Moya",
    "Paikoro",
    "Rafi",
    "Rijau",
    "Shiroro",
    "Suleja",
    "Tafa",
    "Wushishi",
  ],
  Ogun: [
    "Abeokuta North",
    "Abeokuta South",
    "Ado-Odo/Ota",
    "Egbado North",
    "Egbado South",
    "Ewekoro",
    "Ifo",
    "Ijebu East",
    "Ijebu North",
    "Ijebu North East",
    "Ijebu Ode",
    "Ikenne",
    "Imeko-Afon",
    "Ipokia",
    "Odogbolu",
    "Odeda",
    "Ogun Waterside",
    "Remo North",
    "Shagamu",
  ],
  Ondo: [
    "Akoko North-East",
    "Akoko North-West",
    "Akoko South-East",
    "Akoko South-West",
    "Akure North",
    "Akure South",
    "Ese Odo",
    "Idanre",
    "Ifedore",
    "Ilaje",
    "Ile Oluji/Okeigbo",
    "Irele",
    "Odigbo",
    "Okitipupa",
    "Ondo East",
    "Ondo West",
    "Ose",
    "Owo",
  ],
  Osun: [
    "Atakunmosa East",
    "Atakunmosa West",
    "Aiyedaade",
    "Aiyedire",
    "Boluwaduro",
    "Boripe",
    "Ede North",
    "Ede South",
    "Egbedore",
    "Ejigbo",
    "Ife Central",
    "Ife East",
    "Ife North",
    "Ife South",
    "Ifedayo",
    "Ifelodun",
    "Ila",
    "Ilesa East",
    "Ilesa West",
    "Irepodun",
    "Irewole",
    "Isokan",
    "Iwo",
    "Obokun",
    "Odo-Otin",
    "Ola-Oluwa",
    "Olorunda",
    "Oriade",
    "Orolu",
    "Osogbo",
  ],
  Oyo: [
    "Afijio",
    "Akinyele",
    "Atiba",
    "Atisbo",
    "Egbeda",
    "Ibadan North",
    "Ibadan North-East",
    "Ibadan North-West",
    "Ibadan South-East",
    "Ibadan South-West",
    "Ibarapa Central",
    "Ibarapa East",
    "Ibarapa North",
    "Ido",
    "Irepo",
    "Iseyin",
    "Itesiwaju",
    "Iwajowa",
    "Kajola",
    "Lagelu",
    "Ogbomosho North",
    "Ogbomosho South",
    "Ogo-Oluwa",
    "Olorunsogo",
    "Oluyole",
    "Ona Ara",
    "Orelope",
    "Ori Ire",
    "Oyo East",
    "Oyo West",
    "Saki East",
    "Saki West",
    "Surulere",
  ],
  Plateau: [
    "Bokkos",
    "Barkin Ladi",
    "Bassa",
    "Bokkos",
    "Jos East",
    "Jos North",
    "Jos South",
    "Kanam",
    "Kanke",
    "Langtang North",
    "Langtang South",
    "Mangu",
    "Mikang",
    "Pankshin",
    "Qua'an Pan",
    "Riyom",
    "Shendam",
    "Wase",
  ],
  Rivers: [
    "Abua/Odual",
    "Ahoada East",
    "Ahoada West",
    "Akuku-Toru",
    "Andoni",
    "Asari-Toru",
    "Bonny",
    "Degema",
    "Eleme",
    "Emohua",
    "Etche",
    "Gokana",
    "Ikwerre",
    "Khana",
    "Obio/Akpor",
    "Ogba/Egbema/Ndoni",
    "Ogu/Bolo",
    "Okrika",
    "Omuma",
    "Opobo/Nkoro",
    "Oyigbo",
    "Port Harcourt",
  ],
  Sokoto: [
    "Binji",
    "Bodinga",
    "Dange Shuni",
    "Gada",
    "Goronyo",
    "Gwadabawa",
    "Illela",
    "Kebbe",
    "Kware",
    "Rabah",
    "Sabon Birni",
    "Shagari",
    "Sokoto North",
    "Sokoto South",
    "Tambuwal",
    "Tangaza",
    "Tureta",
    "Wamako",
    "Wurno",
    "Yabo",
  ],
  Taraba: [
    "Ardo-Kola",
    "Bali",
    "Donga",
    "Gashaka",
    "Gassol",
    "Ibi",
    "Jalingo",
    "Karim-Lamido",
    "Kumi",
    "Lau",
    "Sardauna",
    "Takum",
    "Ussa",
    "Wukari",
    "Yorro",
    "Zing",
  ],
  Yobe: [
    "Bade",
    "Bursari",
    "Damaturu",
    "Fika",
    "Fune",
    "Geidam",
    "Gujba",
    "Gulani",
    "Jakusko",
    "Karasuwa",
    "Machina",
    "Nangere",
    "Nguru",
    "Potiskum",
    "Tarmuwa",
    "Yunusari",
    "Yusufari",
  ],
  Zamfara: [
    "Anka",
    "Bakura",
    "Birnin Magaji/Kiyaw",
    "Bungudu",
    "Gummi",
    "Gusau",
    "Kaura Namoda",
    "Maradun",
    "Maru",
    "Shinkafi",
    "Talata Mafara",
    "Tsafe",
    "Zurmi",
  ],
  "Abuja (FCT)": [
    "Abaji",
    "Bwari",
    "Gwagwalada",
    "Kuje",
    "Kwali",
    "Municipal Area Council",
  ],
  Other: ["Enter manually"],
};

export default function CompanySetup() {
  const navigate = useNavigate();
  const { setCompany, setUserRole } = useAuth();
  const [formData, setFormData] = useState({
    companyName: "",
    tin: "",
    rcNumber: "",
    industry: "",
    employees: 10,
    state: "",
    lga: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSizeLabel = (count: number) => {
    if (count <= 10) return "Micro";
    if (count <= 49) return "Small";
    if (count <= 199) return "Medium";
    return "Large";
  };

  const isValid =
    formData.companyName && formData.industry && formData.state && formData.lga;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Call backend to create company
      const response = await companiesService.createCompany({
        name: formData.companyName,
        tin: formData.tin || undefined,
        rcNumber: formData.rcNumber || undefined,
        industry: formData.industry,
        state: formData.state,
        lga: formData.lga,
        address: "",
        phone: "",
        email: "",
        defaultCurrency: "NGN",
        timezone: "Africa/Lagos",
      });

      // Store company in context
      if (response.data) {
        setCompany({
          id: response.data.id,
          name: response.data.name,
          tin: formData.tin,
          rcNumber: formData.rcNumber,
          industry: formData.industry,
          numberOfEmployees: formData.employees,
          state: formData.state,
          lga: formData.lga,
        });

        // The backend creates the user as super_admin, but we'll set as company_admin for simplicity
        // In a real app, you'd fetch the actual role from company_users table
        setUserRole('company_admin');

        // Navigate to next step
        navigate("/plan-selection");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to create company. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/role-selection")}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <ProgressIndicator currentStep={3} totalSteps={4} />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-display font-bold mb-2">Tell us about your company</h1>
          <p className="text-muted-foreground mb-8">
            This helps us customize your compliance experience
          </p>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                placeholder="Acme Technologies Ltd"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, companyName: e.target.value }))
                }
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="tin">Tax ID (TIN)</Label>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </div>
                <Input
                  id="tin"
                  placeholder="Optional"
                  value={formData.tin}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tin: e.target.value }))
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="rcNumber">RC Number</Label>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </div>
                <Input
                  id="rcNumber"
                  placeholder="Optional"
                  value={formData.rcNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, rcNumber: e.target.value }))
                  }
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Industry *</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, industry: value }))
                }
                disabled={isLoading}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Employee slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Number of Employees</Label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">{formData.employees}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      formData.employees <= 10
                        ? "bg-primary/10 text-primary"
                        : formData.employees <= 49
                        ? "bg-accent/10 text-accent"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {getSizeLabel(formData.employees)}
                  </span>
                </div>
              </div>
              <Slider
                value={[formData.employees]}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, employees: value[0] }))
                }
                min={1}
                max={250}
                step={1}
                className="py-2"
                disabled={isLoading}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>250+</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>State *</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, state: value, lga: "" }))
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>LGA *</Label>
                {lgas[formData.state] && lgas[formData.state][0] !== 'Enter manually' ? (
                  <Select
                    value={formData.lga}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, lga: value }))
                    }
                    disabled={!formData.state || isLoading}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select LGA" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {lgas[formData.state].map((lga) => (
                        <SelectItem key={lga} value={lga}>
                          {lga}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder={formData.state ? 'Enter LGA' : 'Select state first'}
                    value={formData.lga}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, lga: e.target.value }))
                    }
                    disabled={!formData.state || isLoading}
                  />
                )}
              </div>
            </div>

            {/* Coach mark */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-accent/10 border border-accent/20">
              <Building2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Your TIN helps us auto-calculate taxes accurately
              </p>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Creating company..." : "Next"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
