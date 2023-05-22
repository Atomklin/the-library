/* Index the data being inserted into both tables */
CREATE TRIGGER IF NOT EXISTS after_groups_insert
AFTER INSERT ON groups 
BEGIN
  INSERT INTO fts_index (
    id,
    name,
    description
  ) VALUES (
    (0 - NEW.id), 
    NEW.name, 
    NEW.description
  );
END;

CREATE TRIGGER IF NOT EXISTS after_items_insert 
AFTER INSERT ON items 
BEGIN 
  INSERT INTO fts_index (
    id,
    name,
    description
  ) VALUES (
    NEW.id,
    NEW.name,
    NEW.description
  );
END;

/* Update index table when one of the original table is updated */
CREATE TRIGGER IF NOT EXISTS after_groups_update 
AFTER UPDATE ON groups 
BEGIN
  UPDATE fts_index 
  SET 
    name = NEW.name,
    description = NEW.description
  WHERE id = (0 - NEW.id);
END;

CREATE TRIGGER IF NOT EXISTS after_items_update
AFTER UPDATE ON items 
BEGIN 
  UPDATE fts_index
  SET 
    name = NEW.name,
    description = NEW.description
  WHERE id = NEW.id;
END;

/*  Delete index when the original row is deleted */
CREATE TRIGGER IF NOT EXISTS after_items_delete
AFTER DELETE ON groups
BEGIN
  DELETE FROM fts_index 
  WHERE id = (0 - OLD.id);
END;

CREATE TRIGGER IF NOT EXISTS after_items_delete 
AFTER DELETE ON items 
BEGIN 
  DELETE FROM fts_index
  WHERE id = OLD.id;
END;