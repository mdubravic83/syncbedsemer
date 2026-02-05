import requests

API_URL = "http://localhost:8001/api"

# Get home page
home = requests.get(f"{API_URL}/pages/slug/home").json()
home_id = home["id"]

# Use the existing images from reference (same hash names in /app/backend/media/)
sections = [
    # 1. Hero Section
    {
        "id": "hero-main",
        "section_type": "hero_2",
        "order": 0,
        "visible": True,
        "content": {
            "subheadline": {
                "en": "CHANNEL MANAGER FOR VACATION RENTALS",
                "hr": "CHANNEL MANAGER ZA PRIVATNI SMJEŠTAJ",
                "de": "CHANNEL MANAGER FÜR FERIENVERMIETUNGEN"
            },
            "headline": {
                "en": "All in one platform for vacation rentals owners, tourist agencies, hotels and villas",
                "hr": "Sve u jednoj platformi za vlasnike privatnog smještaja, turističke agencije, hotele i vile",
                "de": "Alles in einer Plattform für Ferienwohnungsbesitzer, Reisebüros, Hotels und Villen"
            },
            "headline_highlight": {
                "en": "All in one",
                "hr": "Sve u jednoj",
                "de": "Alles in einer"
            },
            "headline_highlight_color": "primary",
            "body": {
                "en": "All your bookings in one place. See all property details, reservations, inquiries and revenue.",
                "hr": "Sve vaše rezervacije na jednom mjestu. Pregledajte sve detalje nekretnina, rezervacije, upite i prihode.",
                "de": "Alle Ihre Buchungen an einem Ort."
            },
            "button_text": {"en": "Get started", "hr": "Započni", "de": "Loslegen"},
            "button_url": "/pricing",
            "secondary_button_text": {"en": "See more", "hr": "Saznaj više", "de": "Mehr erfahren"},
            "secondary_button_url": "#features",
            "image_url": "/api/uploads/c6a85a435a144182bd63cb3be561024c.png",
            "background_color": "white"
        }
    },
    # 2. PMS Dark Section
    {
        "id": "pms-section",
        "section_type": "hero",
        "order": 1,
        "visible": True,
        "content": {
            "subheadline": {
                "en": "PROPERTY MANAGEMENT SYSTEM FOR VACATION RENTALS",
                "hr": "SUSTAV UPRAVLJANJA NEKRETNINAMA ZA PRIVATNI SMJEŠTAJ",
                "de": "PROPERTY MANAGEMENT SYSTEM FÜR FERIENVERMIETUNGEN"
            },
            "headline": {
                "en": "Powerfull full contant api property management system and channel manager help you sync everything in one place",
                "hr": "Moćan sustav upravljanja nekretninama i channel manager pomažu vam sinkronizirati sve na jednom mjestu",
                "de": "Leistungsstarkes Property Management System und Channel Manager"
            },
            "headline_highlight": {
                "en": "property management system",
                "hr": "sustav upravljanja nekretninama",
                "de": "Property Management System"
            },
            "headline_highlight_color": "primary",
            "body": {
                "en": "Powerfull full contant api channel manager and property management system help you sync everything in one place",
                "hr": "Moćan channel manager i sustav upravljanja nekretninama pomažu vam sinkronizirati sve na jednom mjestu",
                "de": "Channel Manager und Property Management System"
            },
            "button_text": {"en": "Get started", "hr": "Započni", "de": "Loslegen"},
            "button_url": "/pricing",
            "image_url": "/api/uploads/f0e9959d1dab4524986d035f4fe7bc69.png",
            "background_color": "dark",
            "image_display_size": "large",
            "image_frame": False,
            "image_shadow": "none"
        }
    },
    # 3. Features List
    {
        "id": "features-list",
        "section_type": "features_list",
        "order": 2,
        "visible": True,
        "content": {
            "headline": {
                "en": "Powerful Features for Effortless Management",
                "hr": "Moćne značajke za jednostavno upravljanje",
                "de": "Leistungsstarke Funktionen für müheloses Management"
            },
            "subheadline": {
                "en": "Key information overview in a simple and intuitive interface",
                "hr": "Pregled ključnih informacija u jednostavnom i intuitivnom sučelju",
                "de": "Wichtige Informationen in einer einfachen Oberfläche"
            },
            "layout": "list-with-image",
            "image_url": "/api/uploads/3a367ec2f06e495eae32bdaa42d171d9.png",
            "items": [
                {"icon": "Globe", "title": {"en": "Centralized Booking Management", "hr": "Centralizirano upravljanje rezervacijama"}, "description": {"en": "Keep all reservations from every channel in one calendar.", "hr": "Držite sve rezervacije sa svih kanala u jednom kalendaru."}},
                {"icon": "Users", "title": {"en": "Automated Guest Communication integrated with AI", "hr": "Automatizirana komunikacija s gostima integrirana s AI"}, "description": {"en": "Send confirmations and messages automatically.", "hr": "Šaljite potvrde i poruke automatski."}},
                {"icon": "Globe", "title": {"en": "Multi Platform Integration", "hr": "Integracija više platformi"}, "description": {"en": "Connect with Booking, Airbnb, Expedia, your web site and much more.", "hr": "Povežite se s Bookingom, Airbnb-om, Expediom i još mnogo toga."}},
                {"icon": "BarChart", "title": {"en": "Smart Revenue Optimization", "hr": "Pametna optimizacija prihoda"}, "description": {"en": "Use dynamic pricing rules to grow income.", "hr": "Koristite dinamička pravila cijena za rast prihoda."}},
                {"icon": "Clock", "title": {"en": "Mobile App", "hr": "Mobilna aplikacija"}, "description": {"en": "Manage properties on the go.", "hr": "Upravljajte nekretninama u pokretu."}}
            ]
        }
    },
    # 4. Booking Providers
    {
        "id": "booking-providers",
        "section_type": "promo_grid",
        "order": 3,
        "visible": True,
        "content": {
            "headline": {
                "en": "Integrated with top booking providers",
                "hr": "Integriran s vrhunskim booking platformama",
                "de": "Integriert mit führenden Buchungsanbietern"
            },
            "headline_highlight": {"en": "booking providers", "hr": "booking platformama"},
            "headline_highlight_color": "primary",
            "subheadline": {
                "en": "Easily connect your rentals with many booking portals to keep everything in sync.",
                "hr": "Jednostavno povežite svoje smještaje s brojnim booking portalima."
            },
            "image_url": "/api/uploads/a4a37a4829784db88860aede52c62d15.png",
            "items": [],
            "background_color": "white"
        }
    },
    # 5. Modules Grid
    {
        "id": "modules-grid",
        "section_type": "benefits_grid",
        "order": 4,
        "visible": True,
        "content": {
            "subheadline": {"en": "CHOOSE THE MODULES THAT FIT YOUR NEEDS", "hr": "ODABERITE MODULE KOJI ODGOVARAJU VAŠIM POTREBAMA"},
            "headline": {"en": "The Best Channel Manager for Your Business", "hr": "Najbolji Channel Manager za vaše poslovanje"},
            "items": [
                {"icon": "Globe", "title": {"en": "Channel Manager"}, "description": {"en": "Sync all OTA channels in real time.", "hr": "Sinkronizirajte sve OTA kanale u stvarnom vremenu."}},
                {"icon": "Calendar", "title": {"en": "eVisitor"}, "description": {"en": "Automated guest registration.", "hr": "Automatska prijava gostiju."}},
                {"icon": "BarChart", "title": {"en": "Website", "hr": "Web stranica"}, "description": {"en": "Direct booking website with engine.", "hr": "Web stranica za direktne rezervacije."}},
                {"icon": "Zap", "title": {"en": "Smart Apartment", "hr": "Pametni apartman"}, "description": {"en": "Smart locks and devices.", "hr": "Pametne brave i uređaji."}}
            ],
            "columns": 4
        }
    },
    # 6. Testimonials
    {
        "id": "testimonials",
        "section_type": "testimonials",
        "order": 5,
        "visible": True,
        "content": {"headline": {"en": "What Our Clients Say", "hr": "Što kažu naši klijenti"}}
    },
    # 7. FAQ
    {
        "id": "faq-section",
        "section_type": "faq",
        "order": 6,
        "visible": True,
        "content": {"headline": {"en": "FAQs", "hr": "Česta pitanja"}}
    }
]

home["sections"] = sections
response = requests.put(f"{API_URL}/pages/{home_id}", json=home)
print(f"Updated: {response.status_code}")
