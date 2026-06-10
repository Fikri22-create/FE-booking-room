import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

/* AUTH */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

/* ADMIN */
import Dashboard from "./pages/admin/Dashboard";
import Rooms from "./pages/admin/Rooms";
import AddRoom from "./pages/admin/AddRoom";
import EditRoom from "./pages/admin/EditRoom";
import RoomGallery from "./pages/admin/RoomGallery";
import Bookings from "./pages/admin/Booking";
import Payments from "./pages/admin/Payment";
import Users from "./pages/admin/User";

/* USER */
import UserRooms from "./pages/user/Rooms";
import RoomDetail from "./pages/user/RoomDetail";
import BookingForm from "./pages/user/BookingForm";
import MyBookings from "./pages/user/MyBookings";
import PaymentUpload from "./pages/user/PaymentUpload";

/* LAYOUT */
import BaseLayout from "./layouts/BaseLayout";

/* ROUTE GUARD */
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* DEFAULT */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* AUTH */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ================= ADMIN ================= */}
                <Route path="/admin/dashboard" element={
                    <PrivateRoute>
                        <AdminRoute>
                            <BaseLayout>
                                <Dashboard />
                            </BaseLayout>
                        </AdminRoute>
                    </PrivateRoute>
                } />

                <Route path="/admin/rooms" element={
                    <PrivateRoute>
                        <AdminRoute>
                            <BaseLayout>
                                <Rooms />
                            </BaseLayout>
                        </AdminRoute>
                    </PrivateRoute>
                } />

                <Route path="/admin/rooms/add" element={
                    <PrivateRoute>
                        <AdminRoute>
                            <BaseLayout>
                                <AddRoom />
                            </BaseLayout>
                        </AdminRoute>
                    </PrivateRoute>
                } />

                <Route path="/admin/rooms/edit/:id" element={
                    <PrivateRoute>
                        <AdminRoute>
                            <BaseLayout>
                                <EditRoom />
                            </BaseLayout>
                        </AdminRoute>
                    </PrivateRoute>
                } />

                <Route path="/admin/rooms/gallery/:id" element={
                    <PrivateRoute>
                        <AdminRoute>
                            <BaseLayout>
                                <RoomGallery />
                            </BaseLayout>
                        </AdminRoute>
                    </PrivateRoute>
                } />

                <Route path="/admin/bookings" element={
                    <PrivateRoute>
                        <AdminRoute>
                            <BaseLayout>
                                <Bookings />
                            </BaseLayout>
                        </AdminRoute>
                    </PrivateRoute>
                } />

                <Route path="/admin/payments" element={
                    <PrivateRoute>
                        <AdminRoute>
                            <BaseLayout>
                                <Payments />
                            </BaseLayout>
                        </AdminRoute>
                    </PrivateRoute>
                } />

                <Route path="/admin/users" element={
                    <PrivateRoute>
                        <AdminRoute>
                            <BaseLayout>
                                <Users />
                            </BaseLayout>
                        </AdminRoute>
                    </PrivateRoute>
                } />

                {/* ================= USER ================= */}
                <Route path="/user/rooms" element={
                    <PrivateRoute>
                        <BaseLayout>
                            <UserRooms />
                        </BaseLayout>
                    </PrivateRoute>
                } />

                <Route path="/user/rooms/:id" element={
                    <PrivateRoute>
                        <BaseLayout>
                            <RoomDetail />
                        </BaseLayout>
                    </PrivateRoute>
                } />

                <Route path="/user/book/:id" element={
                    <PrivateRoute>
                        <BaseLayout>
                            <BookingForm />
                        </BaseLayout>
                    </PrivateRoute>
                } />

                <Route path="/user/my-bookings" element={
                    <PrivateRoute>
                        <BaseLayout>
                            <MyBookings />
                        </BaseLayout>
                    </PrivateRoute>
                } />

                <Route path="/user/payment/:bookingId" element={
                    <PrivateRoute>
                        <BaseLayout>
                            <PaymentUpload />
                        </BaseLayout>
                    </PrivateRoute>
                } />

            </Routes>
        </BrowserRouter>
    );
}