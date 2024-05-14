import { useState, useEffect } from "react";
import { supabase } from "../../db/supabaseClient";
import { useForm } from "react-hook-form";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Flex, TextInput, Table } from "@mantine/core";
import Dashboard from "../../components/Dashboard";
import GameRow from "../../components/GameRow";

const Games = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [gamesData, setGamesData] = useState([]);

  const handleInputChange = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (e) => {
    const { name, image_url } = e;
    const { data, error } = await supabase
      .from("games")
      .insert({ name: name, image_url: image_url })
      .select();
    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      return;
    } else {
      setSuccessMessage("Game added successfully!");
      reset();
      fetchGamesData();
      console.log("EVENT", e);
      console.log("DATA", data);
    }
  };

  async function fetchGamesData() {
    try {
      const { data, error } = await supabase.from("games").select("*");
      if (error) {
        throw error;
      }
      console.log(data);
      setGamesData(data);
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  }

  useEffect(() => {
    fetchGamesData();
  }, []);

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Dashboard>
      <Modal opened={opened} onClose={close} title="Add Game" centered>
        <form onSubmit={handleSubmit(onSubmit)} onChange={handleInputChange}>
          <TextInput
            label="Name"
            placeholder="Name"
            mt="sm"
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
            <Button fullWidth type="submit" mt="sm" color="grape">
              Add Game
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

      <Flex justify="end" pb="md">
        <Button onClick={open}>Add Game</Button>
      </Flex>

      <Table withTableBorder layout="fixed">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {gamesData.map((game) => (
            <GameRow
              key={game.game_id}
              game={game}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              successMessage={successMessage}
              setSuccessMessage={setSuccessMessage}
              fetchGamesData={fetchGamesData}
              handleInputChange={handleInputChange}
            />
          ))}
        </Table.Tbody>
      </Table>
    </Dashboard>
  );
};

export default Games;
