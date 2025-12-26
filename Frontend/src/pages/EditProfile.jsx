import {
  Container,
  Box,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { uploadProfilePicture } from '../services/firebase';
import { updateProfile } from '../services/userService';

export default function EditProfile() {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();

  const [userName, setUserName] = useState(user?.userName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.profilePicture || '');
  const [profilePictureUrl, setProfilePictureUrl] = useState(user?.profilePicture || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Sync form fields when user data changes
  useEffect(() => {
    if (user) {
      setUserName(user.userName || '');
      setBio(user.bio || '');
      setMobile(user.mobile || '');
      setAvatarPreview(user.profilePicture || '');
      setProfilePictureUrl(user.profilePicture || '');
    }
  }, [user]);

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setError('');
      setUploading(true);
      const userId = user._id || user.id;
      const url = await uploadProfilePicture(file, userId);
      setProfilePictureUrl(url);
      setAvatarPreview(url);
    } catch (err) {
      setError('Failed to upload profile picture. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      setError('User not found. Please refresh and try again.');
      return;
    }

    try {
      setError('');
      setSaving(true);

      await updateProfile({
        userName: userName.trim(),
        bio: bio.trim(),
        mobile: mobile.trim() || undefined,
        profilePicture: profilePictureUrl || undefined,
      });

      // Refresh auth context so UI picks up updated user
      await checkAuth();
      // navigate(-1);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to update profile. Please try again.';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxW="800px" py={4}>
      <Heading size="lg" mb={4}>
        Edit Profile
      </Heading>
      <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
        <Box display="flex" flexDirection="column" gap={6}>
          {/* Avatar & Change photo */}
          <Box display="flex" alignItems="center" gap={4}>
            <Box
              width="80px"
              height="80px"
              borderRadius="full"
              bg="blue.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontSize="2xl"
              fontWeight="bold"
              overflow="hidden"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                (userName || user?.email || '?')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              )}
            </Box>
            <Box>
              <Text fontWeight="medium" mb={2}>
                Profile Picture
              </Text>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
              <Button
                as="label"
                htmlFor="avatar-upload"
                size="sm"
                colorScheme="blue"
                disabled={uploading || saving}
                style={{ cursor: uploading || saving ? 'not-allowed' : 'pointer' }}
              >
                {uploading ? 'Uploading...' : 'Change Photo'}
              </Button>
              <Text fontSize="xs" color="gray.500" mt={1}>
                JPG, PNG, or GIF. Recommended square image for best results.
              </Text>
            </Box>
          </Box>

          {/* Basic info */}
          <Box>
            <Text fontWeight="medium" mb={1}>
              Username
            </Text>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your display name"
              disabled={saving}
            />
          </Box>

          <Box>
            <Text fontWeight="medium" mb={1}>
              Bio
            </Text>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 300))}
              placeholder="Tell people a bit about yourself"
              rows={4}
              disabled={saving}
              maxLength={300}
            />
          </Box>

          {/* Read-only contact info */}
          <Box>
            <Text fontWeight="medium" mb={1}>
              Email (read-only)
            </Text>
            <Input value={user?.email || ''} readOnly bg="gray.50" />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Email cannot be changed here.
            </Text>
          </Box>

          <Box>
            <Text fontWeight="medium" mb={1}>
              Mobile
            </Text>
            <Input
              value={mobile}
              onChange={(e) => {
                // Only allow digits, max 10 characters
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                setMobile(value);
              }}
              placeholder="Enter 10-digit mobile number"
              disabled={saving}
              maxLength={10}
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              Enter your 10-digit mobile number (optional)
            </Text>
          </Box>

          {error && (
            <Box mt={2}>
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            </Box>
          )}

          {/* Actions */}
          <Box display="flex" justifyContent="flex-end" gap={3} mt={6}>
            <Button onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave} disabled={uploading || saving}>
              {saving ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <Spinner size="sm" /> <span>Saving...</span>
                </Box>
              ) : (
                'Save Changes'
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
