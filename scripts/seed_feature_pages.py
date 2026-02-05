import requests
import json

API_URL = "http://localhost:8001/api"

# Feature pages content based on SyncBeds product
feature_pages = {
    "channel-manager": {
        "title": {"en": "Channel Manager", "hr": "Channel Manager", "de": "Channel Manager"},
        "meta_description": {
            "en": "Sync all your OTA channels in real-time with SyncBeds Channel Manager.",
            "hr": "Sinkronizirajte sve OTA kanale u stvarnom vremenu sa SyncBeds Channel Managerom.",
            "de": "Synchronisieren Sie alle OTA-Kanäle in Echtzeit mit SyncBeds Channel Manager."
        },
        "sections": [
            {
                "id": "cm-hero",
                "section_type": "hero_2",
                "order": 0,
                "visible": True,
                "content": {
                    "subheadline": {"en": "CHANNEL MANAGER", "hr": "CHANNEL MANAGER", "de": "CHANNEL MANAGER"},
                    "headline": {"en": "One Channel Manager to Rule Them All", "hr": "Jedan Channel Manager za sve", "de": "Ein Channel Manager für alles"},
                    "headline_highlight": {"en": "Channel Manager", "hr": "Channel Manager", "de": "Channel Manager"},
                    "headline_highlight_color": "primary",
                    "body": {"en": "Connect with Booking.com, Airbnb, Expedia and 200+ OTAs. Sync availability, rates and bookings in real-time.", "hr": "Povežite se s Booking.com, Airbnb, Expedia i 200+ OTA platformi. Sinkronizirajte dostupnost, cijene i rezervacije u stvarnom vremenu."},
                    "button_text": {"en": "Start Free Trial", "hr": "Započni besplatno"},
                    "button_url": "/pricing",
                    "image_url": "/api/uploads/c6a85a435a144182bd63cb3be561024c.png",
                    "background_color": "white"
                }
            },
            {
                "id": "cm-features",
                "section_type": "features_list",
                "order": 1,
                "visible": True,
                "content": {
                    "headline": {"en": "Why Choose Our Channel Manager?", "hr": "Zašto odabrati naš Channel Manager?"},
                    "layout": "cards",
                    "items": [
                        {"icon": "RefreshCw", "title": {"en": "Real-time Sync"}, "description": {"en": "Instant synchronization across all platforms. No delays, no double bookings."}},
                        {"icon": "Globe", "title": {"en": "200+ Channels"}, "description": {"en": "Connect to Booking.com, Airbnb, Expedia, Vrbo, TripAdvisor, and many more."}},
                        {"icon": "BarChart", "title": {"en": "Dynamic Pricing"}, "description": {"en": "Set rules to automatically adjust rates based on demand, season, or occupancy."}},
                        {"icon": "Shield", "title": {"en": "Prevent Overbookings"}, "description": {"en": "Our system ensures your calendar is always accurate across all channels."}}
                    ]
                }
            },
            {
                "id": "cm-cta",
                "section_type": "cta",
                "order": 2,
                "visible": True,
                "content": {
                    "headline": {"en": "Ready to Simplify Your Channel Management?"},
                    "body": {"en": "Join thousands of property managers who trust SyncBeds."},
                    "button_text": {"en": "Get Started"},
                    "button_url": "/pricing",
                    "background_color": "primary"
                }
            }
        ]
    },
    "evisitor": {
        "title": {"en": "eVisitor Integration", "hr": "eVisitor Integracija", "de": "eVisitor Integration"},
        "meta_description": {
            "en": "Automatic guest registration for Croatian tourism with eVisitor integration.",
            "hr": "Automatska prijava gostiju za hrvatski turizam s eVisitor integracijom."
        },
        "sections": [
            {
                "id": "ev-hero",
                "section_type": "hero_2",
                "order": 0,
                "visible": True,
                "content": {
                    "subheadline": {"en": "EVISITOR INTEGRATION", "hr": "EVISITOR INTEGRACIJA"},
                    "headline": {"en": "Automatic Guest Registration for Croatian Tourism", "hr": "Automatska prijava gostiju za hrvatski turizam"},
                    "headline_highlight": {"en": "Automatic Guest Registration", "hr": "Automatska prijava gostiju"},
                    "headline_highlight_color": "primary",
                    "body": {"en": "Automatically register all your guests with the Croatian eVisitor system. Save hours of manual work and stay compliant.", "hr": "Automatski prijavite sve goste u hrvatski eVisitor sustav. Uštedite sate ručnog rada i ostanite usklađeni."},
                    "button_text": {"en": "Learn More", "hr": "Saznaj više"},
                    "button_url": "/contact",
                    "image_url": "/api/uploads/f0e9959d1dab4524986d035f4fe7bc69.png",
                    "background_color": "white"
                }
            },
            {
                "id": "ev-features",
                "section_type": "features_list",
                "order": 1,
                "visible": True,
                "content": {
                    "headline": {"en": "eVisitor Features", "hr": "eVisitor značajke"},
                    "layout": "cards",
                    "items": [
                        {"icon": "Users", "title": {"en": "Automatic Registration"}, "description": {"en": "Guest data is automatically sent to eVisitor when a booking is confirmed."}},
                        {"icon": "Clock", "title": {"en": "Save Time"}, "description": {"en": "No more manual data entry. Everything is synchronized automatically."}},
                        {"icon": "Shield", "title": {"en": "Stay Compliant"}, "description": {"en": "Meet all Croatian tourism regulations without the hassle."}},
                        {"icon": "Check", "title": {"en": "Error-Free"}, "description": {"en": "Reduce human errors with automated data transfer."}}
                    ]
                }
            }
        ]
    },
    "website": {
        "title": {"en": "Website Builder", "hr": "Web Stranica", "de": "Website Builder"},
        "meta_description": {
            "en": "Create your direct booking website with SyncBeds Website Builder.",
            "hr": "Kreirajte svoju web stranicu za direktne rezervacije sa SyncBeds Website Builderom."
        },
        "sections": [
            {
                "id": "web-hero",
                "section_type": "hero_2",
                "order": 0,
                "visible": True,
                "content": {
                    "subheadline": {"en": "WEBSITE BUILDER", "hr": "WEB STRANICA"},
                    "headline": {"en": "Your Own Direct Booking Website", "hr": "Vaša vlastita web stranica za direktne rezervacije"},
                    "headline_highlight": {"en": "Direct Booking Website", "hr": "web stranica za direktne rezervacije"},
                    "headline_highlight_color": "primary",
                    "body": {"en": "Create a professional booking website for your properties. Accept direct bookings and save on OTA commissions.", "hr": "Kreirajte profesionalnu web stranicu za rezervacije vaših nekretnina. Prihvaćajte direktne rezervacije i uštedite na OTA provizijama."},
                    "button_text": {"en": "Get Started", "hr": "Započni"},
                    "button_url": "/pricing",
                    "image_url": "/api/uploads/3a367ec2f06e495eae32bdaa42d171d9.png",
                    "background_color": "white"
                }
            },
            {
                "id": "web-features",
                "section_type": "features_list",
                "order": 1,
                "visible": True,
                "content": {
                    "headline": {"en": "Website Features", "hr": "Značajke web stranice"},
                    "layout": "cards",
                    "items": [
                        {"icon": "Globe", "title": {"en": "Custom Domain"}, "description": {"en": "Use your own domain name for a professional look."}},
                        {"icon": "Calendar", "title": {"en": "Booking Engine"}, "description": {"en": "Integrated booking calendar with real-time availability."}},
                        {"icon": "BarChart", "title": {"en": "No Commissions"}, "description": {"en": "Accept direct bookings without paying OTA fees."}},
                        {"icon": "Zap", "title": {"en": "Mobile Optimized"}, "description": {"en": "Your website looks great on all devices."}}
                    ]
                }
            }
        ]
    },
    "smart-apartment": {
        "title": {"en": "Smart Apartment", "hr": "Pametni Apartman", "de": "Smart Apartment"},
        "meta_description": {
            "en": "IoT device integration for smart vacation rentals.",
            "hr": "Integracija IoT uređaja za pametni privatni smještaj."
        },
        "sections": [
            {
                "id": "sa-hero",
                "section_type": "hero_2",
                "order": 0,
                "visible": True,
                "content": {
                    "subheadline": {"en": "SMART APARTMENT", "hr": "PAMETNI APARTMAN"},
                    "headline": {"en": "Smart Locks and IoT Devices for Easier Stays", "hr": "Pametne brave i IoT uređaji za lakši boravak"},
                    "headline_highlight": {"en": "Smart Locks and IoT Devices", "hr": "Pametne brave i IoT uređaji"},
                    "headline_highlight_color": "primary",
                    "body": {"en": "Automate check-ins with smart locks. Control thermostats, lights, and more remotely.", "hr": "Automatizirajte prijave s pametnim bravama. Kontrolirajte termostate, svjetla i više na daljinu."},
                    "button_text": {"en": "Learn More", "hr": "Saznaj više"},
                    "button_url": "/contact",
                    "image_url": "/api/uploads/f0e9959d1dab4524986d035f4fe7bc69.png",
                    "background_color": "white"
                }
            },
            {
                "id": "sa-features",
                "section_type": "features_list",
                "order": 1,
                "visible": True,
                "content": {
                    "headline": {"en": "Smart Features", "hr": "Pametne značajke"},
                    "layout": "cards",
                    "items": [
                        {"icon": "Zap", "title": {"en": "Smart Locks"}, "description": {"en": "Generate unique codes for each guest. No physical key exchange needed."}},
                        {"icon": "Shield", "title": {"en": "Remote Access"}, "description": {"en": "Control and monitor your property from anywhere."}},
                        {"icon": "Clock", "title": {"en": "Automated Check-in"}, "description": {"en": "Guests receive access codes automatically before arrival."}},
                        {"icon": "BarChart", "title": {"en": "Energy Savings"}, "description": {"en": "Smart thermostats help reduce energy costs between guests."}}
                    ]
                }
            }
        ]
    },
    "pricing": {
        "title": {"en": "Pricing", "hr": "Cijene", "de": "Preise"},
        "meta_description": {"en": "SyncBeds pricing plans for every business size.", "hr": "SyncBeds cjenovni paketi za svaku veličinu poslovanja."},
        "sections": [
            {
                "id": "pr-hero",
                "section_type": "hero_2",
                "order": 0,
                "visible": True,
                "content": {
                    "subheadline": {"en": "PRICING", "hr": "CIJENE"},
                    "headline": {"en": "Simple, Transparent Pricing", "hr": "Jednostavne, transparentne cijene"},
                    "headline_highlight": {"en": "Transparent Pricing", "hr": "transparentne cijene"},
                    "headline_highlight_color": "primary",
                    "body": {"en": "Choose the plan that fits your needs. No hidden fees.", "hr": "Odaberite paket koji odgovara vašim potrebama. Bez skrivenih troškova."},
                    "background_color": "white"
                }
            }
        ]
    },
    "about": {
        "title": {"en": "About Us", "hr": "O nama", "de": "Über uns"},
        "meta_description": {"en": "Learn about SyncBeds and our mission.", "hr": "Saznajte više o SyncBedsu i našoj misiji."},
        "sections": [
            {
                "id": "ab-hero",
                "section_type": "hero_2",
                "order": 0,
                "visible": True,
                "content": {
                    "subheadline": {"en": "ABOUT US", "hr": "O NAMA"},
                    "headline": {"en": "We Help Property Managers Succeed", "hr": "Pomažemo upraviteljima nekretnina da uspiju"},
                    "headline_highlight": {"en": "Property Managers", "hr": "upraviteljima nekretnina"},
                    "headline_highlight_color": "primary",
                    "body": {"en": "SyncBeds was founded with a simple mission: to make vacation rental management easier for everyone.", "hr": "SyncBeds je osnovan s jednostavnom misijom: učiniti upravljanje privatnim smještajem lakšim za sve."},
                    "background_color": "white"
                }
            }
        ]
    }
}

# Update each feature page
for slug, page_data in feature_pages.items():
    # Get existing page
    response = requests.get(f"{API_URL}/pages/slug/{slug}")
    if response.status_code == 200:
        existing = response.json()
        page_id = existing['id']
        
        # Update with new content
        existing['title'] = page_data['title']
        existing['meta_description'] = page_data['meta_description']
        existing['sections'] = page_data['sections']
        
        update_response = requests.put(f"{API_URL}/pages/{page_id}", json=existing)
        print(f"Updated /{slug}: {update_response.status_code}")
    else:
        print(f"Page /{slug} not found, creating...")
        new_page = {
            "slug": slug,
            "title": page_data['title'],
            "meta_description": page_data['meta_description'],
            "sections": page_data['sections'],
            "published": True,
            "is_system_page": True
        }
        create_response = requests.post(f"{API_URL}/pages", json=new_page)
        print(f"Created /{slug}: {create_response.status_code}")

print("\nAll feature pages updated!")
