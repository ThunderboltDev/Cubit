import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import {
  FieldDescription,
  FieldGroup,
  FieldItem,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Page,
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
import { usePuzzles } from "@/hooks/use-puzzles";

export const Route = createFileRoute("/_timer/configuration")({
  component: PuzzleConfigurationPage,
});

function PuzzleConfigurationPage() {
  const { currentPuzzle, updatePuzzle } = usePuzzles();

  if (!currentPuzzle) {
    return (
      <Page>
        <PageHeader>
          <PageTitle>Timer Options</PageTitle>
          <PageDescription>No puzzle selected</PageDescription>
        </PageHeader>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader>
        <PageTitle>Timer Options</PageTitle>
        <PageDescription>Configure {currentPuzzle.name}</PageDescription>
      </PageHeader>

      <FieldSet>
        <FieldLegend>Inspection</FieldLegend>
        <FieldGroup>
          <FieldItem orientation="horizontal">
            <div className="flex-1">
              <FieldLabel>Enable Inspection</FieldLabel>
              <FieldDescription>
                15 second inspection before solve starts
              </FieldDescription>
            </div>
            <Switch
              checked={currentPuzzle.inspectionEnabled}
              onCheckedChange={(checked) =>
                updatePuzzle(currentPuzzle.id, { inspectionEnabled: checked })
              }
            />
          </FieldItem>

          {currentPuzzle.inspectionEnabled && (
            <FieldItem orientation="horizontal">
              <div className="flex-1">
                <FieldLabel>Inspection Duration</FieldLabel>
              </div>
              <div className="flex items-center gap-3">
                <Slider
                  className="w-32"
                  min={0}
                  max={30}
                  step={1}
                  value={[currentPuzzle.inspectionDuration]}
                  onValueChange={(value) =>
                    updatePuzzle(currentPuzzle.id, {
                      inspectionDuration:
                        Array.isArray(value) ? value[0] : value,
                    })
                  }
                />
                <Badge
                  variant="transparent"
                  className="w-14 justify-center font-mono"
                >
                  {currentPuzzle.inspectionDuration}s
                </Badge>
              </div>
            </FieldItem>
          )}
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Multiphase</FieldLegend>
        <FieldGroup>
          <FieldItem orientation="horizontal">
            <div className="flex-1">
              <FieldLabel>Enable Multiphase</FieldLabel>
              <FieldDescription>
                Split solve into multiple timed phases
              </FieldDescription>
            </div>
            <Switch
              checked={currentPuzzle.multiphaseEnabled}
              onCheckedChange={(checked) =>
                updatePuzzle(currentPuzzle.id, { multiphaseEnabled: checked })
              }
            />
          </FieldItem>

          {currentPuzzle.multiphaseEnabled && (
            <FieldItem orientation="horizontal">
              <div className="flex-1">
                <FieldLabel>Phase Count</FieldLabel>
              </div>
              <div className="flex items-center gap-3">
                <Slider
                  className="w-32"
                  min={2}
                  max={10}
                  step={1}
                  value={[currentPuzzle.multiphaseCount]}
                  onValueChange={(value) =>
                    updatePuzzle(currentPuzzle.id, {
                      multiphaseCount: Array.isArray(value) ? value[0] : value,
                    })
                  }
                />
                <Badge
                  variant="transparent"
                  className="w-8 justify-center font-mono"
                >
                  {currentPuzzle.multiphaseCount}
                </Badge>
              </div>
            </FieldItem>
          )}
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Statistics</FieldLegend>
        <FieldGroup>
          <FieldItem orientation="horizontal">
            <div className="flex-1">
              <FieldLabel>Trim Percentage</FieldLabel>
              <FieldDescription>
                Percentage of best/worst times to trim from averages
              </FieldDescription>
            </div>
            <div className="flex items-center gap-3">
              <Slider
                className="w-32"
                min={0}
                max={10}
                step={1}
                value={[currentPuzzle.trimPercentage]}
                onValueChange={(value) =>
                  updatePuzzle(currentPuzzle.id, {
                    trimPercentage: Array.isArray(value) ? value[0] : value,
                  })
                }
              />
              <Badge
                variant="transparent"
                className="w-10 justify-center font-mono"
              >
                {currentPuzzle.trimPercentage}%
              </Badge>
            </div>
          </FieldItem>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Scramble Preview</FieldLegend>
        <FieldGroup>
          <FieldItem orientation="horizontal">
            <div className="flex-1">
              <FieldLabel>Show Scramble Preview</FieldLabel>
              <FieldDescription>
                Display visual puzzle state next to scramble
              </FieldDescription>
            </div>
            <Switch
              checked={currentPuzzle.scramblePreview}
              onCheckedChange={(checked) =>
                updatePuzzle(currentPuzzle.id, { scramblePreview: checked })
              }
            />
          </FieldItem>

          {currentPuzzle.scramblePreview && (
            <FieldItem orientation="horizontal">
              <FieldLabel>Visualization</FieldLabel>
              <Select
                value={currentPuzzle.scramblePreviewVisualization}
                onValueChange={(value) =>
                  updatePuzzle(currentPuzzle.id, {
                    scramblePreviewVisualization: value as "2D" | "3D",
                  })
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2d">2D Net</SelectItem>
                  <SelectItem value="3d">3D Cube</SelectItem>
                </SelectContent>
              </Select>
            </FieldItem>
          )}
        </FieldGroup>
      </FieldSet>
    </Page>
  );
}
