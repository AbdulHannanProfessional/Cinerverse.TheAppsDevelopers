import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, Palette, Shield, Mail, 
  Key, Webhook, Save, Bell
} from 'lucide-react';

export default function PlatformSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Demo',
    tagline: 'By The Apps Developers',
    darkMode: true,
    featuresEnabled: {
      reviews: true,
      graphs: true,
      collections: true,
      userProfiles: true
    }
  });

  const [contentRules, setContentRules] = useState({
    profanityFilter: true,
    aiModerationThreshold: 0.7,
    commentsEnabled: true,
    reportsEnabled: true,
    autoModeration: false
  });

  const [emailSettings, setEmailSettings] = useState({
    welcomeEmail: true,
    reviewApprovalEmail: true,
    weeklyDigest: false,
    customTemplate: ''
  });

  const [apiSettings, setApiSettings] = useState({
    apiKey: '••••••••••••••••',
    webhookUrl: '',
    tmdbIntegration: true,
    rateLimitPerHour: 1000
  });

  const handleSave = (section) => {
    alert(`${section} settings saved successfully!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#E8E8E8] mb-2">Platform Settings</h1>
        <p className="text-[#8B92A8]">Configure your platform settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-[#1A1F2E] border border-[#2A3144]">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Content Rules
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email & Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API & Integrations
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="bg-[#1A1F2E] border-[#2A3144]">
            <CardHeader>
              <CardTitle className="text-[#E8E8E8] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#F5C518]" />
                General Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-[#8B92A8] mb-2 block">Site Name</label>
                  <Input
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                    className="bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#8B92A8] mb-2 block">Tagline</label>
                  <Input
                    value={generalSettings.tagline}
                    onChange={(e) => setGeneralSettings({...generalSettings, tagline: e.target.value})}
                    className="bg-[#131720] border-[#2A3144] text-[#E8E8E8]"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#2A3144]">
                <h3 className="font-semibold text-[#E8E8E8] mb-4">Theme Settings</h3>
                <div className="flex items-center justify-between p-4 bg-[#131720] rounded-lg">
                  <div>
                    <p className="font-medium text-[#E8E8E8]">Dark Mode Default</p>
                    <p className="text-sm text-[#8B92A8]">Set dark theme as default for new users</p>
                  </div>
                  <Switch
                    checked={generalSettings.darkMode}
                    onCheckedChange={(checked) => setGeneralSettings({...generalSettings, darkMode: checked})}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#2A3144]">
                <h3 className="font-semibold text-[#E8E8E8] mb-4">Feature Toggles</h3>
                <div className="space-y-3">
                  {Object.entries(generalSettings.featuresEnabled).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-[#131720] rounded-lg">
                      <div>
                        <p className="font-medium text-[#E8E8E8] capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                          setGeneralSettings({
                            ...generalSettings,
                            featuresEnabled: { ...generalSettings.featuresEnabled, [key]: checked }
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => handleSave('General')}
                  className="bg-[#F5C518] text-[#0A0E17] hover:bg-[#c79b00] flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Rules */}
        <TabsContent value="content">
          <Card className="bg-[#1A1F2E] border-[#2A3144]">
            <CardHeader>
              <CardTitle className="text-[#E8E8E8] flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#F5C518]" />
                Content Moderation Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#131720] rounded-lg">
                  <div>
                    <p className="font-medium text-[#E8E8E8]">Profanity Filter</p>
                    <p className="text-sm text-[#8B92A8]">Automatically filter inappropriate language</p>
                  </div>
                  <Switch
                    checked={contentRules.profanityFilter}
                    onCheckedChange={(checked) => setContentRules({...contentRules, profanityFilter: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#131720] rounded-lg">
                  <div>
                    <p className="font-medium text-[#E8E8E8]">Enable Comments</p>
                    <p className="text-sm text-[#8B92A8]">Allow users to comment on reviews</p>
                  </div>
                  <Switch
                    checked={contentRules.commentsEnabled}
                    onCheckedChange={(checked) => setContentRules({...contentRules, commentsEnabled: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#131720] rounded-lg">
                  <div>
                    <p className="font-medium text-[#E8E8E8]">User Reporting</p>
                    <p className="text-sm text-[#8B92A8]">Enable content reporting by users</p>
                  </div>
                  <Switch
                    checked={contentRules.reportsEnabled}
                    onCheckedChange={(checked) => setContentRules({...contentRules, reportsEnabled: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#131720] rounded-lg">
                  <div>
                    <p className="font-medium text-[#E8E8E8]">Auto-Moderation</p>
                    <p className="text-sm text-[#8B92A8]">Automatically reject content below threshold</p>
                  </div>
                  <Switch
                    checked={contentRules.autoModeration}
                    onCheckedChange={(checked) => setContentRules({...contentRules, autoModeration: checked})}
                  />
                </div>

                <div className="p-4 bg-[#131720] rounded-lg">
                  <label className="text-sm font-medium text-[#E8E8E8] mb-2 block">
                    AI Moderation Threshold
                  </label>
                  <p className="text-sm text-[#8B92A8] mb-4">
                    Confidence score required for auto-approval (0-1)
                  </p>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={contentRules.aiModerationThreshold}
                    onChange={(e) => setContentRules({...contentRules, aiModerationThreshold: parseFloat(e.target.value)})}
                    className="bg-[#0A0E17] border-[#2A3144] text-[#E8E8E8]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => handleSave('Content Rules')}
                  className="bg-[#F5C518] text-[#0A0E17] hover:bg-[#c79b00] flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email & Notifications */}
        <TabsContent value="email">
          <Card className="bg-[#1A1F2E] border-[#2A3144]">
            <CardHeader>
              <CardTitle className="text-[#E8E8E8] flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#F5C518]" />
                Email & Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-[#E8E8E8] mb-4">Automated Emails</h3>
                <div className="flex items-center justify-between p-4 bg-[#131720] rounded-lg">
                  <div>
                    <p className="font-medium text-[#E8E8E8]">Welcome Email</p>
                    <p className="text-sm text-[#8B92A8]">Send email when users sign up</p>
                  </div>
                  <Switch
                    checked={emailSettings.welcomeEmail}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, welcomeEmail: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#131720] rounded-lg">
                  <div>
                    <p className="font-medium text-[#E8E8E8]">Review Approval Notification</p>
                    <p className="text-sm text-[#8B92A8]">Notify users when their reviews are approved</p>
                  </div>
                  <Switch
                    checked={emailSettings.reviewApprovalEmail}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, reviewApprovalEmail: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#131720] rounded-lg">
                  <div>
                    <p className="font-medium text-[#E8E8E8]">Weekly Digest</p>
                    <p className="text-sm text-[#8B92A8]">Send weekly summary to users</p>
                  </div>
                  <Switch
                    checked={emailSettings.weeklyDigest}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, weeklyDigest: checked})}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#2A3144]">
                <label className="text-sm font-medium text-[#E8E8E8] mb-2 block">
                  Custom Email Template
                </label>
                <Textarea
                  placeholder="Enter custom HTML email template..."
                  value={emailSettings.customTemplate}
                  onChange={(e) => setEmailSettings({...emailSettings, customTemplate: e.target.value})}
                  className="min-h-48 bg-[#131720] border-[#2A3144] text-[#E8E8E8] font-mono text-sm"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => handleSave('Email Settings')}
                  className="bg-[#F5C518] text-[#0A0E17] hover:bg-[#c79b00] flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API & Integrations */}
        <TabsContent value="api">
          <Card className="bg-[#1A1F2E] border-[#2A3144]">
            <CardHeader>
              <CardTitle className="text-[#E8E8E8] flex items-center gap-2">
                <Key className="w-5 h-5 text-[#F5C518]" />
                API & Integration Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-[#131720] rounded-lg">
                  <label className="text-sm font-medium text-[#E8E8E8] mb-2 block">
                    API Access Key
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={apiSettings.apiKey}
                      readOnly
                      className="bg-[#0A0E17] border-[#2A3144] text-[#E8E8E8]"
                    />
                    <Button variant="outline" className="border-[#2A3144] text-[#E8E8E8]">
                      Regenerate
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-[#131720] rounded-lg">
                  <label className="text-sm font-medium text-[#E8E8E8] mb-2 block">
                    Webhook URL
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Webhook className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8B92A8]" />
                      <Input
                        placeholder="https://your-webhook-url.com/endpoint"
                        value={apiSettings.webhookUrl}
                        onChange={(e) => setApiSettings({...apiSettings, webhookUrl: e.target.value})}
                        className="pl-10 bg-[#0A0E17] border-[#2A3144] text-[#E8E8E8]"
                      />
                    </div>
                    <Button variant="outline" className="border-[#2A3144] text-[#E8E8E8]">
                      Test
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-[#131720] rounded-lg">
                  <label className="text-sm font-medium text-[#E8E8E8] mb-2 block">
                    Rate Limit (per hour)
                  </label>
                  <Input
                    type="number"
                    value={apiSettings.rateLimitPerHour}
                    onChange={(e) => setApiSettings({...apiSettings, rateLimitPerHour: parseInt(e.target.value)})}
                    className="bg-[#0A0E17] border-[#2A3144] text-[#E8E8E8]"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#131720] rounded-lg">
                  <div>
                    <p className="font-medium text-[#E8E8E8]">TMDb Integration</p>
                    <p className="text-sm text-[#8B92A8]">Sync movie data with The Movie Database</p>
                  </div>
                  <Switch
                    checked={apiSettings.tmdbIntegration}
                    onCheckedChange={(checked) => setApiSettings({...apiSettings, tmdbIntegration: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => handleSave('API Settings')}
                  className="bg-[#F5C518] text-[#0A0E17] hover:bg-[#c79b00] flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
