import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  AlertCircle,
  Shield,
  Code,
  Settings2,
  Terminal,
  Loader2,
  Palette,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  api, 
  type ClaudeSettings,
  type ClaudeInstallation
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { Toast, ToastContainer } from "@/components/ui/toast";
import { ClaudeVersionSelector } from "./ClaudeVersionSelector";
import { themeManager, type ThemeName, type Theme, type ThemeColor, type BackgroundTheme, PRESET_COLORS, BACKGROUND_THEMES } from "@/lib/theme-manager";
import { zoomManager, type ZoomLevel, type ZoomPreset } from "@/lib/zoom-manager";

interface SettingsProps {
  /**
   * Callback to go back to the main view
   */
  onBack: () => void;
  /**
   * Optional className for styling
   */
  className?: string;
}

interface PermissionRule {
  id: string;
  value: string;
}

interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
}

/**
 * Comprehensive Settings UI for managing Claude Code settings
 * Provides a no-code interface for editing the settings.json file
 */
export const Settings: React.FC<SettingsProps> = ({
  onBack,
  className,
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<ClaudeSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Permission rules state
  const [allowRules, setAllowRules] = useState<PermissionRule[]>([]);
  const [denyRules, setDenyRules] = useState<PermissionRule[]>([]);

  // Environment variables state
  const [envVars, setEnvVars] = useState<EnvironmentVariable[]>([]);

  // Claude binary path state
  const [currentBinaryPath, setCurrentBinaryPath] = useState<string | null>(null);
  const [selectedInstallation, setSelectedInstallation] = useState<ClaudeInstallation | null>(null);
  const [binaryPathChanged, setBinaryPathChanged] = useState(false);

  // Theme state
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(themeManager.getCurrentTheme());
  const [availableThemes] = useState<Theme[]>(themeManager.getAllThemes());
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [selectedPresetColor, setSelectedPresetColor] = useState<ThemeColor>(themeManager.getCurrentCustomThemeColor());
  const [selectedBackgroundTheme, setSelectedBackgroundTheme] = useState<BackgroundTheme>(themeManager.getCurrentCustomBackgroundTheme());

  // Zoom state
  const [currentZoom, setCurrentZoom] = useState<ZoomLevel>(zoomManager.getCurrentZoom());
  const [zoomPresets] = useState<ZoomPreset[]>(zoomManager.getZoomPresets());
  const [customZoom, setCustomZoom] = useState<string>(currentZoom.toString());


  // Load settings on mount
  useEffect(() => {
    loadSettings();
    loadClaudeBinaryPath();
  }, []);

  /**
   * Loads the current Claude binary path
   */
  const loadClaudeBinaryPath = async () => {
    try {
      const path = await api.getClaudeBinaryPath();
      setCurrentBinaryPath(path);
    } catch (err) {
      console.error("Failed to load Claude binary path:", err);
    }
  };

  /**
   * Loads the current Claude settings
   */
  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedSettings = await api.getClaudeSettings();
      
      // Ensure loadedSettings is an object
      if (!loadedSettings || typeof loadedSettings !== 'object') {
        console.warn("Loaded settings is not an object:", loadedSettings);
        setSettings({});
        return;
      }
      
      setSettings(loadedSettings);

      // Parse permissions
      if (loadedSettings.permissions && typeof loadedSettings.permissions === 'object') {
        if (Array.isArray(loadedSettings.permissions.allow)) {
          setAllowRules(
            loadedSettings.permissions.allow.map((rule: string, index: number) => ({
              id: `allow-${index}`,
              value: rule,
            }))
          );
        }
        if (Array.isArray(loadedSettings.permissions.deny)) {
          setDenyRules(
            loadedSettings.permissions.deny.map((rule: string, index: number) => ({
              id: `deny-${index}`,
              value: rule,
            }))
          );
        }
      }

      // Parse environment variables
      if (loadedSettings.env && typeof loadedSettings.env === 'object' && !Array.isArray(loadedSettings.env)) {
        setEnvVars(
          Object.entries(loadedSettings.env).map(([key, value], index) => ({
            id: `env-${index}`,
            key,
            value: value as string,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      setError("Failed to load settings. Please ensure ~/.claude directory exists.");
      setSettings({});
    } finally {
      setLoading(false);
    }
  };


  /**
   * Saves the current settings
   */
  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setToast(null);

      // Build the settings object
      const updatedSettings: ClaudeSettings = {
        ...settings,
        permissions: {
          allow: allowRules.map(rule => rule.value).filter(v => v.trim()),
          deny: denyRules.map(rule => rule.value).filter(v => v.trim()),
        },
        env: envVars.reduce((acc, { key, value }) => {
          if (key.trim() && value.trim()) {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, string>),
      };

      await api.saveClaudeSettings(updatedSettings);
      setSettings(updatedSettings);

      // Save Claude binary path if changed
      if (binaryPathChanged && selectedInstallation) {
        await api.setClaudeBinaryPath(selectedInstallation.path);
        setCurrentBinaryPath(selectedInstallation.path);
        setBinaryPathChanged(false);
      }

      setToast({ message: "Settings saved successfully!", type: "success" });
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Failed to save settings.");
      setToast({ message: "Failed to save settings", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  /**
   * Updates a simple setting value
   */
  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Adds a new permission rule
   */
  const addPermissionRule = (type: "allow" | "deny") => {
    const newRule: PermissionRule = {
      id: `${type}-${Date.now()}`,
      value: "",
    };
    
    if (type === "allow") {
      setAllowRules(prev => [...prev, newRule]);
    } else {
      setDenyRules(prev => [...prev, newRule]);
    }
  };

  /**
   * Updates a permission rule
   */
  const updatePermissionRule = (type: "allow" | "deny", id: string, value: string) => {
    if (type === "allow") {
      setAllowRules(prev => prev.map(rule => 
        rule.id === id ? { ...rule, value } : rule
      ));
    } else {
      setDenyRules(prev => prev.map(rule => 
        rule.id === id ? { ...rule, value } : rule
      ));
    }
  };

  /**
   * Removes a permission rule
   */
  const removePermissionRule = (type: "allow" | "deny", id: string) => {
    if (type === "allow") {
      setAllowRules(prev => prev.filter(rule => rule.id !== id));
    } else {
      setDenyRules(prev => prev.filter(rule => rule.id !== id));
    }
  };

  /**
   * Adds a new environment variable
   */
  const addEnvVar = () => {
    const newVar: EnvironmentVariable = {
      id: `env-${Date.now()}`,
      key: "",
      value: "",
    };
    setEnvVars(prev => [...prev, newVar]);
  };

  /**
   * Updates an environment variable
   */
  const updateEnvVar = (id: string, field: "key" | "value", value: string) => {
    setEnvVars(prev => prev.map(envVar => 
      envVar.id === id ? { ...envVar, [field]: value } : envVar
    ));
  };

  /**
   * Removes an environment variable
   */
  const removeEnvVar = (id: string) => {
    setEnvVars(prev => prev.filter(envVar => envVar.id !== id));
  };

  /**
   * Handle Claude installation selection
   */
  const handleClaudeInstallationSelect = (installation: ClaudeInstallation) => {
    setSelectedInstallation(installation);
    setBinaryPathChanged(installation.path !== currentBinaryPath);
  };

  /**
   * Handles theme selection
   */
  const handleThemeChange = (themeName: ThemeName) => {
    setCurrentTheme(themeName);
    themeManager.setTheme(themeName);
    
    // Show color picker for custom theme
    if (themeName === 'custom') {
      setShowColorPicker(true);
    } else {
      setShowColorPicker(false);
    }
  };

  /**
   * Handles preset color selection
   */
  const handlePresetColorSelect = (color: ThemeColor) => {
    setSelectedPresetColor(color);
    themeManager.setCustomTheme(color, selectedBackgroundTheme);
    if (currentTheme === 'custom') {
      // Force re-render
      setCurrentTheme('custom');
    }
  };

  /**
   * Handles background theme selection
   */
  const handleBackgroundThemeSelect = (backgroundTheme: BackgroundTheme) => {
    setSelectedBackgroundTheme(backgroundTheme);
    themeManager.setCustomTheme(selectedPresetColor, backgroundTheme);
    if (currentTheme === 'custom') {
      // Force re-render
      setCurrentTheme('custom');
    }
  };

  /**
   * Handles zoom level changes
   */
  const handleZoomChange = (zoom: ZoomLevel) => {
    setCurrentZoom(zoom);
    setCustomZoom(zoom.toString());
    zoomManager.setZoom(zoom);
  };

  /**
   * Handles custom zoom input
   */
  const handleCustomZoomChange = (value: string) => {
    setCustomZoom(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      const range = zoomManager.getZoomRange();
      if (numValue >= range.min && numValue <= range.max) {
        handleZoomChange(numValue);
      }
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-background text-foreground", className)}>
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between p-4 border-b border-border"
        >
        <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="text-xs text-muted-foreground">
              Configure Claude Code preferences
          </p>
          </div>
        </div>
        
        <Button
          onClick={saveSettings}
          disabled={saving || loading}
          size="sm"
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </motion.div>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/50 flex items-center gap-2 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="general" className="gap-2">
                <Settings2 className="h-4 w-4 text-slate-500" />
                General
              </TabsTrigger>
              <TabsTrigger value="permissions" className="gap-2">
                <Shield className="h-4 w-4 text-amber-500" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="environment" className="gap-2">
                <Terminal className="h-4 w-4 text-blue-500" />
                Environment
              </TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2">
                <Code className="h-4 w-4 text-purple-500" />
                Advanced
              </TabsTrigger>
            </TabsList>
            
            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card className="p-6 space-y-6">
                <div>
                  <h3 className="text-base font-semibold mb-4">General Settings</h3>
                  
                  <div className="space-y-6">
                    {/* Theme Selection */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Palette className="h-4 w-4 text-primary" />
                        <Label className="text-sm font-medium">Application Theme</Label>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">
                        Choose your preferred application theme style
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {availableThemes.map((theme) => (
                          <div
                            key={theme.id}
                            onClick={() => handleThemeChange(theme.id)}
                            className={cn(
                              "relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                              currentTheme === theme.id 
                                ? "border-primary bg-primary/5" 
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            {/* Theme Color Preview */}
                            <div className="flex items-start gap-3">
                              <div className="flex gap-1">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: theme.colors.background }}
                                />
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: theme.colors.primary }}
                                />
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: theme.colors.accent }}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium">{theme.name}</h4>
                                  {currentTheme === theme.id && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {theme.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Custom Theme Color Picker */}
                      {showColorPicker && currentTheme === 'custom' && (
                        <div className="space-y-4 p-4 border rounded-lg bg-card">
                          <Label className="text-xs font-medium text-muted-foreground">Custom Theme Colors</Label>
                          <p className="text-xs text-muted-foreground mb-3">
                            Choose a color scheme and background for your custom theme
                          </p>
                          
                          {/* Background Theme Selection */}
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Background Theme</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {BACKGROUND_THEMES.map((bgTheme) => (
                                <Button
                                  key={bgTheme.key}
                                  variant={selectedBackgroundTheme.key === bgTheme.key ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleBackgroundThemeSelect(bgTheme)}
                                  className="h-10 flex items-center gap-2"
                                >
                                  <div 
                                    className="w-4 h-4 rounded border"
                                    style={{ backgroundColor: bgTheme.background }}
                                  />
                                  <span className="text-xs">{bgTheme.name}</span>
                                </Button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Accent Color Selection */}
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Accent Color</Label>
                            <div className="grid grid-cols-5 gap-2">
                              {PRESET_COLORS.map((color) => (
                                <Button
                                  key={color.name}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePresetColorSelect(color)}
                                  className={cn(
                                    "h-8 p-1 flex flex-col items-center justify-center border-2",
                                    selectedPresetColor.name === color.name && "border-primary"
                                  )}
                                  title={color.name}
                                >
                                  <div className="w-4 h-4 rounded-full border border-white/20" 
                                       style={{ backgroundColor: color.primary }} />
                                </Button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Preview */}
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">Preview</Label>
                            <div 
                              className="p-3 rounded border flex items-center gap-3"
                              style={{ 
                                backgroundColor: selectedBackgroundTheme.background,
                                color: selectedBackgroundTheme.foreground,
                                borderColor: selectedBackgroundTheme.border
                              }}
                            >
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: selectedPresetColor.primary }}
                              />
                              <span className="text-xs">
                                {selectedPresetColor.name} + {selectedBackgroundTheme.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                                         {/* Zoom Level Settings */}
                     <div className="space-y-4">
                       <div className="flex items-center gap-2 mb-3">
                         <ZoomIn className="h-4 w-4 text-primary" />
                         <Label className="text-sm font-medium">Interface Zoom</Label>
                       </div>
                       <p className="text-xs text-muted-foreground mb-4">
                         Adjust the display size of the application interface
                       </p>
                      
                                             {/* Zoom Presets */}
                       <div className="space-y-3">
                         <Label className="text-xs font-medium text-muted-foreground">Preset Zoom Levels</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {zoomPresets.map((preset) => (
                            <Button
                              key={preset.value}
                              variant={currentZoom === preset.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleZoomChange(preset.value)}
                              className="h-8 text-xs"
                            >
                              {preset.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                                             {/* Custom Zoom Input */}
                       <div className="space-y-2">
                         <Label className="text-xs font-medium text-muted-foreground">Custom Zoom (50% - 300%)</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={() => handleZoomChange(Math.max(50, currentZoom - 10))}
                            disabled={currentZoom <= 50}
                          >
                            <ZoomOut className="h-3 w-3" />
                          </Button>
                          
                          <div className="flex-1 relative">
                            <Input
                              type="number"
                              min="50"
                              max="300"
                              step="10"
                              value={customZoom}
                              onChange={(e) => handleCustomZoomChange(e.target.value)}
                              className="h-8 text-center pr-8"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                              %
                            </span>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={() => handleZoomChange(Math.min(300, currentZoom + 10))}
                            disabled={currentZoom >= 300}
                          >
                            <ZoomIn className="h-3 w-3" />
                          </Button>
                          
                                                     <Button
                             variant="outline"
                             size="icon"
                             className="h-8 w-8 flex-shrink-0"
                             onClick={() => handleZoomChange(100)}
                             title="Reset to 100%"
                           >
                             <RotateCcw className="h-3 w-3" />
                           </Button>
                        </div>
                        
                        {/* Zoom Slider */}
                        <div className="px-1">
                          <input
                            type="range"
                            min="50"
                            max="300"
                            step="10"
                            value={currentZoom}
                            onChange={(e) => handleZoomChange(parseInt(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((currentZoom - 50) / 250) * 100}%, var(--color-muted) ${((currentZoom - 50) / 250) * 100}%, var(--color-muted) 100%)`
                            }}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>50%</span>
                            <span className="font-medium text-foreground">{currentZoom}%</span>
                            <span>300%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Include Co-authored By */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 flex-1">
                        <Label htmlFor="coauthored">Include "Co-authored by Claude"</Label>
                        <p className="text-xs text-muted-foreground">
                          Add Claude attribution to git commits and pull requests
                        </p>
                      </div>
                      <Switch
                        id="coauthored"
                        checked={settings?.includeCoAuthoredBy !== false}
                        onCheckedChange={(checked) => updateSetting("includeCoAuthoredBy", checked)}
                      />
                    </div>
                    
                    {/* Verbose Output */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 flex-1">
                        <Label htmlFor="verbose">Verbose Output</Label>
                        <p className="text-xs text-muted-foreground">
                          Show full bash and command outputs
                        </p>
                      </div>
                      <Switch
                        id="verbose"
                        checked={settings?.verbose === true}
                        onCheckedChange={(checked) => updateSetting("verbose", checked)}
                      />
                    </div>
                    
                    {/* Cleanup Period */}
                    <div className="space-y-2">
                      <Label htmlFor="cleanup">Chat Transcript Retention (days)</Label>
                      <Input
                        id="cleanup"
                        type="number"
                        min="1"
                        placeholder="30"
                        value={settings?.cleanupPeriodDays || ""}
                        onChange={(e) => {
                          const value = e.target.value ? parseInt(e.target.value) : undefined;
                          updateSetting("cleanupPeriodDays", value);
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        How long to retain chat transcripts locally (default: 30 days)
                      </p>
                    </div>
                    
                    {/* Claude Binary Path Selector */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Claude Code Installation</Label>
                        <p className="text-xs text-muted-foreground mb-4">
                          Select which Claude Code installation to use
                        </p>
                      </div>
                      <ClaudeVersionSelector
                        selectedPath={currentBinaryPath}
                        onSelect={handleClaudeInstallationSelect}
                      />
                      {binaryPathChanged && (
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          ⚠️ Claude binary path has been changed. Remember to save your settings.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            {/* Permissions Settings */}
            <TabsContent value="permissions" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold mb-2">Permission Rules</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Control which tools Claude Code can use without manual approval
                    </p>
                  </div>
                  
                  {/* Allow Rules */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-green-500">Allow Rules</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addPermissionRule("allow")}
                        className="gap-2 hover:border-green-500/50 hover:text-green-500"
                      >
                        <Plus className="h-3 w-3" />
                        Add Rule
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {allowRules.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2">
                          No allow rules configured. Claude will ask for approval for all tools.
                        </p>
                      ) : (
                        allowRules.map((rule) => (
                          <motion.div
                            key={rule.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Input
                              placeholder="e.g., Bash(npm run test:*)"
                              value={rule.value}
                              onChange={(e) => updatePermissionRule("allow", rule.id, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePermissionRule("allow", rule.id)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Deny Rules */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-red-500">Deny Rules</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addPermissionRule("deny")}
                        className="gap-2 hover:border-red-500/50 hover:text-red-500"
                      >
                        <Plus className="h-3 w-3" />
                        Add Rule
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {denyRules.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-2">
                          No deny rules configured.
                        </p>
                      ) : (
                        denyRules.map((rule) => (
                          <motion.div
                            key={rule.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Input
                              placeholder="e.g., Bash(curl:*)"
                              value={rule.value}
                              onChange={(e) => updatePermissionRule("deny", rule.id, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removePermissionRule("deny", rule.id)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      <strong>Examples:</strong>
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• <code className="px-1 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400">Bash</code> - Allow all bash commands</li>
                      <li>• <code className="px-1 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400">Bash(npm run build)</code> - Allow exact command</li>
                      <li>• <code className="px-1 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400">Bash(npm run test:*)</code> - Allow commands with prefix</li>
                      <li>• <code className="px-1 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400">Read(~/.zshrc)</code> - Allow reading specific file</li>
                      <li>• <code className="px-1 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400">Edit(docs/**)</code> - Allow editing files in docs directory</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            {/* Environment Variables */}
            <TabsContent value="environment" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold">Environment Variables</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Environment variables applied to every Claude Code session
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addEnvVar}
                      className="gap-2"
                    >
                      <Plus className="h-3 w-3" />
                      Add Variable
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {envVars.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-2">
                        No environment variables configured.
                      </p>
                    ) : (
                      envVars.map((envVar) => (
                        <motion.div
                          key={envVar.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2"
                        >
                          <Input
                            placeholder="KEY"
                            value={envVar.key}
                            onChange={(e) => updateEnvVar(envVar.id, "key", e.target.value)}
                            className="flex-1 font-mono text-sm"
                          />
                          <span className="text-muted-foreground">=</span>
                          <Input
                            placeholder="value"
                            value={envVar.value}
                            onChange={(e) => updateEnvVar(envVar.id, "value", e.target.value)}
                            className="flex-1 font-mono text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeEnvVar(envVar.id)}
                            className="h-8 w-8 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))
                    )}
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      <strong>Common variables:</strong>
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• <code className="px-1 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">CLAUDE_CODE_ENABLE_TELEMETRY</code> - Enable/disable telemetry (0 or 1)</li>
                      <li>• <code className="px-1 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">ANTHROPIC_MODEL</code> - Custom model name</li>
                      <li>• <code className="px-1 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">DISABLE_COST_WARNINGS</code> - Disable cost warnings (1)</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
            {/* Advanced Settings */}
            <TabsContent value="advanced" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold mb-4">Advanced Settings</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Additional configuration options for advanced users
                    </p>
                  </div>
                  
                  {/* API Key Helper */}
                  <div className="space-y-2">
                    <Label htmlFor="apiKeyHelper">API Key Helper Script</Label>
                    <Input
                      id="apiKeyHelper"
                      placeholder="/path/to/generate_api_key.sh"
                      value={settings?.apiKeyHelper || ""}
                      onChange={(e) => updateSetting("apiKeyHelper", e.target.value || undefined)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Custom script to generate auth values for API requests
                    </p>
                  </div>
                  
                  {/* Raw JSON Editor */}
                  <div className="space-y-2">
                    <Label>Raw Settings (JSON)</Label>
                    <div className="p-3 rounded-md bg-muted font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                      <pre>{JSON.stringify(settings, null, 2)}</pre>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This shows the raw JSON that will be saved to ~/.claude/settings.json
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
      </div>
      
      {/* Toast Notification */}
      <ToastContainer>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast(null)}
          />
        )}
      </ToastContainer>
    </div>
  );
}; 
