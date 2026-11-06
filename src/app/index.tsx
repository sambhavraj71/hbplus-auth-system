import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { auth } from '../config/auth';

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

// =====================================
// AUTHORIZED EMAIL CONFIGURATION
// =====================================

const ALLOWED_DOMAIN = 'hbplus.fit';

const TEST_EMAILS = [
  'sambhavraj83@gmail.com',
];

const isAuthorizedEmail = (email) => {
  if (!email) return false;
  const normalizedEmail = email.trim().toLowerCase();
  return (
    normalizedEmail.endsWith(`@${ALLOWED_DOMAIN}`) ||
    TEST_EMAILS.includes(normalizedEmail)
  );
};

// =====================================
// MAIN COMPONENT
// =====================================

export default function LoginScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState('');

  // =====================================
  // CHECK AUTHENTICATION SESSION
  // =====================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setCheckingAuth(false);
        return;
      }

      if (!isAuthorizedEmail(currentUser.email)) {
        try {
          await signOut(auth);
        } catch (e) {
          console.error('Auto signout error:', e);
        }
        setUser(null);
        setError('Access restricted. Please login using your official domain email.');
        setCheckingAuth(false);
        return;
      }

      setUser(currentUser);
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  // =====================================
  // GOOGLE LOGIN
  // =====================================

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;

      if (!isAuthorizedEmail(loggedInUser.email)) {
        await signOut(auth);
        setUser(null);
        setError('Access restricted. Please login using your official domain email.');
        return;
      }

      setUser(loggedInUser);
    } catch (err) {
      console.error('Google Login Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google login was cancelled.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Please allow popups in your browser.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with a different sign-in method.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOGOUT (FIXED & HARDENED)
  // =====================================

  const handleLogout = async () => {
    console.log('[Auth] Logout clicked');
    try {
      setLoading(true);
      await signOut(auth);
      console.log('[Auth] Firebase signOut complete');
      setUser(null);
      setError('');
    } catch (err) {
      console.error('[Auth] Logout error:', err);
      setError('Unable to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // AUTH LOADING SCREEN
  // =====================================

  if (checkingAuth) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#173B70" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  // =====================================
  // HB+ WELLNESS DASHBOARD
  // =====================================

  if (user) {
    const userInitial = (user.displayName || user.email || 'U').charAt(0).toUpperCase();

    return (
      <View style={styles.dashboardContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

        {/* Top Navbar with explicit zIndex & elevation */}
        <View style={styles.header}>
          <View style={styles.brandGroup}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>HB+</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>HBPlus Wellness</Text>
              <Text style={styles.brandTagline}>Integrated Health Ecosystem</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.headerLogoutBtn,
              pressed && { opacity: 0.7 },
              loading && styles.disabledButton,
            ]}
            onPress={handleLogout}
            disabled={loading}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.headerLogoutText}>Logout</Text>
            )}
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome User Card */}
          <View style={styles.userBanner}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userInitial}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userNameText}>{user.displayName || 'HB+ Member'}</Text>
              <Text style={styles.userEmailText}>{user.email}</Text>
            </View>
          </View>

          {/* Development Testing Badge */}
          {user.email?.toLowerCase() === 'sambhavraj83@gmail.com' && (
            <View style={styles.testBadge}>
              <Text style={styles.testBadgeText}>🛠 Active Development Testing Account</Text>
            </View>
          )}

          {/* Core Philosophy Banner */}
          <View style={styles.philosophyCard}>
            <Text style={styles.philosophyHeading}>Beyond Fitness: Body, Mind & Gut</Text>
            <Text style={styles.philosophyBody}>
              Real health lives at the intersection of body, mind, and gut. HB+ is designed
              around real human needs — combining science-backed assessments with expert-led
              support across movement, nutrition, recovery, and mental wellbeing.
            </Text>
            <Text style={styles.philosophySub}>
              Every wellness journey is fully personalised to your lifestyle, health history, and goals.
            </Text>
          </View>

          {/* Quick Metrics Section */}
          <Text style={styles.sectionHeader}>Today's Wellness Snapshot</Text>
          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, { borderLeftColor: '#2563EB' }]}>
              <Text style={styles.metricLabel}>Movement</Text>
              <Text style={styles.metricValue}>45 mins</Text>
              <Text style={styles.metricSub}>Strength & Mobility</Text>
            </View>

            <View style={[styles.metricCard, { borderLeftColor: '#16A34A' }]}>
              <Text style={styles.metricLabel}>Nutrition & Gut</Text>
              <Text style={styles.metricValue}>On Track</Text>
              <Text style={styles.metricSub}>Personalised Meal Plan</Text>
            </View>

            <View style={[styles.metricCard, { borderLeftColor: '#9333EA' }]}>
              <Text style={styles.metricLabel}>Recovery</Text>
              <Text style={styles.metricValue}>7.5 hrs</Text>
              <Text style={styles.metricSub}>Restorative Sleep</Text>
            </View>

            <View style={[styles.metricCard, { borderLeftColor: '#F59E0B' }]}>
              <Text style={styles.metricLabel}>Mind & Stress</Text>
              <Text style={styles.metricValue}>Balanced</Text>
              <Text style={styles.metricSub}>Guided Breathing Done</Text>
            </View>
          </View>

          {/* Core Ecosystem Pillars */}
          <Text style={styles.sectionHeader}>Integrated Ecosystem Pillars</Text>

          <View style={styles.pillarCard}>
            <View style={styles.pillarHeader}>
              <Text style={styles.pillarTitle}>1. Science-Backed Assessments</Text>
              <Text style={styles.pillarTag}>Active</Text>
            </View>
            <Text style={styles.pillarText}>
              Comprehensive biomarker and physical screening to map your metabolic, muscular, and gut profile.
            </Text>
          </View>

          <View style={styles.pillarCard}>
            <View style={styles.pillarHeader}>
              <Text style={styles.pillarTitle}>2. Multi-Domain Specialists</Text>
              <Text style={styles.pillarTag}>Assigned</Text>
            </View>
            <Text style={styles.pillarText}>
              Direct collaborative check-ins with exercise physiologists, certified clinical dietitians, and mental health mentors.
            </Text>
          </View>

          <View style={styles.pillarCard}>
            <View style={styles.pillarHeader}>
              <Text style={styles.pillarTitle}>3. Sustainable Habit Building</Text>
              <Text style={styles.pillarTag}>In Progress</Text>
            </View>
            <Text style={styles.pillarText}>
              Micro-interventions tailored directly around your day-to-day commitments for long-term consistency.
            </Text>
          </View>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <Pressable style={styles.primaryActionBtn}>
              <Text style={styles.primaryActionBtnText}>Consult Specialist</Text>
            </Pressable>
            <Pressable style={styles.secondaryActionBtn}>
              <Text style={styles.secondaryActionBtnText}>View Full Plan</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  // =====================================
  // LOGIN SCREEN
  // =====================================

  return (
    <View style={styles.centerContainer}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.loginCard}>
        {/* Brand */}
        <View style={styles.brandIconBox}>
          <Text style={styles.brandIconText}>HB+</Text>
        </View>

        <Text style={styles.heading}>Welcome to HBPlus</Text>
        <Text style={styles.subtitle}>
          Sign in with your official account to access your personalised ecosystem.
        </Text>

        {/* Google Login Button */}
        <Pressable
          style={[styles.googleButton, loading && styles.disabledButton]}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#173B70" />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.buttonText}>Continue with Google</Text>
            </>
          )}
        </Pressable>

        {/* Error Message */}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Domain Notice */}
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            🔒 Only @hbplus.fit and approved developer accounts are allowed.
          </Text>
        </View>

        <Text style={styles.footer}>
          Secure authentication powered by Google & Firebase
        </Text>
      </View>
    </View>
  );
}

