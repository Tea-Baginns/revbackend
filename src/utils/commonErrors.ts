import ErrorResponse from './ErrorResponse';

export default {
  authorization: new ErrorResponse(
    "You aren't authorized to access this resource",
    401,
  ),
  generic: new ErrorResponse('Something went wrong', 500),
};
