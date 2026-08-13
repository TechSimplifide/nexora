import asyncHandler from "../utils/async-handler.js";
import ApiResponse from "../utils/api-response.js";
import {
  createProjectProposalService,
  getMyProjectProposalsService,
  getPendingProjectProposalsService,
  approveProjectProposalService,
  rejectProjectProposalService,
  updateRejectedProjectProposalService,
  deleteProjectProposalService,
} from "../services/project-proposal.service.js";

export const createProjectProposal = asyncHandler(async (req, res) => {
  const proposal = await createProjectProposalService({
    title: req.body.title,
    team: req.body.team,
    abstractPdf: req.file,
    user: req.user,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, proposal, "Project proposal submitted successfully"),
    );
});

export const getMyProjectProposals = asyncHandler(async (req, res) => {
  const proposals = await getMyProjectProposalsService(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, proposals, "Project proposals fetched successfully"),
    );
});

export const getPendingProjectProposals = asyncHandler(async (req, res) => {
  const proposals = await getPendingProjectProposalsService(req.user.college);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        proposals,
        "Pending project proposals fetched successfully",
      ),
    );
});

export const approveProjectProposal = asyncHandler(async (req, res) => {
  const proposal = await approveProjectProposalService({
    proposalId: req.params.id,
    adminId: req.user._id,
    collegeId: req.user.college,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, proposal, "Project proposal approved successfully"),
    );
});

export const rejectProjectProposal = asyncHandler(async (req, res) => {
  const proposal = await rejectProjectProposalService({
    proposalId: req.params.id,
    adminId: req.user._id,
    collegeId: req.user.college,
    adminRemarks: req.body.adminRemarks,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, proposal, "Project proposal rejected successfully"),
    );
});

export const updateRejectedProjectProposal = asyncHandler(async (req, res) => {
  const proposal = await updateRejectedProjectProposalService({
    proposalId: req.params.id,
    userId: req.user._id,
    title: req.body.title,
    team: req.body.team,
    abstractPdf: req.file,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        proposal,
        "Project proposal updated and resubmitted successfully",
      ),
    );
});

export const deleteProjectProposal = asyncHandler(async (req, res) => {
  const deletedProposal = await deleteProjectProposalService({
    proposalId: req.params.id,
    userId: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedProposal,
        "Project proposal deleted successfully",
      ),
    );
});
