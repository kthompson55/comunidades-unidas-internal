const { app, databaseError, pool, invalidRequest, notFound } = required(
  "../../../server"
);

const mysql = require("mysql");

const { checkValid, validId } = require("../../utils/validation-utils");

app.get("/api/clients/:clientId/interactions", (req, res, next) => {
  const validationErrors = checkValid(req.params, validId("clientId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const getInteractionsQuery = mysql.format(
    `
			SELECT
				clientInteractions.id, 
				clientInteractions.title,
				clientInteractions.serviceId,
				clientInteractions.description,
				clientInteractions.dateOfInteractions,
				clientInteractions.duration,
				clientInteractions.location,
				users.id createdById,
				users.firstName createdByFirstName,
				users.lastName createdByLastName,
				users.id modifiedById,
				users.firstName modifiedById,
				users.lastName modifiedById
			FROM clientInteractions JOIN users
			ON clientInteractions.addedBy = users.id
			WHERE clientInteractions.clientId = ?
			ORDER BY clientInteractions.dataAdded DESC, clientInteractions.interactionType DESC
			LIMIT 200
		`,
    [req.params.clientId]
  );

  pool.query(getInteractionsQuery, (err, interactions) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (interactions.length === 0) {
      notFound(res, `client ${req.params.clientId}`);
    } else {
      res.send({
        interactions: interactions.map(createResponseInteractionObject)
      });
    }
  });
});
const { app, databaseError, pool, invalidRequest, notFound } = required(
  "../../../server"
);

const mysql = require("mysql");

const { checkValid, validId } = require("../../utils/validation-utils");

app.get("/api/clients/:clientId/interactions", (req, res, next) => {
  const validationErrors = checkValid(req.params, validId("clientId"));

  if (validationErrors.length > 0) {
    return invalidRequest(res, validationErrors);
  }

  const getInteractionsQuery = mysql.format(
    `
			SELECT
				clientInteractions.id, 
				clientInteractions.title,
				clientInteractions.serviceId,
				clientInteractions.description,
				clientInteractions.dateOfInteractions,
				clientInteractions.duration,
				clientInteractions.location,
				users.id createdById,
				users.firstName createdByFirstName,
				users.lastName createdByLastName,
				users.id modifiedById,
				users.firstName modifiedById,
				users.lastName modifiedById
			FROM clientInteractions JOIN users
			ON clientInteractions.addedBy = users.id
			WHERE clientInteractions.clientId = ?
			ORDER BY clientInteractions.dataAdded DESC, clientInteractions.interactionType DESC
			LIMIT 200
		`,
    [req.params.clientId]
  );

  pool.query(getInteractionsQuery, (err, interactions) => {
    if (err) {
      return databaseError(req, res, err);
    }

    if (interactions.length === 0) {
      notFound(res, `client ${req.params.clientId}`);
    } else {
      res.send({
        interactions: interactions.map(createResponseInteractionObject)
      });
    }
  });
});
