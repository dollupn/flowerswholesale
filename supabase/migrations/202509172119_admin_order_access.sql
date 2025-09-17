-- Allow admins to view all orders, order items, and profiles
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all order items"
ON public.order_items
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
