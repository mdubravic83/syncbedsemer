import requests
import json

API_URL = "http://localhost:8001/api"

# Get home page
home = requests.get(f"{API_URL}/pages/slug/home").json()
home_id = home["id"]

# Create comprehensive sections matching the reference design
sections = [
    # 1. Hero Section
    {
        "id": "hero-main",
        "section_type": "hero",
        "order": 0,
        "visible": True,
        "content": {
            "subheadline": {
                "en": "CHANNEL MANAGER FOR VACATION RENTALS",
                "hr": "CHANNEL MANAGER ZA PRIVATNI SMJEŠTAJ",
                "de": "CHANNEL MANAGER FÜR FERIENVERMIETUNGEN"
            },
            "headline": {
                "en": "All in one platform for managing your vacation rental",
                "hr": "Sve u jednoj platformi za upravljanje privatnim smještajem",
                "de": "Alles in einer Plattform für die Verwaltung Ihrer Ferienwohnung"
            },
            "headline_highlight": {
                "en": "vacation rental",
                "hr": "privatnim smještajem",
                "de": "Ferienwohnung"
            },
            "headline_highlight_color": "primary",
            "body": {
                "en": "SyncBeds helps property managers and hosts automate their daily operations, sync calendars across all platforms, and grow their rental business.",
                "hr": "SyncBeds pomaže upraviteljima nekretnina i domaćinima automatizirati svakodnevne operacije, sinkronizirati kalendare na svim platformama i razvijati poslovanje iznajmljivanja.",
                "de": "SyncBeds hilft Immobilienverwaltern und Gastgebern, ihre täglichen Abläufe zu automatisieren, Kalender auf allen Plattformen zu synchronisieren und ihr Vermietungsgeschäft auszubauen."
            },
            "button_text": {
                "en": "Get started",
                "hr": "Započni",
                "de": "Loslegen"
            },
            "button_url": "/pricing",
            "image_url": "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800",
            "background_color": "white",
            "background_gradient": False,
            "image_display_size": "large",
            "image_frame": True,
            "image_shadow": "strong"
        }
    },
    # 2. PMS Dark Section (hero_2 style - image below)
    {
        "id": "pms-section",
        "section_type": "hero_2",
        "order": 1,
        "visible": True,
        "content": {
            "subheadline": {
                "en": "PROPERTY MANAGEMENT SYSTEM",
                "hr": "SUSTAV UPRAVLJANJA NEKRETNINAMA",
                "de": "PROPERTY MANAGEMENT SYSTEM"
            },
            "headline": {
                "en": "A complete Property Management System for vacation rentals",
                "hr": "Kompletan sustav upravljanja nekretninama za privatni smještaj",
                "de": "Ein komplettes Property Management System für Ferienvermietungen"
            },
            "headline_highlight": {
                "en": "Property Management System",
                "hr": "sustav upravljanja nekretninama",
                "de": "Property Management System"
            },
            "headline_highlight_color": "primary",
            "body": {
                "en": "Manage all your properties from one dashboard. Track bookings, automate guest communication, and optimize your pricing strategy.",
                "hr": "Upravljajte svim svojim nekretninama s jedne nadzorne ploče. Pratite rezervacije, automatizirajte komunikaciju s gostima i optimizirajte strategiju cijena.",
                "de": "Verwalten Sie alle Ihre Immobilien von einem Dashboard aus. Verfolgen Sie Buchungen, automatisieren Sie die Gästekommunikation und optimieren Sie Ihre Preisstrategie."
            },
            "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
            "background_color": "dark",
            "background_gradient": False
        }
    },
    # 3. Features List - Powerful Features
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
            "headline_highlight": {
                "en": "Powerful Features",
                "hr": "Moćne značajke",
                "de": "Leistungsstarke Funktionen"
            },
            "headline_highlight_color": "primary",
            "subheadline": {
                "en": "Everything you need to manage your vacation rental business",
                "hr": "Sve što vam treba za upravljanje poslovanjem iznajmljivanja",
                "de": "Alles, was Sie für Ihr Vermietungsgeschäft brauchen"
            },
            "layout": "cards",
            "items": [
                {
                    "icon": "Calendar",
                    "title": {"en": "Smart Calendar", "hr": "Pametni kalendar", "de": "Intelligenter Kalender"},
                    "description": {"en": "Unified calendar view across all platforms. Never double-book again.", "hr": "Jedinstven prikaz kalendara na svim platformama. Nikad više duplih rezervacija.", "de": "Einheitliche Kalenderansicht auf allen Plattformen."}
                },
                {
                    "icon": "RefreshCw",
                    "title": {"en": "Real-time Sync", "hr": "Sinkronizacija u stvarnom vremenu", "de": "Echtzeit-Synchronisation"},
                    "description": {"en": "Instant synchronization with Airbnb, Booking.com, Expedia and 200+ OTAs.", "hr": "Trenutna sinkronizacija s Airbnb, Booking.com, Expedia i 200+ OTA platformi.", "de": "Sofortige Synchronisation mit Airbnb, Booking.com, Expedia und 200+ OTAs."}
                },
                {
                    "icon": "Zap",
                    "title": {"en": "Automated Messaging", "hr": "Automatske poruke", "de": "Automatisierte Nachrichten"},
                    "description": {"en": "Send automated check-in instructions, reminders, and review requests.", "hr": "Šaljite automatske upute za prijavu, podsjetnike i zahtjeve za recenzije.", "de": "Senden Sie automatische Check-in-Anweisungen und Bewertungsanfragen."}
                },
                {
                    "icon": "BarChart",
                    "title": {"en": "Analytics & Reports", "hr": "Analitika i izvještaji", "de": "Analysen & Berichte"},
                    "description": {"en": "Track performance, revenue, and occupancy rates with detailed reports.", "hr": "Pratite performanse, prihode i popunjenost s detaljnim izvještajima.", "de": "Verfolgen Sie Leistung, Umsatz und Auslastung mit detaillierten Berichten."}
                },
                {
                    "icon": "Shield",
                    "title": {"en": "Guest Verification", "hr": "Verifikacija gostiju", "de": "Gästeverifizierung"},
                    "description": {"en": "Secure ID verification and guest screening for peace of mind.", "hr": "Sigurna verifikacija osobnih dokumenata i provjera gostiju za mir.", "de": "Sichere ID-Verifizierung und Gästeüberprüfung."}
                }
            ]
        }
    },
    # 4. Booking Providers Section (Promo Grid with logos)
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
                "en": "top booking providers",
                "hr": "vrhunskim booking platformama",
                "de": "führenden Buchungsanbietern"
            },
            "headline_highlight_color": "primary",
            "subheadline": {
                "en": "Connect your listings to all major OTAs with one click",
                "hr": "Povežite svoje oglase sa svim glavnim OTA platformama jednim klikom",
                "de": "Verbinden Sie Ihre Inserate mit allen großen OTAs mit einem Klick"
            },
            "items": [
                {"title": {"en": "Airbnb"}, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/512px-Airbnb_Logo_B%C3%A9lo.svg.png", "image_size": "medium"},
                {"title": {"en": "Booking.com"}, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Booking.com_logo.svg/512px-Booking.com_logo.svg.png", "image_size": "medium"},
                {"title": {"en": "Expedia"}, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Expedia_2012_logo.svg/512px-Expedia_2012_logo.svg.png", "image_size": "medium"},
                {"title": {"en": "Vrbo"}, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Vrbo_logo.svg/512px-Vrbo_logo.svg.png", "image_size": "medium"},
                {"title": {"en": "TripAdvisor"}, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/TripAdvisor_Logo_%282020%29.svg/512px-TripAdvisor_Logo_%282020%29.svg.png", "image_size": "medium"},
                {"title": {"en": "Google"}, "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/512px-Google_2015_logo.svg.png", "image_size": "medium"}
            ],
            "columns": 6,
            "background_color": "light"
        }
    },
    # 5. CTA Section
    {
        "id": "cta-section",
        "section_type": "cta",
        "order": 4,
        "visible": True,
        "content": {
            "headline": {
                "en": "Get started now",
                "hr": "Započnite sada",
                "de": "Jetzt starten"
            },
            "body": {
                "en": "Join thousands of property managers who trust SyncBeds to manage their vacation rentals.",
                "hr": "Pridružite se tisućama upravitelja nekretnina koji vjeruju SyncBedsu za upravljanje svojim smještajem.",
                "de": "Schließen Sie sich Tausenden von Immobilienverwaltern an, die SyncBeds vertrauen."
            },
            "button_text": {
                "en": "Start free trial",
                "hr": "Započni besplatno",
                "de": "Kostenlos testen"
            },
            "button_url": "/pricing",
            "background_color": "primary"
        }
    },
    # 6. Channel Manager Section (Content Block)
    {
        "id": "channel-manager-section",
        "section_type": "content",
        "order": 5,
        "visible": True,
        "content": {
            "headline": {
                "en": "MyRent Channel Manager",
                "hr": "MyRent Channel Manager",
                "de": "MyRent Channel Manager"
            },
            "headline_highlight": {
                "en": "Channel Manager",
                "hr": "Channel Manager",
                "de": "Channel Manager"
            },
            "headline_highlight_color": "primary",
            "body": {
                "en": "Our channel manager automatically synchronizes your availability, rates, and bookings across all connected platforms. Say goodbye to overbookings and manual updates.",
                "hr": "Naš channel manager automatski sinkronizira vašu dostupnost, cijene i rezervacije na svim povezanim platformama. Recite zbogom prebukiranosti i ručnim ažuriranjima.",
                "de": "Unser Channel Manager synchronisiert automatisch Ihre Verfügbarkeit, Preise und Buchungen auf allen verbundenen Plattformen."
            },
            "image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
            "layout": "image-right"
        }
    },
    # 7. Modules Grid (Benefits Grid)
    {
        "id": "modules-grid",
        "section_type": "benefits_grid",
        "order": 6,
        "visible": True,
        "content": {
            "headline": {
                "en": "Complete Suite of Tools",
                "hr": "Kompletan paket alata",
                "de": "Komplettes Toolpaket"
            },
            "headline_highlight": {
                "en": "Suite of Tools",
                "hr": "paket alata",
                "de": "Toolpaket"
            },
            "headline_highlight_color": "primary",
            "items": [
                {
                    "icon": "RefreshCw",
                    "title": {"en": "Channel Manager", "hr": "Channel Manager", "de": "Channel Manager"},
                    "description": {"en": "Sync with 200+ OTAs", "hr": "Sinkroniziraj s 200+ OTA platformi", "de": "Sync mit 200+ OTAs"}
                },
                {
                    "icon": "Users",
                    "title": {"en": "eVisitor", "hr": "eVisitor", "de": "eVisitor"},
                    "description": {"en": "Automatic guest registration", "hr": "Automatska prijava gostiju", "de": "Automatische Gästeregistrierung"}
                },
                {
                    "icon": "Globe",
                    "title": {"en": "Website Builder", "hr": "Web stranica", "de": "Website Builder"},
                    "description": {"en": "Direct booking website", "hr": "Web za direktne rezervacije", "de": "Direktbuchungs-Website"}
                },
                {
                    "icon": "Zap",
                    "title": {"en": "Smart Apartment", "hr": "Pametni apartman", "de": "Smart Apartment"},
                    "description": {"en": "IoT device integration", "hr": "Integracija IoT uređaja", "de": "IoT-Geräteintegration"}
                }
            ],
            "columns": 4
        }
    },
    # 8. Testimonials Section
    {
        "id": "testimonials",
        "section_type": "testimonials",
        "order": 7,
        "visible": True,
        "content": {
            "headline": {
                "en": "What Our Clients Say",
                "hr": "Što kažu naši klijenti",
                "de": "Was unsere Kunden sagen"
            },
            "headline_highlight": {
                "en": "Clients",
                "hr": "klijenti",
                "de": "Kunden"
            },
            "headline_highlight_color": "primary"
        }
    },
    # 9. FAQ Section
    {
        "id": "faq-section",
        "section_type": "faq",
        "order": 8,
        "visible": True,
        "content": {
            "headline": {
                "en": "Frequently Asked Questions",
                "hr": "Često postavljana pitanja",
                "de": "Häufig gestellte Fragen"
            },
            "headline_highlight": {
                "en": "Questions",
                "hr": "pitanja",
                "de": "Fragen"
            },
            "headline_highlight_color": "primary"
        }
    }
]

# Update home page with new sections
home["sections"] = sections
response = requests.put(f"{API_URL}/pages/{home_id}", json=home)
print(f"Updated home page: {response.status_code}")
print(response.json())