// =====================================
// STYLES
// =====================================

const styles = StyleSheet.create({
  // Global & Login Styles
  centerContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 14,
    color: '#64748B',
    fontSize: 14,
  },
  loginCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  brandIconBox: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandIconText: {
    color: '#38BDF8',
    fontSize: 26,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  googleButton: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.6,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  notice: {
    marginTop: 22,
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    width: '100%',
  },
  noticeText: {
    color: '#1D4ED8',
    fontSize: 12,
    textAlign: 'center',
  },
  errorBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    width: '100%',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    textAlign: 'center',
  },
  footer: {
    marginTop: 24,
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'center',
  },

  // Dashboard Styles
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 18,
    zIndex: 100, // Keeps header always on top of scroll views
    elevation: 10, // Android elevation priority
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  logoBadgeText: {
    color: '#38BDF8',
    fontWeight: 'bold',
    fontSize: 16,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  brandTagline: {
    color: '#94A3B8',
    fontSize: 11,
  },
  headerLogoutBtn: {
    backgroundColor: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 110,
    elevation: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogoutText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  userBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userNameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  userEmailText: {
    fontSize: 13,
    color: '#64748B',
  },
  testBadge: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  testBadgeText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },
  philosophyCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  philosophyHeading: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  philosophyBody: {
    color: '#E2E8F0',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
  },
  philosophySub: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },
  metricSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  pillarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pillarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  pillarTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  pillarTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pillarText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  primaryActionBtn: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryActionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryActionBtnText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
  },
});