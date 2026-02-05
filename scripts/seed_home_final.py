import requests
import json

API_URL = "http://localhost:8001/api"

# Get home page
home = requests.get(f"{API_URL}/pages/slug/home").json()
home_id = home["id"]

# Create sections matching the reference design EXACTLY
sections = [
    # 1. Hero Section - centered with image below
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
                "de": "Alle Ihre Buchungen an einem Ort. Sehen Sie alle Immobiliendetails, Reservierungen, Anfragen und Einnahmen."
            },
            "button_text": {
                "en": "Get started",
                "hr": "Započni",
                "de": "Loslegen"
            },
            "button_url": "/pricing",
            "secondary_button_text": {
                "en": "See more",
                "hr": "Saznaj više",
                "de": "Mehr erfahren"
            },
            "secondary_button_url": "#features",
            "image_url": "/api/media/uploads/hero_dashboard.png",
            "background_color": "white",
            "background_gradient": False
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
                "de": "Leistungsstarkes Property Management System und Channel Manager helfen Ihnen alles zu synchronisieren"
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
                "de": "Leistungsstarker Channel Manager und Property Management System helfen Ihnen alles zu synchronisieren"
            },
            "button_text": {
                "en": "Get started",
                "hr": "Započni",
                "de": "Loslegen"
            },
            "button_url": "/pricing",
            "image_url": "/api/media/uploads/pms_devices.png",
            "background_color": "dark",
            "background_gradient": False,
            "image_display_size": "large",
            "image_frame": False,
            "image_shadow": "none"
        }
    },
    # 3. Features List with image
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
                "de": "Wichtige Informationen in einer einfachen und intuitiven Oberfläche"
            },
            "layout": "list-with-image",
            "image_url": "/api/media/uploads/features_woman.png",
            "items": [
                {
                    "icon": "Globe",
                    "title": {"en": "Centralized Booking Management", "hr": "Centralizirano upravljanje rezervacijama", "de": "Zentralisierte Buchungsverwaltung"},
                    "description": {"en": "Keep all reservations from every channel in one calendar.", "hr": "Držite sve rezervacije sa svih kanala u jednom kalendaru.", "de": "Alle Reservierungen aus allen Kanälen in einem Kalender."}
                },
                {
                    "icon": "Users",
                    "title": {"en": "Automated Guest Communication integrated with AI", "hr": "Automatizirana komunikacija s gostima integrirana s AI", "de": "Automatisierte Gästekommunikation mit KI"},
                    "description": {"en": "Send confirmations and messages automatically.", "hr": "Šaljite potvrde i poruke automatski.", "de": "Senden Sie Bestätigungen und Nachrichten automatisch."}
                },
                {
                    "icon": "Globe",
                    "title": {"en": "Multi Platform Integration", "hr": "Integracija više platformi", "de": "Multi-Plattform-Integration"},
                    "description": {"en": "Connect with Booking, Airbnb, Expedia, your web site and much more.", "hr": "Povežite se s Bookingom, Airbnb-om, Expediom, vašom web stranicom i još mnogo toga.", "de": "Verbinden Sie sich mit Booking, Airbnb, Expedia, Ihrer Website und mehr."}
                },
                {
                    "icon": "BarChart",
                    "title": {"en": "Smart Revenue Optimization", "hr": "Pametna optimizacija prihoda", "de": "Intelligente Umsatzoptimierung"},
                    "description": {"en": "Use dynamic pricing rules to grow income.", "hr": "Koristite dinamička pravila cijena za rast prihoda.", "de": "Nutzen Sie dynamische Preisregeln für mehr Umsatz."}
                },
                {
                    "icon": "Clock",
                    "title": {"en": "Mobile App", "hr": "Mobilna aplikacija", "de": "Mobile App"},
                    "description": {"en": "Manage properties on the go.", "hr": "Upravljajte nekretninama u pokretu.", "de": "Verwalten Sie Immobilien unterwegs."}
                }
            ]
        }
    },
    # 4. Booking Providers Section with calendar image
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
            "headline_highlight": {
                "en": "booking providers",
                "hr": "booking platformama",
                "de": "Buchungsanbietern"
            },
            "headline_highlight_color": "primary",
            "subheadline": {
                "en": "Easily connect your rentals with many booking portals to keep everything in sync.",
                "hr": "Jednostavno povežite svoje smještaje s brojnim booking portalima kako bi sve bilo sinkronizirano.",
                "de": "Verbinden Sie Ihre Unterkünfte einfach mit vielen Buchungsportalen, um alles synchron zu halten."
            },
            "image_url": "/api/media/uploads/calendar_providers.png",
            "items": [],
            "background_color": "white"
        }
    },
    # 5. Modules Grid - 4 cards
    {
        "id": "modules-grid",
        "section_type": "benefits_grid",
        "order": 4,
        "visible": True,
        "content": {
            "subheadline": {
                "en": "CHOOSE THE MODULES THAT FIT YOUR NEEDS",
                "hr": "ODABERITE MODULE KOJI ODGOVARAJU VAŠIM POTREBAMA",
                "de": "WÄHLEN SIE DIE MODULE, DIE ZU IHREN BEDÜRFNISSEN PASSEN"
            },
            "headline": {
                "en": "The Best Channel Manager for Your Business",
                "hr": "Najbolji Channel Manager za vaše poslovanje",
                "de": "Der beste Channel Manager für Ihr Unternehmen"
            },
            "items": [
                {
                    "icon": "Globe",
                    "title": {"en": "Channel Manager", "hr": "Channel Manager", "de": "Channel Manager"},
                    "description": {"en": "Sync all OTA channels in real time.", "hr": "Sinkronizirajte sve OTA kanale u stvarnom vremenu.", "de": "Synchronisieren Sie alle OTA-Kanäle in Echtzeit."}
                },
                {
                    "icon": "Calendar",
                    "title": {"en": "eVisitor", "hr": "eVisitor", "de": "eVisitor"},
                    "description": {"en": "Automated guest registration.", "hr": "Automatska prijava gostiju.", "de": "Automatische Gästeregistrierung."}
                },
                {
                    "icon": "BarChart",
                    "title": {"en": "Website", "hr": "Web stranica", "de": "Website"},
                    "description": {"en": "Direct booking website with engine.", "hr": "Web stranica za direktne rezervacije s booking sustavom.", "de": "Direktbuchungs-Website mit Buchungssystem."}
                },
                {
                    "icon": "Zap",
                    "title": {"en": "Smart Apartment", "hr": "Pametni apartman", "de": "Smart Apartment"},
                    "description": {"en": "Smart locks and devices for easier stays.", "hr": "Pametne brave i uređaji za lakši boravak.", "de": "Smarte Schlösser und Geräte für einfachere Aufenthalte."}
                }
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
        "content": {
            "headline": {
                "en": "What Our Clients Say",
                "hr": "Što kažu naši klijenti",
                "de": "Was unsere Kunden sagen"
            }
        }
    },
    # 7. FAQ Section
    {
        "id": "faq-section",
        "section_type": "faq",
        "order": 6,
        "visible": True,
        "content": {
            "headline": {
                "en": "FAQs",
                "hr": "Česta pitanja",
                "de": "FAQs"
            }
        }
    }
]

# Update home page
home["sections"] = sections
response = requests.put(f"{API_URL}/pages/{home_id}", json=home)
print(f"Updated home page: {response.status_code}")

# Also update FAQs in database
faqs = [
    {
        "question": {"en": "What is SyncBeds?", "hr": "Što je SyncBeds?", "de": "Was ist SyncBeds?"},
        "answer": {"en": "SyncBeds is a complete property management system and channel manager for vacation rentals.", "hr": "SyncBeds je kompletan sustav upravljanja nekretninama i channel manager za privatni smještaj.", "de": "SyncBeds ist ein komplettes Property Management System und Channel Manager für Ferienvermietungen."},
        "order": 0
    },
    {
        "question": {"en": "How do you prevent double bookings?", "hr": "Kako sprječavate duple rezervacije?", "de": "Wie verhindern Sie Doppelbuchungen?"},
        "answer": {"en": "Our channel manager syncs in real-time with all OTA platforms, ensuring availability is always up to date.", "hr": "Naš channel manager sinkronizira se u stvarnom vremenu sa svim OTA platformama, osiguravajući da je dostupnost uvijek ažurna.", "de": "Unser Channel Manager synchronisiert sich in Echtzeit mit allen OTA-Plattformen."},
        "order": 1
    },
    {
        "question": {"en": "Can I use my own website?", "hr": "Mogu li koristiti vlastitu web stranicu?", "de": "Kann ich meine eigene Website nutzen?"},
        "answer": {"en": "Yes, SyncBeds integrates with your existing website or we can create a direct booking website for you.", "hr": "Da, SyncBeds se integrira s vašom postojećom web stranicom ili možemo kreirati web stranicu za direktne rezervacije.", "de": "Ja, SyncBeds integriert sich mit Ihrer bestehenden Website oder wir können eine Direktbuchungs-Website für Sie erstellen."},
        "order": 2
    }
]

# Update FAQs
for faq in faqs:
    requests.post(f"{API_URL}/faqs", json=faq)

print("FAQs updated")

# Update testimonials
testimonials = [
    {
        "name": "Michele Trioni",
        "role": {"en": "Property Owner", "hr": "Vlasnik nekretnine", "de": "Immobilienbesitzer"},
        "content": {"en": "SyncBeds has transformed how I manage my vacation rentals. The automation saves me hours every week.", "hr": "SyncBeds je transformirao način na koji upravljam svojim smještajem. Automatizacija mi štedi sate svaki tjedan.", "de": "SyncBeds hat verändert, wie ich meine Ferienwohnungen verwalte."},
        "rating": 5,
        "image_url": "/api/media/uploads/testimonial_michele.png"
    },
    {
        "name": "Dejan Pejovic",
        "role": {"en": "Agency Owner", "hr": "Vlasnik agencije", "de": "Agenturinhaber"},
        "content": {"en": "The channel manager is incredibly reliable. No more double bookings!", "hr": "Channel manager je nevjerojatno pouzdan. Nema više duplih rezervacija!", "de": "Der Channel Manager ist unglaublich zuverlässig."},
        "rating": 5,
        "image_url": "https://via.placeholder.com/80x80?text=D"
    },
    {
        "name": "Martina Majcen",
        "role": {"en": "Hotel Manager", "hr": "Upraviteljica hotela", "de": "Hotelmanagerin"},
        "content": {"en": "Best investment for our property business. Highly recommended.", "hr": "Najbolja investicija za naše poslovanje s nekretninama. Toplo preporučujem.", "de": "Beste Investition für unser Immobiliengeschäft."},
        "rating": 5,
        "image_url": "https://via.placeholder.com/80x80?text=M2"
    }
]

# Clear and add testimonials
for t in testimonials:
    requests.post(f"{API_URL}/testimonials", json=t)

print("Testimonials updated")
