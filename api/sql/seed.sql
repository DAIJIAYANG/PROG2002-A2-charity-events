USE charityevents_db;

-- Organizations
INSERT INTO organizations (name, mission, email, phone, website, address) VALUES
('Brisbane Helping Hands', 'Supporting local health and education initiatives across Brisbane.', 'info@bhh.org.au', '07 3000 0001', 'https://bhh.example.org', '123 Queen St, Brisbane QLD'),
('Gold Coast Care', 'Providing food security and shelter assistance to families on the Gold Coast.', 'hello@gccare.org.au', '07 5500 0002', 'https://gccare.example.org', '88 Marine Pde, Southport QLD');

-- Categories
INSERT INTO categories (name, slug) VALUES
('Fun Run', 'fun-run'),
('Gala Dinner', 'gala-dinner'),
('Silent Auction', 'silent-auction'),
('Benefit Concert', 'benefit-concert'),
('Community Fair', 'community-fair');

-- Events (past and upcoming)
INSERT INTO events (org_id, category_id, name, purpose, description, location, start_datetime, end_datetime, image_url, ticket_price, goal_amount, raised_amount, is_suspended) VALUES
(1, 1, 'Spring River Fun Run', 'Raise funds for children''s health programs.', '5km and 10km fun run along the Brisbane River.', 'Kangaroo Point, Brisbane', '2025-10-11 07:00:00', '2025-10-11 12:00:00', 'https://picsum.photos/seed/funrun1/800/400', 25.00, 20000.00, 3500.00, 0),
(1, 4, 'Voices for Hope Concert', 'Support local mental health services.', 'An evening concert featuring local bands and choirs.', 'QUT Gardens Theatre, Brisbane', '2025-11-15 18:30:00', '2025-11-15 21:30:00', 'https://picsum.photos/seed/concert1/800/400', 35.00, 30000.00, 12000.00, 0),
(2, 2, 'Gold Coast Gala Night', 'Funding emergency accommodation.', 'Formal dinner with keynote speakers and live band.', 'HOTA, Surfers Paradise', '2025-10-25 18:00:00', '2025-10-25 22:30:00', 'https://picsum.photos/seed/gala1/800/400', 120.00, 50000.00, 9000.00, 0),
(2, 5, 'Community Giving Fair', 'Food pantry and school supplies drive.', 'Family-friendly stalls, games and live performances.', 'Kurrawa Park, Broadbeach', '2025-09-27 10:00:00', '2025-09-27 16:00:00', 'https://picsum.photos/seed/fair1/800/400', 0.00, 10000.00, 1500.00, 0),
(1, 3, 'Silent Auction for Schools', 'IT equipment for low-income schools.', 'Bid on donated items from local businesses.', 'City Hall, Brisbane', '2025-08-10 18:00:00', '2025-08-10 20:00:00', 'https://picsum.photos/seed/auction1/800/400', 0.00, 15000.00, 15000.00, 0),
(1, 1, 'City Lights Night Run', 'Support after-school programs.', 'Night run on a safe, lit course near the river.', 'South Bank, Brisbane', '2025-07-20 18:30:00', '2025-07-20 21:00:00', 'https://picsum.photos/seed/funrun2/800/400', 20.00, 12000.00, 12000.00, 0),
(2, 4, 'Sounds of the Coast Concert', 'Music therapy for seniors.', 'Outdoor concert featuring local artists.', 'Burleigh Heads Hill, Gold Coast', '2025-06-01 16:00:00', '2025-06-01 19:00:00', 'https://picsum.photos/seed/concert2/800/400', 15.00, 8000.00, 8200.00, 0),
(2, 2, 'Seaside Charity Gala', 'Scholarships for vocational training.', 'Sea-view gala dinner with auctions.', 'The Star Gold Coast, Broadbeach', '2025-12-05 18:00:00', '2025-12-05 23:00:00', 'https://picsum.photos/seed/gala2/800/400', 150.00, 70000.00, 5000.00, 0),
(1, 1, 'Policy Breach Test Event', 'Should be hidden on site.', 'This event is suspended due to policy violation.', 'Undisclosed', '2025-10-10 10:00:00', '2025-10-10 12:00:00', 'https://picsum.photos/seed/suspended/800/400', 10.00, 5000.00, 0.00, 1);
