import type React from "react";
import {
  Button,
  DataList,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Title,
} from "@patternfly/react-core";
import {
  LongArrowAltDownIcon,
  LongArrowAltUpIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@patternfly/react-icons";

export const ResourceSetList = <SET extends {resources: string[]}>({
  sets,
  createSet,
  deleteSet,
  moveSet,
  children,
}: {
  sets: SET[];
  createSet: () => void;
  deleteSet: (_i: number) => void;
  moveSet: (_i: number, _direction: "up" | "down") => void;
  children: (_settings: {set: SET; i: number}) => React.ReactNode;
}) => {
  return (
    <>
      <DataList aria-label="Resource set list">
        {sets.map((set, i) => {
          return (
            <DataListItem key={i}>
              <DataListItemRow>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell key="all">
                      <Title
                        headingLevel="h3"
                        size="lg"
                        className="pf-v5-u-mb-md"
                      >
                        Resource set {i + 1}
                      </Title>

                      {children({set, i})}
                    </DataListCell>,
                  ]}
                />
                {sets.length > 1 && (
                  <DataListAction
                    id="add"
                    aria-label="remove"
                    aria-labelledby={`resource-set-${i}`}
                  >
                    <Button
                      variant="link"
                      className="pf-v5-u-m-0 pf-v5-u-p-0"
                      onClick={() => deleteSet(i)}
                      icon={<TrashIcon />}
                    />
                    {i > 0 && (
                      <Button
                        variant="link"
                        className="pf-v5-u-m-0 pf-v5-u-p-0"
                        onClick={() => moveSet(i, "up")}
                        icon={<LongArrowAltUpIcon />}
                      />
                    )}
                    {i < sets.length - 1 && (
                      <Button
                        variant="link"
                        className="pf-v5-u-m-0 pf-v5-u-p-0"
                        onClick={() => moveSet(i, "down")}
                        icon={<LongArrowAltDownIcon />}
                      />
                    )}
                  </DataListAction>
                )}
              </DataListItemRow>
            </DataListItem>
          );
        })}
      </DataList>

      <Button
        variant="primary"
        onClick={createSet}
        icon={<PlusCircleIcon />}
        className="pf-v5-u-mt-sm"
      >
        Add resource set
      </Button>
    </>
  );
};
