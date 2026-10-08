import { useCallback, useEffect, useState } from "react";
import { api, clearSession, getSavedUser, getToken, saveSession } from "../../api";
import "./BusinessPortal.css";

const emptyBooking = { preferredDate: "", eventType: "", location: "", phone: "", details: "", package: "" };
const emptyAuthForm = { name: "", email: "", password: "", confirmPassword: "" };

const BusinessPortal = () => {
  const [user, setUser] = useState(getSavedUser());
  const [portalView, setPortalView] = useState("client");
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [booking, setBooking] = useState(emptyBooking);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "", bio: "" });
  const [status, setStatus] = useState({ loading: false, message: "" });

  const syncProfileForm = useCallback((currentUser) => {
    setProfileForm({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      bio: currentUser?.bio || "",
    });
  }, []);

  useEffect(() => {
    syncProfileForm(user);
  }, [syncProfileForm, user]);

  const loadWorkspace = useCallback(async () => {
    if (!user) return;
    setStatus({ loading: true, message: "" });

    try {
      const [bookingData, galleryData, messageData, notificationData] = await Promise.all([
        api("/bookings"),
        api("/galleries"),
        api("/communication/messages"),
        api("/communication/notifications"),
      ]);

      let nextBookings = bookingData.bookings || [];
      if (user.role === "admin") {
        const adminBookings = await api("/bookings/admin/all");
        nextBookings = adminBookings.bookings || [];
      }

      setBookings(nextBookings);
      setGalleries(galleryData.galleries || []);
      setMessages(messageData.messages || []);
      setNotifications(notificationData.notifications || []);
    } catch (error) {
      setStatus({ loading: false, message: error.message });
      return;
    }

    setStatus({ loading: false, message: "" });
  }, [user]);

  useEffect(() => {
    api("/catalog/packages").then((data) => setPackages(data.packages || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(loadWorkspace, 0);
    return () => window.clearTimeout(timer);
  }, [loadWorkspace]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: "" });

    try {
      if (portalView === "client" && authMode === "register") {
        if (!authForm.name.trim() || !authForm.email.trim() || !authForm.password.trim()) {
          throw new Error("Full name, email and password are required.");
        }

        if (authForm.password !== authForm.confirmPassword) {
          throw new Error("Passwords do not match.");
        }
      }

      const requestPath = portalView === "admin" ? "/auth/admin/login" : `/auth/${authMode === "login" ? "login" : "register"}`;
      const requestPayload = portalView === "admin"
        ? { email: authForm.email, password: authForm.password, role: "admin" }
        : authMode === "register"
          ? { name: authForm.name, email: authForm.email, password: authForm.password, confirmPassword: authForm.confirmPassword }
          : { email: authForm.email, password: authForm.password };

      const data = await api(requestPath, {
        method: "POST",
        body: JSON.stringify(requestPayload),
      });

      saveSession(data);
      setUser(data.user);
      setPortalView(data.user.role === "admin" ? "admin" : "client");
      setAuthForm(emptyAuthForm);
      setStatus({ loading: false, message: "" });
    } catch (error) {
      setStatus({ loading: false, message: error.message });
    }
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: "" });

    try {
      const data = await api("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
          bio: profileForm.bio,
        }),
      });

      setUser(data.user);
      saveSession({ user: data.user, token: data.token || getToken() || "" });
      setStatus({ loading: false, message: "Profile updated successfully." });
    } catch (error) {
      setStatus({ loading: false, message: error.message });
    }
  };

  const handleBooking = async (event) => {
    event.preventDefault();
    try {
      await api("/bookings", { method: "POST", body: JSON.stringify(booking) });
      setBooking(emptyBooking);
      setStatus({ loading: false, message: "Booking request sent. We will confirm the date shortly." });
      loadWorkspace();
    } catch (error) {
      setStatus({ loading: false, message: error.message });
    }
  };

  const updateBookingStatus = async (id, nextStatus) => {
    try {
      await api(`/bookings/${id}`, { method: "PATCH", body: JSON.stringify({ status: nextStatus }) });
      loadWorkspace();
    } catch (error) {
      setStatus({ loading: false, message: error.message });
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!messageText.trim()) return;

    try {
      await api("/communication/messages", { method: "POST", body: JSON.stringify({ text: messageText }) });
      setMessageText("");
      loadWorkspace();
    } catch (error) {
      setStatus({ loading: false, message: error.message });
    }
  };

  const signOut = () => {
    clearSession();
    setUser(null);
    setBookings([]);
    setGalleries([]);
    setMessages([]);
    setNotifications([]);
    setPortalView("client");
    setAuthMode("login");
    setAuthForm(emptyAuthForm);
    setStatus({ loading: false, message: "" });
  };

  return (
    <section id="portal" className="business-portal">
      <div className="portal-heading">
        <span>MR.KEMREWALA STUDIO</span>
        <h2>Plan the next frame.</h2>
        <p>Book a session, review your gallery, and keep every detail in one quiet workspace.</p>
      </div>

      {!user ? (
        <div className="portal-auth">
          <div className="portal-auth-copy">
            <span>{portalView === "admin" ? "ADMIN PORTAL" : "CLIENT PORTAL"}</span>
            <h3>{portalView === "admin" ? "Secure studio access" : "Your photography, thoughtfully managed."}</h3>
            <p>
              {portalView === "admin"
                ? "Studio-only access is guarded behind a secure admin login and cannot be created from the public sign-up form."
                : "Create an account to request a date and follow your project from first conversation to final delivery."}
            </p>
          </div>

          <div className="portal-toggle">
            <button type="button" className={portalView === "client" ? "is-active" : ""} onClick={() => { setPortalView("client"); setAuthMode("login"); setAuthForm(emptyAuthForm); }}>Client</button>
            <button type="button" className={portalView === "admin" ? "is-active" : ""} onClick={() => { setPortalView("admin"); setAuthMode("login"); setAuthForm(emptyAuthForm); }}>Admin</button>
          </div>

          <form className="portal-form" onSubmit={handleAuth}>
            {portalView === "client" && authMode === "register" && (
              <input
                placeholder="Full name"
                value={authForm.name}
                onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                required
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              value={authForm.email}
              onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
              required
            />

            <input
              type="password"
              minLength={8}
              placeholder="Password"
              value={authForm.password}
              onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
              required
            />

            {portalView === "client" && authMode === "register" && (
              <input
                type="password"
                minLength={8}
                placeholder="Confirm password"
                value={authForm.confirmPassword}
                onChange={(event) => setAuthForm({ ...authForm, confirmPassword: event.target.value })}
                required
              />
            )}

            <button type="submit">{status.loading ? "Please wait..." : portalView === "admin" ? "Admin sign in" : authMode === "login" ? "Sign in" : "Create account"}</button>

            {portalView === "client" && (
              <button type="button" className="portal-text-button" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
                {authMode === "login" ? "New client? Create an account" : "Already registered? Sign in"}
              </button>
            )}

            {portalView === "admin" && (
              <p className="portal-note">Admin accounts are created securely in the backend and cannot be set from the public registration form.</p>
            )}

            {status.message && <p className="portal-feedback">{status.message}</p>}
          </form>
        </div>
      ) : (
        <div className="portal-workspace">
          <div className="portal-toolbar">
            <div>
              <span>WELCOME BACK</span>
              <h3>{user.name}</h3>
            </div>
            <button type="button" className="portal-outline-button" onClick={signOut}>Sign out</button>
          </div>

          <div className="portal-grid">
            {user.role === "client" && (
              <form className="portal-panel booking-form" onSubmit={handleBooking}>
                <div className="panel-heading"><span>NEW REQUEST</span><h3>Book a shoot</h3></div>
                <select value={booking.package} onChange={(event) => setBooking({ ...booking, package: event.target.value })}>
                  <option value="">Choose a package</option>
                  {packages.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <input type="date" value={booking.preferredDate} onChange={(event) => setBooking({ ...booking, preferredDate: event.target.value })} required />
                <input placeholder="Event type" value={booking.eventType} onChange={(event) => setBooking({ ...booking, eventType: event.target.value })} required />
                <input placeholder="Event location" value={booking.location} onChange={(event) => setBooking({ ...booking, location: event.target.value })} required />
                <input type="tel" placeholder="Phone number" value={booking.phone} onChange={(event) => setBooking({ ...booking, phone: event.target.value })} required />
                <textarea placeholder="Tell us about the day" value={booking.details} onChange={(event) => setBooking({ ...booking, details: event.target.value })} rows="4" />
                <button type="submit">Send booking request</button>
                {status.message && <p className="portal-feedback">{status.message}</p>}
              </form>
            )}

            <div className="portal-panel">
              <div className="panel-heading">
                <span>{user.role === "admin" ? "OPERATIONS" : "YOUR PROJECTS"}</span>
                <h3>{user.role === "admin" ? "Booking requests" : "Bookings"}</h3>
              </div>
              <div className="portal-list">
                {bookings.length === 0 ? (
                  <p className="portal-empty">No bookings yet.</p>
                ) : (
                  bookings.map((item) => (
                    <article className="portal-list-item" key={item._id}>
                      <div>
                        <strong>{item.eventType}</strong>
                        <p>{new Date(item.preferredDate).toLocaleDateString()} ? {item.location}</p>
                        {user.role === "admin" && <small>{item.client?.name} ? {item.client?.email}</small>}
                      </div>
                      <div className="booking-status">
                        <span className={`status-${item.status.toLowerCase()}`}>{item.status}</span>
                        {user.role === "admin" && item.status === "PENDING" && (
                          <div className="status-actions">
                            <button type="button" onClick={() => updateBookingStatus(item._id, "CONFIRMED")}>Confirm</button>
                            <button type="button" onClick={() => updateBookingStatus(item._id, "REJECTED")}>Reject</button>
                          </div>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className="portal-panel">
              <div className="panel-heading"><span>PRIVATE DELIVERY</span><h3>Galleries</h3></div>
              {galleries.length === 0 ? (
                <p className="portal-empty">Published galleries will appear here.</p>
              ) : (
                galleries.map((gallery) => (
                  <div className="gallery-summary" key={gallery._id}>
                    <strong>{gallery.title}</strong>
                    <span>{gallery.photos?.length || 0} photographs</span>
                    <div className="gallery-thumbs">
                      {(gallery.photos || []).slice(0, 4).map((photo) => (
                        <img key={photo._id} src={photo.url} alt={photo.title || "Gallery photograph"} loading="lazy" />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="portal-panel">
              <div className="panel-heading"><span>DIRECT LINE</span><h3>Messages</h3></div>
              <div className="message-list">
                {messages.length === 0 ? (
                  <p className="portal-empty">Start a conversation about your project.</p>
                ) : (
                  messages.map((item) => (
                    <p key={item._id} className={item.sender?._id === user.id ? "message-own" : ""}>
                      {item.text}
                    </p>
                  ))
                )}
              </div>
              <form className="message-form" onSubmit={sendMessage}>
                <input placeholder="Write a message" value={messageText} onChange={(event) => setMessageText(event.target.value)} />
                <button type="submit" aria-label="Send message">?</button>
              </form>
            </div>

            <div className="portal-panel">
              <div className="panel-heading"><span>PROFILE</span><h3>Account details</h3></div>
              <form className="profile-form" onSubmit={handleProfileUpdate}>
                <input
                  placeholder="Full name"
                  value={profileForm.name}
                  onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={profileForm.email}
                  onChange={(event) => setProfileForm({ ...profileForm, email: event.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={profileForm.phone}
                  onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })}
                />
                <textarea
                  placeholder="Tell us more about your story"
                  rows="4"
                  value={profileForm.bio}
                  onChange={(event) => setProfileForm({ ...profileForm, bio: event.target.value })}
                />
                <button type="submit">Save changes</button>
                {status.message && <p className="portal-feedback">{status.message}</p>}
              </form>
            </div>
          </div>

          <div className="portal-notifications">
            <span>NOTIFICATIONS</span>
            {notifications.length === 0 ? <p>Nothing new.</p> : notifications.slice(0, 4).map((item) => <p key={item._id}>{item.message}</p>)}
          </div>
        </div>
      )}
    </section>
  );
};

export default BusinessPortal;
