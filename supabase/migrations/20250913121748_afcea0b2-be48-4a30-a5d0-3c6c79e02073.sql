-- Make rahvi.bichon@gmail.com an admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('b63d4988-0e75-41fa-aa27-a2870b724d9a', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;