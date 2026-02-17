import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  Page,
  PageBody,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/ui/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/use-settings";
import { formatTime } from "@/lib/format-time";
import type { TimerFormat, TimerPrecision } from "@/types/settings";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const SAMPLE_TIME_MS = 65432;

function SettingsPage() {
  const { settings, updateSettings } = useSettings();

  return (
    <Page showNavHeader>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageDescription>Manage your preferences</PageDescription>
      </PageHeader>
      <PageBody>
        <FieldSet>
          <FieldLegend>Appearance</FieldLegend>
          <FieldGroup>
            <Field orientation="horizontal">
              <FieldTitle>Theme</FieldTitle>
              <Select
                value={settings.theme}
                onValueChange={(value) =>
                  updateSettings({
                    theme: value as "light" | "dark" | "system",
                  })
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Timer Display</FieldLegend>
          <FieldGroup>
            <div className="flex items-center justify-center rounded-xl bg-secondary p-6">
              <span className="font-mono text-4xl font-bold">
                {formatTime(
                  SAMPLE_TIME_MS,
                  settings.timerPrecision,
                  settings.timeFormat,
                )}
              </span>
            </div>

            <Field orientation="horizontal">
              <div className="flex-1">
                <FieldTitle>Precision</FieldTitle>
                <FieldDescription>
                  Decimal places shown on the timer
                </FieldDescription>
              </div>
              <div className="flex items-center gap-3">
                <Slider
                  className="w-32"
                  min={0}
                  max={3}
                  step={1}
                  value={[settings.timerPrecision]}
                  onValueChange={(value) =>
                    updateSettings({
                      timerPrecision: (Array.isArray(value) ?
                        value[0]
                      : value) as TimerPrecision,
                    })
                  }
                />
                <Badge variant="soft" className="w-6 justify-center font-mono">
                  {settings.timerPrecision}
                </Badge>
              </div>
            </Field>

            <Field orientation="horizontal">
              <FieldTitle>Time Format</FieldTitle>
              <Select
                value={settings.timeFormat}
                onValueChange={(value) =>
                  updateSettings({ timeFormat: value as TimerFormat })
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="decimal">
                    {formatTime(SAMPLE_TIME_MS, 2, "decimal")}
                  </SelectItem>
                  <SelectItem value="colon">
                    {formatTime(SAMPLE_TIME_MS, 2, "colon")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Timer Behavior</FieldLegend>
          <FieldGroup>
            <Field orientation="horizontal">
              <div className="flex-1">
                <FieldTitle>Hold Threshold</FieldTitle>
                <FieldDescription>
                  How long to hold before the timer is ready
                </FieldDescription>
              </div>
              <div className="flex items-center gap-3">
                <Slider
                  className="w-32"
                  min={100}
                  max={1000}
                  step={50}
                  value={[settings.holdThreshold]}
                  onValueChange={(value) =>
                    updateSettings({
                      holdThreshold: Array.isArray(value) ? value[0] : value,
                    })
                  }
                />
                <Badge variant="soft" className="w-14 justify-center font-mono">
                  {settings.holdThreshold}ms
                </Badge>
              </div>
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Feedback</FieldLegend>
          <FieldGroup>
            <Field orientation="horizontal">
              <div className="flex-1">
                <FieldTitle>Sound</FieldTitle>
                <FieldDescription>Play sounds on events</FieldDescription>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) =>
                  updateSettings({ soundEnabled: checked })
                }
              />
            </Field>

            {settings.soundEnabled && (
              <Field orientation="horizontal">
                <div className="flex-1">
                  <FieldTitle>Sound Volume</FieldTitle>
                </div>
                <div className="flex items-center gap-3">
                  <Slider
                    className="w-32"
                    min={0}
                    max={1}
                    step={0.05}
                    value={[settings.soundVolume]}
                    onValueChange={(value) =>
                      updateSettings({
                        soundVolume: Array.isArray(value) ? value[0] : value,
                      })
                    }
                  />
                  <Badge
                    variant="soft"
                    className="w-12 justify-center font-mono"
                  >
                    {Math.round(settings.soundVolume * 100)}%
                  </Badge>
                </div>
              </Field>
            )}

            <Field orientation="horizontal">
              <div className="flex-1">
                <FieldTitle>Haptic Feedback</FieldTitle>
                <FieldDescription>
                  Vibrate on timer events (mobile only)
                </FieldDescription>
              </div>
              <Switch
                checked={settings.hapticEnabled}
                onCheckedChange={(checked) =>
                  updateSettings({ hapticEnabled: checked })
                }
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </PageBody>
    </Page>
  );
}
