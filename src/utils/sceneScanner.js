export function scanTBCScene(scene) {
  const result = {
    vitrines: [],
    floorButtons: [],
    floors: [],
    doors: [],
    rooms: [],
    colliders: [],
    otherTBC: [],
  };

  scene.traverse((object) => {
    if (!object.name) return;

    const name = object.name;

    if (name.startsWith("TBC_Vitrine_")) {
      result.vitrines.push(object);
      return;
    }

    if (name.startsWith("TBC_Button_")) {
      result.floorButtons.push(object);
      return;
    }

    if (name.startsWith("TBC_Floor_")) {
      result.floors.push(object);
      return;
    }

    if (name.startsWith("TBC_Door_")) {
      result.doors.push(object);
      return;
    }

    if (name.startsWith("TBC_Room_")) {
      result.rooms.push(object);
      return;
    }

    if (name.startsWith("TBC_Collider_")) {
      result.colliders.push(object);
      return;
    }

    if (name.startsWith("TBC_")) {
      result.otherTBC.push(object);
    }
  });

  return result;
}

export function getBaseTBCName(name) {
  if (!name) return "";

  return name.replace(/_\d+$/, "");
}

export function getTBCId(name) {
  const baseName = getBaseTBCName(name);

  const match = baseName.match(/_(\d+)$/);

  if (!match) return null;

  return match[1];
}

export function printTBCSceneReport(result) {
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("       TBC SCENE SCANNER");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  console.log(
    `✓ Vitrines: ${result.vitrines.length}`
  );

  console.log(
    `✓ Floor Buttons: ${result.floorButtons.length}`
  );

  console.log(
    `✓ Floors: ${result.floors.length}`
  );

  console.log(
    `✓ Doors: ${result.doors.length}`
  );

  console.log(
    `✓ Rooms: ${result.rooms.length}`
  );

  console.log(
    `✓ Colliders: ${result.colliders.length}`
  );

  console.log(
    `✓ Other TBC objects: ${result.otherTBC.length}`
  );

  console.log("");

  const uniqueVitrines = [
    ...new Set(
      result.vitrines.map((object) =>
        getBaseTBCName(object.name)
      )
    ),
  ];

  const uniqueButtons = [
    ...new Set(
      result.floorButtons.map((object) =>
        getBaseTBCName(object.name)
      )
    ),
  ];

  const uniqueFloors = [
    ...new Set(
      result.floors.map((object) =>
        getBaseTBCName(object.name)
      )
    ),
  ];

  console.log("VITRINES:");
  uniqueVitrines.forEach((name) => {
    console.log(`  • ${name}`);
  });

  console.log("");

  console.log("FLOOR BUTTONS:");
  uniqueButtons.forEach((name) => {
    console.log(`  • ${name}`);
  });

  console.log("");

  console.log("FLOORS:");
  uniqueFloors.forEach((name) => {
    console.log(`  • ${name}`);
  });

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
}