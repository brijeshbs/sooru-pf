export const SCALE = 20; // 1 foot = 20 pixels
export const GRID_SIZE = 2; // 2 feet grid

export const drawGrid = (ctx, width, height) => {
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 0.5;

  // Draw vertical lines
  for (let x = 0; x <= width; x += GRID_SIZE * SCALE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = 0; y <= height; y += GRID_SIZE * SCALE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
};

export const drawRoom = (ctx, room, isSelected = false) => {
  const x = room.position.x * SCALE;
  const y = room.position.y * SCALE;
  const width = room.dimensions.width * SCALE;
  const height = room.dimensions.length * SCALE;

  // Fill room
  ctx.fillStyle = getRoomColor(room.type, isSelected);
  ctx.fillRect(x, y, width, height);

  // Draw room border
  ctx.strokeStyle = isSelected ? '#2196F3' : '#000';
  ctx.lineWidth = isSelected ? 2 : 1;
  ctx.strokeRect(x, y, width, height);

  // Add room label
  ctx.fillStyle = '#000';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(room.name, x + width/2, y + height/2);

  // Add dimensions
  drawDimensions(ctx, x, y, width, height, room.dimensions);

  // Draw door if room has one
  if (room.door) {
    drawDoor(ctx, room);
  }
};

export const drawDoor = (ctx, room) => {
  const { door } = room;
  const x = room.position.x * SCALE;
  const y = room.position.y * SCALE;
  
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  
  // Draw door arc
  ctx.beginPath();
  if (door.wall === 'north') {
    ctx.arc(x + door.offset * SCALE, y, 20, Math.PI, 0);
  } else if (door.wall === 'south') {
    ctx.arc(x + door.offset * SCALE, y + room.dimensions.length * SCALE, 20, 0, Math.PI);
  } else if (door.wall === 'east') {
    ctx.arc(x + room.dimensions.width * SCALE, y + door.offset * SCALE, 20, -Math.PI/2, Math.PI/2);
  } else {
    ctx.arc(x, y + door.offset * SCALE, 20, Math.PI/2, -Math.PI/2);
  }
  ctx.stroke();
};

export const drawDimensions = (ctx, x, y, width, height, dimensions) => {
  const padding = 15;
  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';
  
  // Width dimension
  ctx.fillText(`${dimensions.width}'`, x + width/2, y - padding);
  
  // Length dimension
  ctx.save();
  ctx.translate(x - padding, y + height/2);
  ctx.rotate(-Math.PI/2);
  ctx.fillText(`${dimensions.length}'`, 0, 0);
  ctx.restore();
};

export const getRoomColor = (type, isSelected) => {
  const colors = {
    bedroom: '#A8D5E5',
    bathroom: '#95DAC1',
    kitchen: '#FFEBA1',
    living: '#FFA69E',
    dining: '#B8F2E6',
    study: '#E6B8F2',
    entry: '#FFD4DB',
    hallway: '#E8E8E8'
  };
  
  const baseColor = colors[type] || '#FFFFFF';
  return isSelected ? lightenColor(baseColor, 20) : baseColor;
};

export const lightenColor = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return '#' + (
    0x1000000 +
    (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)
  ).toString(16).slice(1);
};

export const getMousePosition = (canvas, event) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor((event.clientX - rect.left) / SCALE) * SCALE,
    y: Math.floor((event.clientY - rect.top) / SCALE) * SCALE
  };
};

export const isPointInRoom = (point, room) => {
  const roomX = room.position.x * SCALE;
  const roomY = room.position.y * SCALE;
  const roomWidth = room.dimensions.width * SCALE;
  const roomHeight = room.dimensions.length * SCALE;

  return point.x >= roomX && point.x <= roomX + roomWidth &&
         point.y >= roomY && point.y <= roomY + roomHeight;
};