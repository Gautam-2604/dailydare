import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

type SplashScreenProps = {
  onFinish?: () => void;
};

const SplashScreenComponent = ({ onFinish }: SplashScreenProps) => {
  const [logoScale] = useState(new Animated.Value(0));
  const [logoOpacity] = useState(new Animated.Value(0));
  const [taglineOpacity] = useState(new Animated.Value(0));
  const [taglineY] = useState(new Animated.Value(30));
  const [particleAnimations] = useState(
    Array.from({ length: 12 }, () => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      scale: new Animated.Value(0),
      opacity: new Animated.Value(0.3),
    }))
  );
  const [glowPulse] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start animations sequence
    const startAnimations = () => {
      // Animate particles
      particleAnimations.forEach((particle, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(particle.scale, {
              toValue: 1,
              duration: 2000 + index * 200,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 0,
              duration: 2000,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        ).start();

        // Store the initial Y value for each particle
        const initialY = (particle.y as any).__getValue
          ? (particle.y as any).__getValue()
          : Math.random() * height;

        Animated.loop(
          Animated.timing(particle.y, {
            toValue: initialY - 100,
            duration: 4000 + index * 300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          })
        ).start();
      });

      // Animate glow pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowPulse, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowPulse, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Logo animation
      Animated.sequence([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Tagline animation (delayed)
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(taglineOpacity, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(taglineY, {
            toValue: 0,
            duration: 1000,
            easing: Easing.out(Easing.back(1.5)),
            useNativeDriver: true,
          }),
        ]).start();
      }, 1200);
    };

    startAnimations();

    // Auto-navigate after animation completes
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const glowScale = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const glowOpacity = glowPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      <LinearGradient
        colors={['#0A0A0A', '#1A1A2E', '#16213E', '#0F3460']}
        style={styles.background}
      >
        {/* Animated particles */}
        {particleAnimations.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                transform: [
                  { translateX: particle.x },
                  { translateY: particle.y },
                  { scale: particle.scale }
                ],
                opacity: particle.opacity,
              },
            ]}
          >
            <LinearGradient
              colors={['#4FFFB0', '#00D4AA']}
              style={styles.particleGradient}
            />
          </Animated.View>
        ))}

        {/* Main content */}
        <View style={styles.content}>
          {/* Logo section */}
          <View style={styles.logoContainer}>
            <Animated.View
              style={[
                styles.logoWrapper,
                {
                  transform: [{ scale: logoScale }],
                  opacity: logoOpacity,
                },
              ]}
            >
              {/* Glow effect */}
              <Animated.View
                style={[
                  styles.logoGlow,
                  {
                    transform: [{ scale: glowScale }],
                    opacity: glowOpacity,
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(79, 255, 176, 0.4)', 'rgba(79, 255, 176, 0.1)']}
                  style={styles.glowGradient}
                />
              </Animated.View>

              {/* Main logo */}
              <LinearGradient
                colors={['#4FFFB0', '#00D4AA', '#FF6B6B']}
                style={styles.logo}
              >
                <Text style={styles.logoText}>DD</Text>
              </LinearGradient>
            </Animated.View>

            <Animated.Text
              style={[
                styles.appName,
                {
                  opacity: logoOpacity,
                  transform: [{ scale: logoScale }],
                },
              ]}
            >
              Daily Dare
            </Animated.Text>
          </View>

          {/* Tagline */}
          <Animated.View
            style={[
              styles.taglineContainer,
              {
                opacity: taglineOpacity,
                transform: [{ translateY: taglineY }],
              },
            ]}
          >
            <Text style={styles.tagline}>Challenge Yourself</Text>
            <Text style={styles.subTagline}>Compete • Learn • Grow</Text>
          </Animated.View>
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <View style={styles.loadingContainer}>
            <LinearGradient
              colors={['rgba(79, 255, 176, 0.3)', 'rgba(79, 255, 176, 0.1)']}
              style={styles.loadingBar}
            >
              <Animated.View
                style={[
                  styles.loadingProgress,
                  {
                    opacity: glowOpacity,
                  },
                ]}
              >
                <LinearGradient
                  colors={['#4FFFB0', '#00D4AA']}
                  style={styles.progressGradient}
                />
              </Animated.View>
            </LinearGradient>
          </View>
          
          <Text style={styles.loadingText}>Loading your challenges...</Text>
          
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  background: {
    flex: 1,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
  },
  particleGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    top: -10,
    left: -10,
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4FFFB0',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0A0A0A',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
  },
  taglineContainer: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4FFFB0',
    textAlign: 'center',
    marginBottom: 8,
  },
  subTagline: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    letterSpacing: 1,
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 40,
  },
  loadingContainer: {
    width: 200,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
  },
  loadingBar: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  loadingProgress: {
    width: '100%',
    height: '100%',
  },
  progressGradient: {
    width: '100%',
    height: '100%',
  },
  loadingText: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
  },
});

export default SplashScreenComponent;