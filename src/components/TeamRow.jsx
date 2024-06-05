import { Button, Modal, Flex, TextInput, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { supabase } from "../db/supabaseClient";
import { useForm } from "react-hook-form";

const TeamRow = ({
  team,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage,
  fetchTeamsData,
  handleInputChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [opened, { open, close }] = useDisclosure(false);

  const handleDeleteTeam = async (team_id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this team?",
    );
    if (confirmed) {
      const { data, error } = await supabase
        .from("teams")
        .delete()
        .eq("team_id", team_id);
      if (error) {
        console.error("Error deleting team:", error.message);
      } else {
        fetchTeamData();
        console.log("Team deleted successfully:", data);
      }
    }
  };

  const handleUpdateTeam = async (e) => {
    const { team_id, name, image_url } = e;
    const { data, error } = await supabase
      .from("teams")
      .update({ name: name, image_url: image_url })
      .eq("team_id", team_id)
      .select();

    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage("Team edited successfully!");
    fetchTeamsData();
    console.log("EVENT", e);
    console.log("DATA", data);
  };

  return (
    <>
      <Table.Tr>
        <Table.Td>{team.name}</Table.Td>
        <Table.Td>
          <img src={team.image_url} alt="" className="h-12 w-12" />
        </Table.Td>

        <Table.Td>
          <Button variant="outline" onClick={open}>
            Edit
          </Button>
        </Table.Td>
        <Table.Td>
          <Button
            variant="outline"
            color="red"
            onClick={() => handleDeleteTeam(team.team_id)}
          >
            Delete
          </Button>
        </Table.Td>
      </Table.Tr>

      <Modal opened={opened} onClose={close} title="Edit Team" centered>
        <form
          onSubmit={handleSubmit(handleUpdateTeam)}
          onChange={handleInputChange}
        >
          <TextInput
            label="ID"
            defaultValue={team.team_id}
            readOnly
            {...register("team_id", {
              required: {
                value: true,
                message: "Preencha o campo de nome",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          <TextInput
            label="Name"
            placeholder="Name"
            mt="sm"
            defaultValue={team.name}
            {...register("name", {
              required: {
                value: true,
                message: "Preencha o campo de nome",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
          <TextInput
            label="Image"
            placeholder="Image url"
            mt="sm"
            defaultValue={team.image_url}
            {...register("image_url", {
              required: {
                value: true,
                message: "Preencha o campo de imagem",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          {errors.image_url && (
            <p className="text-sm text-red-600">{errors.image_url.message}</p>
          )}
          <Flex justify="center" align="center">
            <Button fullWidth type="submit" mt="sm">
              Edit Team
            </Button>
          </Flex>
          <Flex>
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
          </Flex>
        </form>
      </Modal>
    </>
  );
};

export default TeamRow;
